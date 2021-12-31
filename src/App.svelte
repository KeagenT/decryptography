<script>
	import Quote from './Quote.svelte';
	import ButtonGroup from './ButtonGroup.svelte';

	let sltn_key = {
		"A": " ",
		"B": " ",
		"C": " ",
		"D": " ",
		"E": " ",
		"F": " ",
		"G": " ",
		"H": " ",
		"I": " ",
		"J": " ",
		"K": " ",
		"L": " ",
		"M": " ",
		"N": " ",
		"O": " ",
		"P": " ",
		"Q": " ",
		"R": " ",
		"S": " ",
		"T": " ",
		"U": " ",
		"V": " ",
		"W": " ",
		"X": " ",
		"Y": " ",
		"Z": " ",
	};

	const Difficulty = {
		Easy: "Easy",
		Medium: "Medium",
		Hard: "Hard"
	};

	let difficulties = [...Object.values(Difficulty)];


	let difficulty = Difficulty.Medium;

	function resetKey(sltn_key){
		Object.keys(sltn_key).forEach(v => sltn_key[v] = " ");
	}

	async function changeDifficulty(e){
		difficulty = e.detail.value;
		resetKey(sltn_key);
		let quoteData = await getDifficultyQuote(difficulty);
		quote = await quoteData['content'];
		console.log(quote);
		author = await quoteData['author'];
	}

	async function queryRandomQuote(min, max){
		const apiURL = `https://api.quotable.io/random?minLength=${min}&maxLength=${max}`;
		let quote = await fetch(apiURL);
		quote = await quote.json();
		return quote;
	}

	async function getDifficultyQuote(difficulty){
		if(difficulty === Difficulty.Easy){
			return await queryRandomQuote(50, 100);
		}else if(difficulty === Difficulty.Medium){
			return await queryRandomQuote(101, 150);
		}else if(difficulty === Difficulty.Hard){
			return await queryRandomQuote(151, 200);
		}else{
			return await queryRandomQuote(50, 200);
		}
	}

	let quote = "Oops a quote should go here. Click a difficulty!";
	let author = "Keagen Thomson";

</script>

<center>
	<div class="column">
		<Quote author={author} quote={quote} bind:sltn_key/>
		<ButtonGroup options={difficulties} 
		name={"Difficulty"} 
		value={difficulty} 
		on:change={changeDifficulty}/>
	</div>
</center>


<style>
	:global(:root){
		--page-content: 800px;
		--text-content: 400px;
		--fonts: Helvetica, sans-serif;
		--quote-size: 1.5rem;
		--letter-width: 1rem;
		--monospace: Consolas, monospace;
	}

	:global(*){
		font-family: var(--fonts);
	}

	center {
		display: flex;
		width: 100vw;
		height: 100vh;
		justify-content: center;
	}

	.column {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		max-width: var(--text-content);
		width: 100%;
	}

	@media screen and (max-width: 500px){
		:global(:root){
			--quote-size: 1.25rem;
			--letter-width: .865rem;
		}

		.column{
			margin-right: 1rem;
		}
	}

	@media screen and (max-width: 400px){
		:global(:root){
			--quote-size: 1.2rem;
			--letter-width: .84rem;
		}

		.column{
			margin-right: 1.5rem;
		}
	}


</style>