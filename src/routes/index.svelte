<script>
	import { onMount } from 'svelte';
	import template1 from '/static/template1.json';
	import ColorSet from './components/ColorSet.svelte';
	import CodeFrame from './components/CodeFrame.svelte';
	import { text } from 'svelte/internal';
	/**
	 * @function xyz {}
	 */
	let Picker;
	let showVsCode = false;
	let showDownload = false;
	let showCopy = false;
	let downloadButton;

	let themeName = '';

	let generatedTemplate;
	let generatedSettings = {
		'workbench.colorCustomizations': {},
		'editor.tokenColorCustomizations': {
			textMateRules: []
		}
	};
	let baseColorsArr = [
		'baseColorA',
		'baseColorB',
		'baseColorC',
		'baseColorD',
		'baseColorE',
		'baseColorF',
		'baseColorG',
		'baseColorH',
		'baseColorI',
		'baseColorJ',
		'baseColorK'
	];
	let baseColors = {
		baseColorA: '#282A36',
		baseColorB: '#F8F8F2',
		baseColorC: '#44475A',
		baseColorD: '#6272A4',
		baseColorE: '#8BE9FD',
		baseColorF: '#50FA7B',
		baseColorG: '#FFB86C',
		baseColorH: '#FF79C6',
		baseColorI: '#BD93F9',
		baseColorJ: '#FF5555',
		baseColorK: '#F1FA8C'
	};

	let ansiColorsArr = [
		'ansiColorA',
		'ansiColorB',
		'ansiColorC',
		'ansiColorD',
		'ansiColorE',
		'ansiColorF',
		'ansiColorG',
		'ansiColorH',
		'ansiColorI',
		'ansiColorJ',
		'ansiColorK',
		'ansiColorL',
		'ansiColorM',
		'ansiColorN',
		'ansiColorO',
		'ansiColorP'
	];

	let ansiColors = {
		ansiColorA: '#21222C',
		ansiColorB: '#FF5555',
		ansiColorC: '#50FA7B',
		ansiColorD: '#F1FA8C',
		ansiColorE: '#BD93F9',
		ansiColorF: '#FF79C6',
		ansiColorG: '#8BE9FD',
		ansiColorH: '#F8F8F2',
		ansiColorI: '#6272A4',
		ansiColorJ: '#FF6E6E',
		ansiColorK: '#69FF94',
		ansiColorL: '#FFFFA5',
		ansiColorM: '#D6ACFF',
		ansiColorN: '#FF92DF',
		ansiColorO: '#A4FFFF',
		ansiColorP: '#FFFFFF'
	};

	let showColorCategory = {
		base: true,
		ansi: false
	};

	const showColorCategoryHandler = (category) => {
		showColorCategory[category] = !showColorCategory[category];
	};
	const generateTheme = () => {
		let newTemplate = JSON.parse(JSON.stringify(template1));
		/*change editor colors*/
		const replaceEditorColors = (colorsObj, colorsArr, key, val) => {
			const replacementKey = colorsArr.find((color) => {
				return val.includes(color);
			});
			if (replacementKey) {
				let newColor;
				//if hardcoded opacity in template, replace set opacity
				if (newTemplate.colors[key].length > replacementKey.length) {
					const opacityVal = newTemplate.colors[key].substring(
						newTemplate.colors[key].length - 2,
						newTemplate.colors[key].length
					);
					const replacementVal = colorsObj[replacementKey].substring(
						0,
						colorsObj[replacementKey].length - 2
					);
					newColor = replacementVal + opacityVal;
				} else {
					//set new color with opacity
					newColor = newTemplate.colors[key].replace(
						replacementKey,
						`${colorsObj[replacementKey]}`
					);
				}
				newTemplate.colors[key] = newColor;
			}
		};
		//base colors
		Object.entries(newTemplate.colors).forEach(([key, val]) => {
			replaceEditorColors(baseColors, baseColorsArr, key, val);
		});
		//ansi colors
		Object.entries(newTemplate.colors).forEach(([key, val]) => {
			replaceEditorColors(ansiColors, ansiColorsArr, key, val);
		});

		/*end change editor colors*/

		/*change tokenColors functions*/
		newTemplate.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (baseColors[tokenKey]) {
				token.settings.foreground = baseColors[tokenKey];
				output[tokenKey].push(token.scope);
			}
		});

		newTemplate.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (ansiColors[tokenKey]) {
				token.settings.foreground = ansiColors[tokenKey];
				output[tokenKey].push(token.scope);
			}
		});

		generatedSettings['workbench.colorCustomizations'] = newTemplate.colors;
		generatedSettings['editor.tokenColorCustomizations']['textMateRules'] = newTemplate.tokenColors;
		generatedSettings = JSON.stringify(generatedSettings);
		generatedTemplate = JSON.stringify(newTemplate);
		showDownload = true;
		showCopy = true;
	};

	const downloadHandler = () => {
		let filename = 'theme.json';
		let blob = new Blob([generatedTemplate], { type: 'application/json' });
		downloadButton.download = filename;
		downloadButton.innerHTML = 'Download Your Theme';
		downloadButton.href = window.URL.createObjectURL(blob);
	};
	const copyHandler = () => {
		navigator.clipboard.writeText(generatedSettings).then(
			function () {
				alert('copied to clipboard');
			},
			function () {
				alert('failed');
			}
		);
	};
	onMount(() => {
		/**anonymous async function to allow normal onMount lifecycle*/
		(async () => {
			Picker = (await import('vanilla-picker')).default;
		})();
	});
</script>

<h1>Welcome to Visual Studio Code Theme Generator</h1>
<p>
	select colors using the following inputs and click generate to download your custom theme json
</p>
<div>
	<div>
		<label>
			Theme Name
			<input type="text" bind:value={themeName} />
		</label>
	</div>
	<div>
		<span><h3>Base Colors</h3></span>
		<span>
			<button on:click={() => showColorCategoryHandler('base')}
				>{showColorCategory.base ? 'Hide' : 'Show'}</button
			>
		</span>
		{#if showColorCategory.base}
			<span class="base">
				<div class="color-input-row">
					{#each baseColorsArr as color}
						<ColorSet colorObj={baseColors} colorCategory={'base'} {color} {Picker} />
					{/each}
				</div>
			</span>
		{/if}
	</div>
	<div>
		<span><h3>ANSI Colors</h3></span>
		<span>
			<button on:click={() => showColorCategoryHandler('ansi')}
				>{showColorCategory.ansi ? 'Hide' : 'Show'}</button
			>
		</span>
		{#if showColorCategory.ansi}
			<span>
				<div class="color-input-row">
					{#each ansiColorsArr as color}
						<ColorSet colorObj={ansiColors} colorCategory={'ansi'} {color} {Picker} />
					{/each}
				</div>
			</span>
		{/if}
	</div>
</div>
<div class="generate-btn-container">
	<button on:click={generateTheme}>Generate Theme</button>
</div>
<div>
	<button on:click={() => (showVsCode = !showVsCode)}>{showVsCode ? 'Hide' : 'Show'} Vs Code</button
	>
</div>
{#if showVsCode}
	<CodeFrame />
{/if}
{#if showDownload}
	<a href="" bind:this={downloadButton} on:click={() => downloadHandler()}>Download Your Theme</a>
{/if}
{#if showCopy}
	<button on:click={() => copyHandler()}>Copy to Clipboard</button>
{/if}

<style>
	@import '/static/global.css';
	span {
		display: inline-block;
	}
	.generate-btn-container {
		margin-top: 10rem;
	}
	.color-input-row {
		display: flex;
		padding: 2rem;
		flex-wrap: wrap;
	}
</style>
