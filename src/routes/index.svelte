<script>
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	import template1 from '/static/template1.json';
	import ColorSet from '../components/ColorSet.svelte';
	import CodeFrame from '../components/CodeFrame.svelte';
	import Header from '../components/Header.svelte';

	let Picker; //color picker
	let showVsCode = false;
	let showDownload = false;
	let showCopy = false;
	let showSuccess = false;
	let downloadButton;

	let themeName = '';

	let divEl = null;
	let editor;
	let Monaco;

	/**
	 * @param generatedTemplate downloadable template for creating/publishing a theme
	 */
	let generatedTemplate = {};

	/**
	 * @param generatedSettings copyable settings that can go directly into settings.json
	 */
	let generatedSettings = {
		'workbench.colorCustomizations': {},
		'editor.tokenColorCustomizations': {
			textMateRules: []
		}
	};
	let baseColorsArr = [
		'baseColorA',
		'baseColorC',
		'baseColorM',
		'baseColorB',
		'baseColorD',
		'baseColorE',
		'baseColorF',
		'baseColorG',
		'baseColorH',
		'baseColorI',
		'baseColorJ',
		'baseColorK',
		'baseColorL'
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
		baseColorK: '#F1FA8C',
		baseColorL: '#424450',
		baseColorM: '#343746'
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
		generatedSettings = {
			'workbench.colorCustomizations': {},
			'editor.tokenColorCustomizations': {
				textMateRules: []
			}
		};
		generatedTemplate = {};
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
			}
		});

		newTemplate.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (ansiColors[tokenKey]) {
				token.settings.foreground = ansiColors[tokenKey];
			}
		});

		generatedSettings['workbench.colorCustomizations'] = newTemplate.colors;
		generatedSettings['editor.tokenColorCustomizations']['textMateRules'] = newTemplate.tokenColors;
		generatedSettings = JSON.stringify(generatedSettings);

		generatedTemplate = newTemplate;
		generatedTemplate.name = themeName;
		generatedTemplate = JSON.stringify(generatedTemplate);

		showDownload = true;
		showCopy = true;

		generateSuccess();
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

	const generateSuccess = () => {
		showSuccess = true;
		setTimeout(() => {
			showSuccess = false;
		}, 3000);
	};
	onMount(() => {
		/**anonymous async function to allow normal onMount lifecycle*/
		(async () => {
			Picker = (await import('vanilla-picker')).default;

			// @ts-ignore
			self.MonacoEnvironment = {
				getWorker: function (_moduleId, label) {
					if (label === 'json') {
						return new jsonWorker();
					}
					if (label === 'css' || label === 'scss' || label === 'less') {
						return new cssWorker();
					}
					if (label === 'html' || label === 'handlebars' || label === 'razor') {
						return new htmlWorker();
					}
					if (label === 'typescript' || label === 'javascript') {
						return new tsWorker();
					}
					return new editorWorker();
				}
			};

			Monaco = await import('monaco-editor');
			editor = Monaco.editor.create(divEl, {
				value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
				language: 'javascript'
			});

			return () => {
				editor.dispose();
			};
		})();
	});
</script>

<Header />
<main>
	<h1>Visual Studio Code Theme Generator</h1>
	<p>
		Select colors using the following inputs and click generate to download your custom theme json.
		Then you can either download a json file to use with the Vs Code yo generator, or click the copy
		button and just paste the results directly into your settings.json file. You can also click the
		'Show Vs Code' button to open a browser instance of Vs Code directly in the page and try your
		theme out there by pasting the results into your settings.json.
	</p>
	<div>
		<div>
			<label>
				Theme Name
				<input type="text" bind:value={themeName} />
			</label>
		</div>
		<div>
			<div class="color-header">
				<span><h3>Base Colors</h3></span>
				<span>
					<button on:click={() => showColorCategoryHandler('base')}
						>{showColorCategory.base ? 'Hide' : 'Show'}</button
					>
				</span>
			</div>
			{#if showColorCategory.base}
				<span class="base" transition:slide={{ duration: 300 }}>
					<div class="color-input-row">
						{#each baseColorsArr as color}
							<ColorSet colorObj={baseColors} colorCategory={'base'} {color} {Picker} />
						{/each}
					</div>
				</span>
			{/if}
		</div>
		<div>
			<div class="color-header">
				<span><h3>Terminal Colors</h3></span>
				<span>
					<button on:click={() => showColorCategoryHandler('ansi')}
						>{showColorCategory.ansi ? 'Hide' : 'Show'}</button
					>
				</span>
			</div>
			{#if showColorCategory.ansi}
				<span transition:slide={{ duration: 300 }}>
					<div class="color-input-row">
						{#each ansiColorsArr as color}
							<ColorSet colorObj={ansiColors} colorCategory={'ansi'} {color} {Picker} />
						{/each}
					</div>
				</span>
			{/if}
		</div>
	</div>
	<div class="generate-btn-row">
		{#if showSuccess}
			<div class="generate-btn-container">
				<button class="generate-btn-success" on:click={generateTheme}>Theme Generated</button>
			</div>
		{:else}
			<div class="generate-btn-container">
				<button class="generate-btn" on:click={generateTheme}>Generate Theme</button>
			</div>
		{/if}
		<div class="generate-btn-container">
			<button on:click={() => (showVsCode = !showVsCode)}
				>{showVsCode ? 'Hide' : 'Show'} Vs Code</button
			>
		</div>
		{#if showDownload}
			<div>
				<a href="" bind:this={downloadButton} on:click={() => downloadHandler()}
					>Download Your Theme</a
				>
			</div>
		{/if}
		{#if showCopy}
			<div class="generate-btn-container">
				<button on:click={() => copyHandler()}>Copy to Clipboard</button>
			</div>
		{/if}
	</div>
	{#if showVsCode}
		<CodeFrame />
	{/if}
	<div bind:this={divEl} class="h-screen" />
</main>

<style>
	@import '/static/global.css';

	.h-screen {
		height: 500px;
	}
	main {
		max-width: 1280px;
		margin: auto;
	}
	span {
		display: inline-block;
	}

	input {
		padding: 0.5rem;
		border-radius: 0.5rem;
		margin: 0.25rem 0.5rem 0.5rem 0;
	}

	.color-header {
		display: flex;
		align-items: center;
	}
	.color-header span {
		margin-right: 1rem;
	}
	.generate-btn-row {
		margin: 2rem 0 4rem;
		display: flex;
		align-items: center;
	}
	.generate-btn-container,
	a {
		margin-right: 1rem;
	}

	.generate-btn {
		padding: 1rem;
		background-color: rgb(115, 204, 255);
		color: rgb(0, 0, 0);
	}
	.generate-btn-success {
		padding: 1rem;
		background-color: rgb(0, 212, 64);
		color: rgb(0, 0, 0);
	}
	.color-input-row {
		display: flex;
		padding: 0.5rem 2rem 2rem;
		flex-wrap: wrap;
	}
</style>
