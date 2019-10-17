
export const componentName = _component => 
    typeof _component === "string" ? _component 
    : typeof _component === "object" ? _component.name
    : "";

export const isComponentSet = _component => 
    !!componentName(_component) ;


export const splitName = _component => {
    const fullname = componentName(_component);
    const componentName = $(fullname, [
        split("/"),
        last
    ]);

    const libName =fullname.substring(
        0, fullname.length - componentName.length - 1);

    return {libName, componentName}; 
}