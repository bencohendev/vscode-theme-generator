<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	import template1 from '/static/template1.json';
	import ColorSet from '../components/ColorSet.svelte';
	import CodeFrame from '../components/CodeFrame.svelte';
	import Header from '../components/Header.svelte';

	let Picker; //color picker
	let showVsCode = false;
	let showDownload = false;
	let showDownloadList = false
	let showCopy = false;
	let showSuccess = false;
	let downloadButton;
	let downloadListButton

	let themeName = '';

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

	let generatedList = {}

	let baseColorsArr = [
		'primaryBackground',
		'secondaryBackground',
		'activityBarBackground',
		'primaryForeground',
		'secondaryForeground',
		'classes',
		'functions',
		'parameters',
		'keywords',
		'variables',
		'errors',
		'strings',
		'selectionHighlight'
	];
	let baseColors = {
		primaryBackground: '#282A36',
		primaryForeground: '#F8F8F2',
		secondaryBackground: '#44475A',
		secondaryForeground: '#6272A4',
		classes: '#8BE9FD',
		functions: '#50FA7B',
		parameters: '#FFB86C',
		keywords: '#FF79C6',
		variables: '#BD93F9',
		errors: '#FF5555',
		strings: '#F1FA8C',
		selectionHighlight: '#424450',
		activityBarBackground: '#343746'
	};

	let ansiColorsArr = [
		'ansiBlack',
		'ansiRed',
		'ansiGreen',
		'ansiYellow',
		'ansiBlue',
		'ansiMagenta',
		'ansiCyan',
		'ansiWhite',
		'ansiBrightestBlack',
		'ansiBrightestRed',
		'ansiBrightestGreen',
		'ansiBrightestYellow',
		'ansiBrightestBlue',
		'ansiBrightestMagenta',
		'ansiBrightestCyan',
		'ansiBrightestWhite'
	];

	let ansiColors = {
		ansiBlack: '#21222C',
		ansiRed: '#FF5555',
		ansiGreen: '#50FA7B',
		ansiYellow: '#F1FA8C',
		ansiBlue: '#BD93F9',
		ansiMagenta: '#FF79C6',
		ansiCyan: '#8BE9FD',
		ansiWhite: '#F8F8F2',
		ansiBrightestBlack: '#6272A4',
		ansiBrightestRed: '#FF6E6E',
		ansiBrightestGreen: '#69FF94',
		ansiBrightestYellow: '#FFFFA5',
		ansiBrightestBlue: '#D6ACFF',
		ansiBrightestMagenta: '#FF92DF',
		ansiBrightestCyan: '#A4FFFF',
		ansiBrightestWhite: '#FFFFFF'
	};

	let advancedColors = {
		pureBlack: "#000000ff",
		pureWhite: "#FFFFFFff",
		statusBar: '#c7c7c7ff'
	}

	let advancedColorsArr = [
		'pureBlack',
		'pureWhite',
		'statusBar'
	]

	let showColorCategory = {
		base: true,
		ansi: false,
		advanced: false
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
		const replaceEditorColors = (colorsObj, colorsArr, templateObj, key, val) => {
			const replacementKey = colorsArr.find((color) => {
				return val.includes(color);
			});
			if (replacementKey) {
				let newColor;
				//if hardcoded opacity in template, replace set opacity
				if (templateObj[key].length > replacementKey.length) {
					const opacityVal = templateObj[key].substring(
						templateObj[key].length - 2,
						templateObj[key].length
					);
					const replacementVal = colorsObj[replacementKey].substring(
						0,
						colorsObj[replacementKey].length - 2
						);
						newColor = replacementVal + opacityVal;
				} else {
					//set new color with opacity
					newColor = templateObj[key].replace(
						replacementKey,
						`${colorsObj[replacementKey]}`
						);
				}
				templateObj[key] = newColor;
			}
		};
		/*set theme guide*/
		//base colors
		Object.entries(newTemplate.colorList).forEach(([key, val]) => {
			replaceEditorColors(baseColors, baseColorsArr, newTemplate.colorList,key, val);
		});
		//ansi colors
		Object.entries(newTemplate.colorList).forEach(([key, val]) => {
			replaceEditorColors(ansiColors, ansiColorsArr, newTemplate.colorList,key, val);
		});
		//advanced colors
		Object.entries(newTemplate.colorList).forEach(([key, val]) => {
			replaceEditorColors(advancedColors, advancedColorsArr, newTemplate.colorList,key, val);
		});
		/*end set theme guide*/
		/*change editor colors*/
		//base colors
		Object.entries(newTemplate.colors).forEach(([key, val]) => {
			replaceEditorColors(baseColors, baseColorsArr, newTemplate.colors,key, val);
		});
		//ansi colors
		Object.entries(newTemplate.colors).forEach(([key, val]) => {
			replaceEditorColors(ansiColors, ansiColorsArr, newTemplate.colors,key, val);
		});
		//advanced colors
		Object.entries(newTemplate.colors).forEach(([key, val]) => {
			replaceEditorColors(advancedColors, advancedColorsArr, newTemplate.colors,key, val);
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

		newTemplate.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (advancedColors[tokenKey]) {
				token.settings.foreground = advancedColors[tokenKey];
			}
		});

		generatedSettings['workbench.colorCustomizations'] = newTemplate.colors;
		generatedSettings['editor.tokenColorCustomizations']['textMateRules'] = newTemplate.tokenColors;
		generatedSettings = JSON.stringify(generatedSettings);

		generatedTemplate = newTemplate;
		generatedTemplate.name = themeName;
		generatedTemplate = JSON.stringify(generatedTemplate);

		generatedList = JSON.stringify(newTemplate.colorList)

		showDownload = true;
		showCopy = true;
		showDownloadList = true

		generateSuccess();
	};

	const downloadThemeHandler = () => {
		let filename = 'theme.json';
		let blob = new Blob([generatedTemplate], { type: 'application/json' });
		downloadButton.download = filename;
		downloadButton.innerHTML = 'Theme Downloaded';
		downloadButton.href = window.URL.createObjectURL(blob);
	};
	const downloadListHandler = () => {
		let filename = 'list.json';
		let blob = new Blob([generatedList], { type: 'application/json' });
		downloadListButton.download = filename;
		downloadListButton.innerHTML = 'Color List Downloaded';
		downloadListButton.href = window.URL.createObjectURL(blob);
	}
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
				<span class="base" in:slide={{ duration: 500 }}>
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
				<span in:slide={{ duration: 500 }}>
					<div class="color-input-row">
						{#each ansiColorsArr as color}
							<ColorSet colorObj={ansiColors} colorCategory={'ansi'} {color} {Picker} />
						{/each}
					</div>
				</span>
			{/if}
		</div>
		<div>
			<div class="color-header">
				<span><h3>Advanced Colors</h3></span>
				<span>
					<button on:click={() => showColorCategoryHandler('advanced')}
						>{showColorCategory.advanced ? 'Hide' : 'Show'}</button
					>
				</span>
			</div>
			{#if showColorCategory.advanced}
				<span in:slide={{ duration: 500 }}>
					<div class="color-input-row">
						{#each advancedColorsArr as color}
							<ColorSet colorObj={advancedColors} colorCategory={'advanced'} {color} {Picker} />
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
				<a href="" bind:this={downloadButton} on:click={() => downloadThemeHandler()}
					>Download Your Theme</a
				>
			</div>
		{/if}
		{#if showCopy}
			<div class="generate-btn-container">
				<button on:click={() => copyHandler()}>Copy to Clipboard</button>
			</div>
		{/if}
		{#if showDownloadList}
		<div class="generate-btn-container">
			<a href="" bind:this={downloadListButton} on:click={() => downloadListHandler()}>Download List of Selected Colors</a>
		</div>
	{/if}
	</div>
	
	{#if showVsCode}
		<CodeFrame />
	{/if}
</main>

<style>
	@import '/static/global.css';
	main {
		max-width: 1280px;
		margin: auto;
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
