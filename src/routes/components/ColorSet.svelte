<script>
	import { clickOutside } from '../../helpers';

	import colorInfo from '/static/colorInfo.json';
	import MoreInfo from './MoreInfo.svelte';
	import { onMount } from 'svelte';

	export let colorObj;
	export let colorCategory;
	export let color;
	export let i;
	export let Picker;

	let el;
	let colorCategoryPlus = colorCategory + 'Colors';
	let name = colorInfo[colorCategoryPlus][color].name;

	let showMoreInfo = false;

	const instantiatePicker = (Picker) => {
		new Picker({
			parent: el,
			color: colorObj[color],
			onChange: function (colorVal) {
				colorObj[color] = colorVal.hex;
			}
		});
	};
	$: if (Picker) instantiatePicker(Picker);
</script>

<div class="color-input-column">
	<div bind:this={el} class="input-container">
		<span class="input-container_inner">
			<label>
				{name}
				<input type="text" bind:value={colorObj[color]} style="border-color: {colorObj[color]}" />
			</label>
		</span>
		<span class="color-box" style="background-color: {colorObj[color]}" />
	</div>
	<div use:clickOutside on:click_outside={() => (showMoreInfo = false)}>
		<button on:click={() => (showMoreInfo = !showMoreInfo)} class="more-info"
			>{showMoreInfo ? 'Hide' : 'Show'} More Info</button
		>
		{#if showMoreInfo}
			<MoreInfo colorCategory={colorCategoryPlus} colorKey={color} />
		{/if}
	</div>
</div>

<style>
	.color-input-column {
		display: flex;
		flex-direction: column;
		flex: 0 0 25%;
		margin-bottom: 1rem;
	}
	.input-container {
		display: flex;

		align-items: center;
	}

	.input-container_inner {
		flex-basis: min-content;
	}

	input {
		padding: 0.5rem;
		border-radius: 0.5rem;
		margin: 0.25rem 0.5rem 0.5rem 0;
	}
	.color-box {
		position: relative;
		top: 7px;
		display: inline-block;
		width: 25px;
		height: 25px;
		border: solid 1px black;
	}
	.more-info {
		margin-bottom: 0.5rem;
	}
</style>
