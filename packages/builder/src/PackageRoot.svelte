<script>

import IconButton from "./common/IconButton.svelte";
import { store } from "./builderStore";
import UserInterfaceRoot from "./userInterface/UserInterfaceRoot.svelte";
import BackendRoot from "./BackendRoot.svelte";
import { fade } from "svelte/transition";

</script>

<div class="root">

    <div class="top-nav">
        <IconButton icon="home" 
                    color="var(--slate)"
                    hoverColor="var(--secondary75)"/>
        <span class:active={$store.isBackend}
              class="topnavitem"
              on:click={store.showBackend}>
              Backend
        </span>
        <span class:active={!$store.isBackend}
              class="topnavitem"
              on:click={store.showFrontend}>
              Frontend
        </span>
    </div>

    <div class="content">
        {#if $store.isBackend}
        <div in:fade out:fade>
            <BackendRoot />
        </div>
        {:else}
        <div in:fade out:fade>
            <UserInterfaceRoot />
        </div>
        {/if}
    </div>
    
</div>

<style>

.root {
    height:100%;
    width:100%;
    display: flex;
    flex-direction: column;
}

.top-nav {
    flex: 0 0 auto;
    height: 25px;
    background: white;
    padding: 5px;
    width: 100%;
}

.content {
    flex: 1 1 auto;
    width: 100%;
    height: 100px;
}

.content > div {
    height:100%;
    width:100%;
}

.topnavitem {
    cursor: pointer;
    color: var(--secondary50);
    padding: 0px 15px;
    font-weight: 600;
    font-size: .9rem;
}

.topnavitem:hover {
    color: var(--secondary75);
    font-weight: 600;

}

.active {
    color: var(--primary100);
    font-weight: 900;
}


</style>