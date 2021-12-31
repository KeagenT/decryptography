<script>
    import CharInput from './CharInput.svelte';
    export let quote;
    export let author;
    export let width = 25;
    export let sltn_key;
    const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    let Alphabet = ALPHABET;
    let AlphabetM = new Map();
    $: AlphabetMap = buildMap(ALPHABET, AlphabetM)
    $: encryptedQuote = encodeSentence(quote);
    $: wrappedQuote = wrap(encryptedQuote, width);
    $: inputWrapped = inputWrapper(wrappedQuote);

    function isAlpha(letter){
        return AlphabetMap.get(letter) !== undefined;
    }

    function inputWrapper(wrappedQuote){
        let output = [];
        wrappedQuote.forEach(element => {
            output.push(inputLetterMap(element));
            output.push(element);
        });
        return output
    }


    function buildMap(array, Map){
        const length = array.length;
        for(let i = 0; i<length; i++){
            let letter = array[i];
            Map.set(letter, i);
        }
        return Map;
    }

    function shuffle(input) {
        let currentIndex = input.length, randomIndex;
        while(currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [input[currentIndex], input[randomIndex]] = [input[randomIndex], input[currentIndex]];
        }
        return input;
    }

    function mappedLetter(letter) {
        return isAlpha(letter) ? Alphabet[AlphabetMap.get(letter)] : letter;
    }


    function encodeSentence(input){
        let output = input.toUpperCase();
        output = [...output];
        output = output.map((x) => mappedLetter(x));
        output = output.join("");
        return output;
    }

    function inputLetterMap(input){
        let output = [...input];
        output = output.map((x) => {
            return isAlpha(x) ? x : " "; });
        output = output.join("");
        return output;
    }

    function wrap(string, width){

        let wrapped = (string.replace(
            new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g'), '$1\n'
        ));
        wrapped = wrapped.split("\n");
        return wrapped;
    }

    import {onMount} from 'svelte';

    onMount( () => {
        shuffle(Alphabet);
    })

</script>
<div class = "quote-group">
    {#each inputWrapped as line, i}
        {#if i%2==0}
            <CharInput pattern={line} bind:sltn_key/>
        {:else if i%2!=0}
            <h2>{line}</h2>
        {/if}
    {/each}
    <p>- {author}</p>
</div>


<style>
.quote-group {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: var(--text-content);
    margin-bottom: 1rem;
}

h2 {
    letter-spacing: .175rem;
    font-size: var(--quote-size);
    font-family: monospace;
    margin: 0 0 .5rem 0;
    text-align: end;
    max-width: var(--text-content);
    width: 100%;
    align-self: flex-end;
}

p {
    margin: .5rem 0;
    font-weight: 300;
    font-size: 1rem;
    align-self: flex-end;
}

</style>