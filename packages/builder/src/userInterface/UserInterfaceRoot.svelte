<script>

import ComponentsHierarchy from "./ComponentsHierarchy.svelte";
import PagesList from "./PagesList.svelte"
import { store } from "../builderStore";
import getIcon from "../common/icon";
import { isComponent } from "./pagesParsing/searchComponents";
import IconButton from "../common/IconButton.svelte";
import Modal from "../common/Modal.svelte";
import NewComponent from "./NewComponent.svelte";
import CurrentItemPreview from "./CurrentItemPreview.svelte";
import SettingsView from "./SettingsView.svelte";
import PageView from "./PageView.svelte";
import ComponentsPaneSwitcher from "./ComponentsPaneSwitcher.svelte";

let newComponentPicker;  
const newComponent = () => {
    newComponentPicker.show();
}

let settingsView;
const settings = () => {
    settingsView.show();
}

</script>

<div class="root">
    
    <div class="ui-nav">

        <div class="components-list-container">
            <div class="nav-group-header">
                <div>{@html getIcon("sidebar","18")}</div>
                <span class="components-nav-header">Screens</span>
                <div>
                    <IconButton icon="settings" 
                                size="14px"
                                on:click={settings}/>
                    <IconButton icon="plus" 
                                on:click={newComponent}/>
                </div>
            </div>
            <div class="nav-items-container">
                <ComponentsHierarchy components={$store.screens}/>
            </div>
        </div>

        <div class="pages-list-container">
            <div class="nav-group-header">
                <div>{@html getIcon("grid","18")}</div>
                <span>Pages</span>
            </div>
            <div class="nav-items-container">
                <PagesList />
            </div>
        </div>

    </div>

    <div class="preview-pane">
        {#if $store.currentFrontEndType === "screen"}
        <CurrentItemPreview />
        {:else if $store.currentFrontEndType === "page"}
        <PageView />
        {/if} 
    </div>

    {#if $store.currentFrontEndType === "screen"}
    <div class="components-pane">
        <ComponentsPaneSwitcher />
    </div>
    {/if}

</div>


<NewComponent bind:this={newComponentPicker}/>
<SettingsView bind:this={settingsView} />


<style>

.root {
    display: grid;
    grid-template-columns: 250px 1fr 300px;
    height: 100%;
    width: 100%;
}

.ui-nav {
    grid-column: 1;
    background-color: var(--secondary5);
    height: 100%;
}

.preview-pane {
    grid-column: 2;
}

.components-pane {
    grid-column: 3;
    background-color: var(--secondary5);
    min-height: 0px;
    overflow-y: hidden;
}

.pages-list-container {
    padding-top: 2rem;
}

.components-nav-header {
    font-size: .9rem;
}

.nav-group-header {
    font-size: .9rem;
    padding-left: 1rem;
}

.nav-items-container {
    padding: 1rem 1rem 0rem 1rem;
}

.nav-group-header {
    display:grid;
    grid-template-columns: [icon] auto [title] 1fr [button] auto;
    padding: 2rem 1rem 0rem 1rem;
    font-size: .9rem;
    font-weight: bold;
}

.nav-group-header>div:nth-child(1) {
    padding: 0rem .5rem 0rem 0rem;
    vertical-align: bottom;
    grid-column-start: icon;
    margin-right: 5px;
}

.nav-group-header>span:nth-child(2) {
    margin-left:5px;
    vertical-align: bottom;
    grid-column-start: title;
    margin-top:auto;
}

.nav-group-header>div:nth-child(3) {
    vertical-align: bottom;
    grid-column-start: button;
    cursor: pointer;
    color: var(--primary75);
}

.nav-group-header>div:nth-child(3):hover {
    color: var(--primary75);   
}

</style>