<script>
    export let pattern = [];
    export let sltn_key;

    function fixInput(e){
		let letter = e.target.value;
		letter = letter.trim();
        letter = letter.toUpperCase();
		if(sltn_key[letter] == undefined){
			letter = " ";
		}
		e.target.value = letter;
	}
    
</script>
<div class = "input-row">
    {#each pattern as letter}
        {#if letter !==" "}
            <input class="letter" name={letter} maxlength="2" on:input={fixInput} bind:value={sltn_key[letter]}>
        {:else if letter ===" "}
            <span class="non-letter" name={letter}></span>
        {/if}
    {/each}
</div>

<style>
 .letter {
    border-radius: 0px;
    margin: 0;
    font-weight: bold;
    background-color: whitesmoke;
    border: none;
    padding: 0px;
    font-size: var(--quote-size);
    font-family: monospace;
    height: var(--quote-size);
    display: inline-flex;
    max-width: var(--letter-width);
}

.letter:focus {
    border: none;
    outline: none;   
    background-color: rgb(244, 255, 254);
}

.letter:active {
    outline: none;
    border: none;   
    background-color: rgb(244, 255, 254);
}

.non-letter {
    height: var(--quote-size);
    display: inline-flex;
    max-width: var(--letter-width);
    width: 100%;
}

.input-row {
    display: flex;
    justify-content: flex-end;
    max-width: var(--text-content);
    width: 100%;
}
</style>