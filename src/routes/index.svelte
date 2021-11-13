<script>
	import { onMount } from 'svelte';
	import template1 from '../../static/template1.json';

	let showVsCode = false;
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
			}
		});

		template1.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (ansiColors[tokenKey]) {
				token.settings.foreground = ansiColors[tokenKey];
			}
		});

		template1.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (brightColors[tokenKey]) {
				token.settings.foreground = brightColors[tokenKey];
			}
		});

		template1.tokenColors.forEach((token) => {
			const tokenKey = token.settings.foreground;
			if (otherColors[tokenKey]) {
				token.settings.foreground = otherColors[tokenKey];
			}
		});

		newTemplate['workbench.colorCustomizations'] = template1.colors;
		newTemplate['editor.tokenColorCustomizations']['textMateRules'] = template1.tokenColors;
		console.log(newTemplate);
		newTemplate = JSON.stringify(newTemplate);
		console.log('after', newTemplate);
	};

	onMount(() => {
		/**anonymous async function to allow normal onMount lifecycle*/
		(async () => {
			const Picker = (await import('vanilla-picker')).default;
			/**
			 * instantiates Picker library on input
			 * @function instantiatePicker
			 * @param divId Id of the div on which to instantiate Picker
			 * @param inputVal value that will be bound to color picker
			 */
			const instantiatePicker = (divId, inputVal) => {
				new Picker({
					parent: document.querySelector(divId),
					color: inputVal,
					onChange: function (colorVal) {
						inputVal = colorVal.hex;
					}
				});
			};

			baseColorsArr.forEach((color, i) => {
				instantiatePicker(`#base-color-${i}`, baseColors[baseColorsArr[i]]);
			});

			ansiColorsArr.forEach((color, i) => {
				instantiatePicker(`#ansi-color-${i}`, ansiColors[ansiColorsArr[i]]);
			});
			brightColorsArr.forEach((color, i) => {
				instantiatePicker(`#bright-color-${i}`, brightColors[brightColorsArr[i]]);
			});
			otherColorsArr.forEach((color, i) => {
				instantiatePicker(`#other-color-${i}`, otherColors[otherColorsArr[i]]);
			});
		})();
	});
</script>

<h1>Welcome to Visual Studio Code Theme Generator</h1>
<p>
	select colors using the following inputs and click generate to download your custom theme json
</p>
<div>
	<span>
		<h3>Base Colors</h3>
		{#each baseColorsArr as color, i}
			<div id="base-color-{i}">
				<label>
					color {i + 1}
					<input
						type="text"
						bind:value={baseColors[color]}
						style="background-color: {baseColors[color]}"
					/>
				</label>
			</div>
		{/each}
	</span>
	<span>
		<h3>ANSI Colors</h3>
		{#each ansiColorsArr as color, i}
			<div id="ansi-color-{i}">
				<label>
					color {i + 1}
					<input
						type="text"
						bind:value={ansiColors[color]}
						style="background-color: {ansiColors[color]}"
					/>
				</label>
			</div>
		{/each}
	</span>
	<span>
		<h3>Bright Other Colors</h3>
		{#each brightColorsArr as color, i}
			<div id="bright-color-{i}">
				<label>
					color {i + 1}
					<input
						type="text"
						bind:value={brightColors[color]}
						style="background-color: {brightColors[color]}"
					/>
				</label>
			</div>
		{/each}
	</span>
	<span>
		<h3>Other Colors</h3>
		{#each otherColorsArr as color, i}
			<div id="other-color-{i}">
				<label>
					color {i + 1}
					<input
						type="text"
						bind:value={otherColors[color]}
						style="background-color: {otherColors[color]}"
					/>
				</label>
			</div>
		{/each}
	</span>
</div>
<div class="generate-btn-container">
	<button on:click={generateTheme}>Generate Theme</button>
</div>
<div>
	<button on:click={() => (showVsCode = !showVsCode)}>Show Vs Code</button>
</div>
{#if showVsCode}
	<div class="vscode-container">
		<iframe
			id="inlineFrameExample"
			title="Inline Frame Example"
			width="1000"
			height="500"
			src="https://www.vscode.dev"
		/>
	</div>
{/if}

<style>
	span {
		display: inline-block;
	}

	.generate-btn-container {
		margin-top: 10rem;
	}

	.vscode-container {
		display: flex;
		justify-content: center;
		margin-bottom: 20rem;
	}
</style>
