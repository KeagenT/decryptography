<script>
    import { createEventDispatcher } from 'svelte';
    export let options = [];
    export let value = options[0];
    export let name;
    const dispatch = createEventDispatcher();

    function setSelected(e){
        let changedTo = e.target.value;

        value = changedTo;
        dispatch('change', {value});
    }

    function btnCls(i, len){
        if(i==0){
            return "first"
        } else if( i== len-1){
            return "last"
        } else {
            return "middle"
        }
    }
</script>

{#if options.length > 1}
    <div class = "buttons">
        {#each options as option, i}
            <button value={option} 
            name={name} id={option} 
            class={btnCls(i, options.length)} 
            class:selected={option===value} 
            on:click={setSelected}>{option.toUpperCase()}</button>
        {/each}
    </div>
{/if}


<style>
    .buttons {
        --bg-color: white;
        --txt-color: black;
        --border-color: rgb(73, 73, 73);
        width: var(--text-content);
        display: flex;
        justify-content: flex-end;
    }

    .buttons button {
        padding: .5rem .75rem;
        font-weight: bold;
        background-color: var(--bg-color);
        color: var(--txt-color);
        border-style: none;
        border-width: 1px;
        border-radius: .25rem;
        margin: 0;
        border-color: var(--border-color);
    }

    .buttons button:hover {
        cursor: pointer;
    }

    .buttons button.selected {
        --bg-color: black;
        --txt-color: white;
    }

    .buttons button.first {
        border-radius: .25rem 0 0 .25rem;
        border-style: solid none solid solid;
    }

    .buttons button.last {
        border-radius: 0 .25rem .25rem 0;
        border-style: solid solid solid none;
    }

    .buttons button.middle {
        border-radius: 0;
        border-style: solid none;
    }
</style>