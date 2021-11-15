<script>
	import { fade, slide } from 'svelte/transition';

	import colorInfo from '/static/colorInfo.json';

	export let colorCategory;
	export let colorKey;
	export let background;
	export let buttonText;

	const description = colorInfo[colorCategory][colorKey].description;
	const tags = colorInfo[colorCategory][colorKey].tags;
	const scopes = colorInfo[colorCategory][colorKey].scopes;

	let showAdvancedInfo = false;
</script>

<div class="more-info" transition:slide={{ duration: 300 }}>
	<div>{description}</div>
	<button
		class="show-advanced"
		style="background-color:{background}; color:{buttonText}"
		on:click={() => (showAdvancedInfo = !showAdvancedInfo)}
		>{showAdvancedInfo ? 'Hide' : 'Show'} Tags/Scopes</button
	>
	{#if showAdvancedInfo}
		<div transition:slide={{ duration: 300 }}>
			{#if tags.length > 0}
				<h5>tags</h5>
				<ul>
					{#each tags as tag}
						<li>{tag}</li>
					{/each}
				</ul>
			{/if}
			{#if scopes.length > 0}
				<h5>scopes</h5>
				<ul>
					{#each scopes as scope}
						<li>{scope}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>

<style>
	.more-info {
		z-index: 1;
		background: white;
		position: absolute;
		border: solid 1px a5a5a5;
		border-top: none;
		box-shadow: 2px 3px 5px 1px #a5a5a5;
		padding: 0.5rem;
		max-height: 30rem;
		max-width: 30rem;
		overflow-y: scroll;
		margin-top: 1rem;
	}
	.show-advanced {
		margin-top: 0.5rem;
	}
</style>
