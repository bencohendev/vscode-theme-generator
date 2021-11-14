<script>
	import colorInfo from '/static/colorInfo.json';

	export let colorCategory;
	export let colorKey;

	const description = colorInfo[colorCategory][colorKey].description;
	const tags = colorInfo[colorCategory][colorKey].tags;
	const scopes = colorInfo[colorCategory][colorKey].scopes;

	let showAdvancedInfo = false;
</script>

<div class="more-info">
	<div>{description}</div>
	<button on:click={() => (showAdvancedInfo = !showAdvancedInfo)}
		>{showAdvancedInfo ? 'Hide' : 'Show'} Advanced Info</button
	>
	{#if showAdvancedInfo}
		<div>
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
	}
</style>
