<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	import template1 from '/static/template1.json';
	import joker from "../theme-templates/joker.json"
	import batman from "../theme-templates/batman.json"

	import Header from '../components/Header.svelte';
	import ColorSet from '../components/ColorSet.svelte';
	import CodeFrame from '../components/CodeFrame.svelte';
	import Search from '../components/Search.svelte'

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
		activityBarBackground: '#343746',

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
		ansiBrightestWhite: '#FFFFFF',
	};

	let advancedColors = {
		pureBlack: "#000000",
		pureWhite: "#FFFFFF",
		statusBar: '#343746',
		activeTab: '#282A36'
	}

	let advancedColorsArr = [
		'pureBlack',
		'pureWhite',
		'statusBar',
		'activeTab'
	]

	let advancedColorsStatus = {
		pureBlack: {
			associatedBase: "none",
			associatedBaseTitle: "none",
			decoupledFromBase: false,
			whiteOrBlack: '#ffffff'
		},
		pureWhite: {
			associatedBase: "none",
			associatedBaseTitle: "none",
			decoupledFromBase: false,
			whiteOrBlack: '#000000'
		},
		statusBar: {
			associatedBase: "activityBarBackground",
			associatedBaseTitle: "Activity Bar Background",
			decoupledFromBase: false,
			whiteOrBlack: '#ffffff'
		},
		activeTab : {
			associatedBase: "primaryBackground",
			associatedBaseTitle: "Primary Background",
			decoupledFromBase: false,
			whiteOrBlack: '#000000'
		}
	}

	let showColorCategory = {
		base: true,
		ansi: false,
		advanced: false
	};

	const showColorCategoryHandler = (category) => {
		showColorCategory[category] = !showColorCategory[category];
	};

	const checkAdvancedColors = (e) => {
		const advancedColorKey = e.detail.color
		const advancedColorVal = e.detail.advancedColor
		if(!advancedColorVal.decoupledFromBase) {
			advancedColors[advancedColorKey] = baseColors[advancedColorVal.associatedBase]
		}
	}

	const setAdvancedColors = (advColor) => {
		Object.entries(advancedColorsStatus).forEach((advancedColor) => {
			if (advColor.name == advancedColor[1].associatedBase && !advancedColor[1].decoupledFromBase) {
				advancedColors[advancedColor[0]] = advColor.newColorVal.substring(0,7)
				advancedColor[1].whiteOrBlack = advColor.whiteOrBlack
			}
		})
		advancedColorsStatus = advancedColorsStatus
	}

	const applyExampleTheme = (themeName) => {
		let chosenTheme
		switch (themeName) {
			case 'joker':
				chosenTheme = joker
				themeName = "Joker"
				break;
				case 'batman':
				chosenTheme = batman
				themeName = "Batman"
				break;
		
			default:
				break;
		}
		Object.entries(chosenTheme).forEach(([key, val])=> {
			baseColors[key] = val
			ansiColors[key] = val
			const e = {				
					name: key,
					newColorVal: val,
					whiteOrBlack: "#000000" 				
			}
			setAdvancedColors(e)

		})
		baseColorsArr = [...baseColorsArr]
		ansiColorsArr = [...ansiColorsArr]
	}

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

						newColor = colorsObj[replacementKey] + opacityVal;
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
		let filename =themeName ? `${themeName}.json` : 'theme.json';
		let blob = new Blob([generatedTemplate], { type: 'application/json' });
		downloadButton.download = filename;
		downloadButton.innerHTML = 'Theme Downloaded';
		downloadButton.href = window.URL.createObjectURL(blob);
	};
	const downloadListHandler = () => {
		let filename = themeName ? `${themeName}-list.json` : 'list.json';
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
							{#key baseColorsArr}
									<ColorSet 
										bind:colorObj={baseColors} 
										colorCategory={'base'} 
										{color} 
										{Picker}
										on:changeColor={(e)=>setAdvancedColors(e.detail)}
									/>
								{/key}
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
							{#key ansiColorsArr}
								<ColorSet 
									colorObj={ansiColors} 
									colorCategory={'ansi'} 
									{color} 
									{Picker} 
								/>
							{/key}
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
				<div>Check any box to individually set an advanced color. Otherwise they will be set according
					to their associated parent color
				</div>
				<span in:slide={{ duration: 500 }}>
					<div class="color-input-row">
						{#each advancedColorsArr as color}
							{#key advancedColorsArr}
								<ColorSet 
									colorObj={advancedColors} 
									colorCategory={'advanced'}
									on:changeChecked={(e)=>checkAdvancedColors(e)}
									bind:advancedColorsStatus
									{color} 
									{Picker}
									whiteOrBlack={advancedColorsStatus[color].whiteOrBlack} 
								/>
							{/key}
						{/each}
					</div>
				</span>
			{/if}
		</div>
	</div>
	<div>
		<Search/>
	</div>
	<div class="generate-btn-row">
		<div class="generate-btn-container">
			<button 
				class="{showSuccess ? "generate-btn-success" : "generate-btn" }"
				on:click={generateTheme}
			>
				{showSuccess ? 'Theme Generated' : 'Generate Theme'}
			</button>
		</div>

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
	<div class="example-btn-row">
		<h3>Try an example theme</h3>
		<div class="example-theme-container">
			<div>
				<button on:click={()=>applyExampleTheme('joker')}>Joker</button>
			</div>
			<div>
				<button on:click={()=>applyExampleTheme('batman')}>Batman</button>
			</div>
		</div>
	</div>
	{#if showVsCode}
		<CodeFrame />
	{/if}

<style>

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
	.example-btn-row h3{
		margin-top: .5rem;
	}
	.example-theme-container {
		display: flex;
	}
	.example-theme-container div {
		margin: 0 1rem 0 0;
	}

</style>
