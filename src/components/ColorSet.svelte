<script>
	import { clickOutside, hexToRgb } from '../helpers';

	import colorInfo from '/static/colorInfo.json';
	import MoreInfo from './MoreInfo.svelte';
	import { onMount } from 'svelte';

	export let colorObj;
	export let colorCategory;
	export let color;
	export let Picker;

	let el;
	let colorCategoryPlus = colorCategory + 'Colors';
	let name = colorInfo[colorCategoryPlus][color].name;

	let showMoreInfo = false;

	let whiteOrBlack;

	const instantiatePicker = (Picker) => {
		new Picker({
			parent: el,
			color: colorObj[color],
			onChange: function (colorVal) {
				colorObj[color] = colorVal.hex;
				whiteOrBlack = hexToRgb(colorVal.hex);
			}
		});
	};
	onMount(() => {
		if (Picker) instantiatePicker(Picker);
	});
	$: if (Picker) instantiatePicker(Picker);
</script>

<div class="color-input-column">
	<div bind:this={el} class="input-container">
			<span>
				<label>
					{name}
					<input type="text" bind:value={colorObj[color]} style="border-color: {colorObj[color]}" />
				</label>
				<span class="color-box" style="background-color: {colorObj[color]}" />
			</span>
	</div>

	<div use:clickOutside on:click_outside={() => (showMoreInfo = false)}>
		<button
			on:click={() => (showMoreInfo = !showMoreInfo)}
			class="more-info"
			style="background-color:{colorObj[color]}; color:{whiteOrBlack}"
			>{showMoreInfo ? 'Hide' : 'Show'} More Info</button
		>
		{#if showMoreInfo}
			<div class="more-info-outer">
				<MoreInfo
					colorCategory={colorCategoryPlus}
					colorKey={color}
					color={colorObj[color]}
					background={colorObj[color]}
					buttonText={whiteOrBlack}
				/>
			</div>
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
	.input-container span {
		display: flex;
	}
	label {
		display: flex;
		flex-direction: column;
	}
	.color-box {
		position: relative;
		top: 2.05rem;
		display: inline-block;
		width: 1.5rem;
		height:1.5rem;
		border: solid 1px black;
		margin-left: 1rem
	}

	input {
		padding: 0.5rem;
		border-radius: 0.5rem;
		margin: 0.25rem 0.5rem 0.5rem 0;
	}

	@media only screen and (max-width: 1000px) {
		.color-input-column {
			flex: 0 0 50%;
		}
	}
	@media only screen and (max-width: 500px) {
		.color-input-column {
			flex: 0 0 100%;
		}
	}
</style>
