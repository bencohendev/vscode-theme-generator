<script>
	import { clickOutside, hexToRgb } from '../helpers';

	import colorInfo from '/static/colorInfo.json';
	import MoreInfo from './MoreInfo.svelte';
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher()

	export let colorObj;
	export let colorCategory;
	export let color;
	export let advancedColorsStatus = undefined
	export let Picker;

	let el;
	let colorCategoryPlus = colorCategory + 'Colors';
	let name = colorInfo[colorCategoryPlus][color].name;
	let isChecked

	let showMoreInfo = false;

	export let whiteOrBlack;

	const handleChecked = () => {
		const advancedColor = advancedColorsStatus[color]
		advancedColor.decoupledFromBase = isChecked
		if (Picker && advancedColor.decoupledFromBase) instantiatePicker(Picker)
		console.log(color, advancedColor);
		dispatch('changeChecked', {color, advancedColor})
	}

	const instantiatePicker = (Picker) => {
		new Picker({
			parent: el,
			color: colorObj[color],
			alpha: false,
			onChange: function (colorVal) {
				colorObj[color] = colorVal.hex.substring(0, 7);
				whiteOrBlack = hexToRgb(colorVal.hex);
				dispatch('changeColor', {name: color, newColorVal: colorVal.hex, whiteOrBlack})
			}
		});
	};
	onMount(() => {
		if (Picker) instantiatePicker(Picker);
	});
	$: if (Picker) instantiatePicker(Picker);
  $: if (colorCategoryPlus == "advancedColors") whiteOrBlack= hexToRgb(colorObj[color]) 
</script>

{#if colorCategoryPlus == "advancedColors"}
<input 
type="checkbox" 
name="" 
id="" 
bind:checked={isChecked} 
on:change={handleChecked}
>
{/if}
<div class="color-input-column">
	{#if colorCategoryPlus == "advancedColors" && (!isChecked)}
	<div class="input-container" 
	>
			<span>
				<label>
					{name}

					<input 
						type="text" 
						bind:value={colorObj[color]} 
						style="border-color: {colorObj[color]}"
						disabled
					/>
				</label>
				<span class="color-box" style="background-color: {colorObj[color]}" />
			</span>
	</div>
	{:else}
	<div bind:this={el} class="input-container" 
	>
			<span>
				<label>
					{name}
					<input 
						type="text" 
						bind:value={colorObj[color]} 
						style="border-color: {colorObj[color]}"
					/>
				</label>
				<span class="color-box" style="background-color: {colorObj[color]}" />
			</span>
	</div>
	{/if}
	<div use:clickOutside on:click_outside={() => (showMoreInfo = false)}>
		{#if colorCategoryPlus == "advancedColors"}
		<div>child of: {advancedColorsStatus[color].associatedBaseTitle}</div>
		{/if}
		<button
			on:click={() => (showMoreInfo = !showMoreInfo)}
			class="more-info"
			style="background-color:{colorObj[color]}; color:{whiteOrBlack}"
		>
			{showMoreInfo ? 'Hide' : 'Show'} More Info
		</button
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
    flex: 1 0 20%;
    margin: 1rem;
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
