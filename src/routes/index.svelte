<script>
	import { onMount } from 'svelte';
	import template1 from '/static/template1.json';
	import ColorSet from './components/ColorSet.svelte';
	import CodeFrame from './components/CodeFrame.svelte';

	let Picker;
	let showVsCode = false;
	let themeName = '';

	let newTemplate = {
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
	let brightColorsArr = ['brightColorA', 'brightColorB'];
	let brightColors = {
		brightColorA: '#E9F284',
		brightColorB: '#8BE9FE'
	};
	let otherColorsArr = [
		'otherColorA',
		'otherColorB',
		'otherColorC',
		'otherColorD',
		'otherColorE',
		'otherColorF',
		'otherColorG',
		'otherColorH'
	];
	let otherColors = {
		otherColorA: '#44475A75',
		otherColorB: '#FFFFFF1A',
		otherColorC: '#FFFFFF',
		otherColorD: '#44475A70',
		otherColorE: '#424450',
		otherColorF: '#343746',
		otherColorG: '#21222C',
		otherColorH: '#191A21'
	};

	let output = {
		baseColorA: [],
		baseColorB: [],
		baseColorC: [],
		baseColorD: [],
		baseColorE: [],
		baseColorF: [],
		baseColorG: [],
		baseColorH: [],
		baseColorI: [],
		baseColorJ: [],
		baseColorK: [],
		ansiColorA: [],
		ansiColorB: [],
		ansiColorC: [],
		ansiColorD: [],
		ansiColorE: [],
		ansiColorF: [],
		ansiColorG: [],
		ansiColorH: [],
		ansiColorI: [],
		ansiColorJ: [],
		ansiColorK: [],
		ansiColorL: [],
		ansiColorM: [],
		ansiColorN: [],
		ansiColorO: [],
		ansiColorP: [],
		otherColorA: [],
		otherColorB: [],
		otherColorC: [],
		otherColorD: [],
		otherColorE: [],
		otherColorF: [],
		otherColorG: [],
		otherColorH: [],
		brightColorA: [],
		brightColorB: []
	};

	const generateTheme = () => {
		/*change editor colors*/
		const replaceEditorColors = (colorsObj, colorsArr, key, val) => {
			const replaceIfTrue = colorsArr.find((color) => {
				return val.includes(color);
			});
			if (replaceIfTrue) {
				const newColor = template1.colors[key].replace(
					replaceIfTrue,
					`${colorsObj[replaceIfTrue]}`
				);
				template1.colors[key] = newColor;
			}
		};
		//base colors
		Object.entries(template1.colors).forEach(([key, val]) => {
			replaceEditorColors(baseColors, baseColorsArr, key, val);
		});
		//ansi colors
		Object.entries(template1.colors).forEach(([key, val]) => {
			replaceEditorColors(ansiColors, ansiColorsArr, key, val);
		});
		//bright other colors
		Object.entries(template1.colors).forEach(([key, val]) => {
			replaceEditorColors(brightColors, brightColorsArr, key, val);
		});
		//other colors
		Object.entries(template1.colors).forEach(([key, val]) => {
			replaceEditorColors(otherColors, otherColorsArr, key, val);
		});
		/*end change editor colors*/

		/*change tokenColors functions*/
		template1.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (baseColors[tokenKey]) {
				token.settings.foreground = baseColors[tokenKey];
				output[tokenKey].push(token.scope);
			}
		});

		template1.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (ansiColors[tokenKey]) {
				token.settings.foreground = ansiColors[tokenKey];
				output[tokenKey].push(token.scope);
			}
		});

		template1.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (brightColors[tokenKey]) {
				token.settings.foreground = brightColors[tokenKey];
				output[tokenKey].push(token.scope);
			}
		});

		template1.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (otherColors[tokenKey]) {
				token.settings.foreground = otherColors[tokenKey];
				output[tokenKey].push(token.scope);
			}
		});

		newTemplate['workbench.colorCustomizations'] = template1.colors;
		newTemplate['editor.tokenColorCustomizations']['textMateRules'] = template1.tokenColors;
		newTemplate = JSON.stringify(newTemplate);
		addDownloadButton(newTemplate);
	};

	const addDownloadButton = (template) => {
		let filename = 'theme.json';
		let blob = new Blob([template], { type: 'application/json' });
		let link = document.createElement('a');
		link.download = filename;
		link.innerHTML = 'Download Your Theme';
		link.href = window.URL.createObjectURL(blob);
		document.body.appendChild(link);
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
	<span>
		<h3>Base Colors</h3>
		<div class="color-input-row">
			{#each baseColorsArr as color, i}
				<ColorSet colorObj={baseColors} colorCategory={'base'} {color} {i} {Picker} />
			{/each}
		</div>
	</span>
	<span>
		<h3>ANSI Colors</h3>
		<div class="color-input-row">
			{#each ansiColorsArr as color, i}
				<ColorSet colorObj={ansiColors} colorCategory={'ansi'} {color} {i} {Picker} />
			{/each}
		</div>
	</span>
	<span>
		<h3>Bright Other Colors</h3>
		<div class="color-input-row">
			{#each brightColorsArr as color, i}
				<ColorSet colorObj={brightColors} colorCategory={'bright'} {color} {i} {Picker} />
			{/each}
		</div>
	</span>
	<span>
		<h3>Other Colors</h3>
		<div class="color-input-row">
			{#each otherColorsArr as color, i}
				<ColorSet colorObj={otherColors} colorCategory={'other'} {color} {i} {Picker} />
			{/each}
		</div>
	</span>
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
		align-items: center;
		justify-content: left;
		padding: 2rem;
		flex-direction: row;
		flex-wrap: wrap;
	}
</style>
