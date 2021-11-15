<script>
	import { onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';

	import colorInfo from '/static/colorInfo.json';

	export let colorCategory;
	export let colorKey;
	export let background;
	export let buttonText;

	const description = colorInfo[colorCategory][colorKey].description;
	const tags = colorInfo[colorCategory][colorKey].tags;
	const scopes = colorInfo[colorCategory][colorKey].scopes;
	let el;

	let showAdvancedInfo = false;
</script>

<div class="more-info-container" style="--theme-color: {background}">
	<div bind:this={el} class="more-info">
		<div class="more-info-inner">
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
						<div class="tag-heading" />
						<h5 style="color: {buttonText}">Tags</h5>
						<ul>
							{#each tags as tag}
								<li>{tag}</li>
							{/each}
						</ul>
					{/if}
					{#if scopes.length > 0}
						<span class="tag-heading" />
						<h5 style="color: {buttonText}">Scopes</h5>
						<ul>
							{#each scopes as scope}
								<li>{scope}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.more-info-container {
		position: absolute;
	}
	.more-info-inner {
		overflow-y: scroll;
		max-height: 25rem;
	}
	.more-info-inner::-webkit-scrollbar {
		display: none;
	}
	.more-info {
		z-index: 1;
		background: white;
		position: relative;
		border: solid 1px var(--theme-color);
		box-shadow: 2px 5px 25px 0px var(--theme-color);
		padding: 1rem;
		max-height: 30rem;
		width: 30rem;
		margin-top: 1rem;
		left: -12.8rem;
		top: 1.5rem;
	}

	.tag-heading {
		position: absolute;
		right: 0rem;
		background: linear-gradient(to left, #ffffff, var(--theme-color));
		width: 32rem;
		height: 1rem;
	}
	.show-advanced {
		margin: 0.5rem 0.5rem 0.5rem 1rem;
	}

	.more-info:after,
	.more-info:before {
		bottom: 100%;
		left: 50%;
		border: solid 1px white;
		content: '';
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}

	.more-info:after {
		border-color: rgba(136, 183, 213, 0);
		border-bottom-color: white;
		border-width: 33px;
		margin-left: -33px;
	}
	.more-info:before {
		border-color: rgba(194, 225, 245, 0);
		border-bottom-color: var(--theme-color);
		border-width: 36px;
		margin-left: -36px;
	}
	h5 {
		position: relative;
		margin: 1rem 0 0 1rem;
	}
	ul {
		margin-top: 0.25rem;
	}
</style>
