<main 
style={`
--r:${color.r};
--g:${color.g};
--b:${color.b};
--color:rgb(var(--r), var(--g), var(--b));
`}
>
	<div class="title">
		<h1>What is this color?</h1>
	</div>
	<div class="options">
		{#each labels as l, index}
			<button 
				style={`--c:${l};` + (index == predictedColorIndex ? 'border-color: red' : '')}
				on:click={()=>selectColor(index)}
			>
				{l}
			</button>
		{/each}
		<button on:click={newColor}>skip</button>
	</div>
</main>

<script lang="ts">
	import labels from './labels';
	import type { Color } from './models';
	import { predict } from './tf-model';
	import { pairs } from './store';
	let color: Color = getRndColor();
	let predictedColorIndex = 0;

	function predictColorLabel(c: Color) {
		const index = predict(c);
		predictedColorIndex = index;
	}

	function selectColor(index: number) {
		pairs.add([color, index]);
		newColor();
	}

	function newColor() {
		const newColor = getRndColor();
		color = newColor;
		predictColorLabel(newColor);
	}

	function getRndColor(): Color {
		return {
			r: rndInt(256),
			g: rndInt(256),
			b: rndInt(256)
		};
	}

	function rndInt(max: number) {
		return Math.floor(Math.random() * max);
	}
</script>

<style>
	main {
		/*text color (depends on bg color)*/
		--light-treshold: 145;   /* the threshold at which colors are considered "light." 0 - 255 : 127(half)*/
		--bg-min-max: calc(
			max(var(--r), var(--g), var(--b)) +
			min(var(--r), var(--g), var(--b))
		);
		--bg-lightness: calc(var(--bg-min-max) / 2);

		--text-val: calc((var(--bg-lightness) - var(--light-treshold)) * -255);
		--text-color: rgb(var(--text-val), var(--text-val), var(--text-val));
		background-color: var(--color);
		margin: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-flow: column;
	}
	.title {
		color: var(--text-color);
		text-align: center;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.options {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		background: #fff;
		padding: 2rem;
		border-top-left-radius: 25px;
		border-top-right-radius: 25px;
	}
	.options button {
		box-sizing: border-box;
		display: flex;
		flex-flow: row;
		align-items: center;
		background: #fff;
		background-image: linear-gradient(to left, var(--c) 0px, var(--c) 2rem, #fff 2rem);
		border: 3px solid #ccc;
		font-size: 1.5rem;
		margin: 5px;
		padding: 7px;
		padding-right: 2.3rem;
		border-radius: 20px;
		overflow: hidden;
	}
</style>