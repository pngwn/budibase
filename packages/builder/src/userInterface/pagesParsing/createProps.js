import {
    isString, isUndefined, find,
    keys, uniq, some, filter,
    reduce, cloneDeep, includes,
    last, isPlainObject
} from "lodash/fp";
import { types, expandPropsDefinition } from "./types";
import { assign } from "lodash";
import { pipe } from "../../common/core";
import { isRootComponent } from "./searchComponents";

export const createPropDefinitionForDerived = (allComponents, componentName) => {
    

    const {propDef, derivedProps} = getComponentInfo(allComponents, componentName);

    const hasDerivedProp = k => pipe(derivedProps, [
        keys,
        uniq,
        some(key => key === k)
    ]);

    return pipe(propDef, [
        keys,
        filter(k => !hasDerivedProp(k)),
        reduce((obj, k) => {
            obj[k] = propDef[k];
            return obj;
        }, {}),
        expandPropsDefinition
    ])
}

export const traverseForProps = getComponentInfo;

export const getInstanceProps = (componentInfo, props) => {
    const finalProps = cloneDeep(componentInfo.fullProps);

    for(let p in props) {
        finalProps[p] = props[p];
    }

    return finalProps;
}

export const getNewComponentInfo = (allComponents, inherits) => {
    const parentcomponent = find(c => c.name === inherits)(allComponents);
    const component = {
        name:"", 
        description:"", 
        inherits, 
        props:{}, 
        tags:parentcomponent.tags
    };
    return getComponentInfo(
        allComponents,
        inherits,
        [component],
        {});
}


export const getComponentInfo = (allComponents, comp, stack=[], subComponentProps=null) => {
    // comp may be one of 3 things:
    // - name: "components/my-component-name"
    // - _component obj {name: "components/my-component-name", if: "..", each: ""}
    // - a full component {name: components/my-component-name", props: ".."}
    
    const cname = componentName(comp);
    const component = find(c => c.name === cname)(allComponents);
    if(isRootComponent(component)) {
        subComponentProps = subComponentProps||{};
        const p = createProps(cname, component.props, subComponentProps);
        const rootProps = createProps(cname, component.props);
        const inheritedProps = [];
        const targetComponent = stack.length > 0
                                ? last(stack)
                                : component;
        if(stack.length > 0) {
            
            for(let prop in subComponentProps) {
                const hasProp = pipe(targetComponent.props, [
                                        keys,
                                        includes(prop)]);

                if(!hasProp)
                    inheritedProps.push(prop);
            }
        }
        const unsetProps = pipe(p.props, [
            keys,
            filter(k => !includes(k)(keys(subComponentProps)) && k !== "_component")
        ]);

        const fullProps = cloneDeep(p.props);
        setComponentName(fullProps, targetComponent.name);

        return ({
            propsDefinition:expandPropsDefinition(component.props), 
            inheritedProps,
            rootDefaultProps: rootProps.props,
            unsetProps,
            fullProps: fullProps,
            errors: p.errors,
            component: targetComponent,
            rootComponent: component
        });
    }
    return getComponentInfo(
        allComponents, 
        component.inherits, 
        [component, ...stack],
        {...component.props, ...subComponentProps});
}

export const componentName = _component => 
    isString(_component) ? _component 
    : isPlainObject(_component) ? _component.name
    : "";

export const isComponentSet = _component => 
    !!componentName(_component) ;

export const setComponentName = (props, name) => {
    if(isPlainObject(props._component)) {
        props._component.name = name;
    } else {
        props._component = name;
    }
}

export const createProps = (componentName, propsDefinition, derivedFromProps) => {

    const error = (propName, error) =>
        errors.push({propName, error});

    const props = {
        _component: componentName
    };

    const errors = [];

    if(!componentName)
        error("_component", "Component name not supplied");

    for(let propDef in propsDefinition) {
        const parsedPropDef = parsePropDef(propsDefinition[propDef]);
        if(parsedPropDef.error)
            error(propDef, parsedPropDef.error); 
        else 
            props[propDef] = parsedPropDef;
    }

    if(derivedFromProps) {
        assign(props, derivedFromProps);
    }

    return ({
        props, errors
    });
}

export const createArrayElementProps = (arrayPropName, elementDefinition) => 
    createProps(
        `#${arrayPropName}#array_element`,
        elementDefinition);

const parsePropDef = propDef => {
    const error = message => ({error:message, propDef});

    if(isString(propDef)) {
        if(!types[propDef])
            return error(`Do not recognise type ${propDef}`);
        
        return types[propDef].default();
    }

    if(!propDef.type)
        return error("Property Definition must declare a type");
    
    const type = types[propDef.type];
    if(!type)
        return error(`Do not recognise type ${propDef.type}`);

    if(isUndefined(propDef.default))
        return type.default(propDef);

    if(!type.isOfType(propDef.default))
        return error(`${propDef.default} is not of type ${type}`);

    return propDef.default;
}

export const arrayElementComponentName = (parentComponentName, arrayPropName) => 
    `${parentComponentName}:${arrayPropName}`;

/*
Allowed propDefOptions
- type: string, bool, number, array
- default: default value, when undefined
- required: field is required 
*/