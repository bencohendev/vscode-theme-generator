<script>
	import template1 from '../../static/template1.json';
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
		baseColorA: 1,
		baseColorB: 2,
		baseColorC: 3,
		baseColorD: 4,
		baseColorE: 5,
		baseColorF: 6,
		baseColorG: 7,
		baseColorH: 8,
		baseColorI: 9,
		baseColorJ: 10,
		baseColorK: 11
	};
	let baseColorsArrObj = [
		{
			baseColor0: '1'
		},
		{
			baseColor1: '2'
		},
		{
			baseColor2: '3'
		},
		{
			baseColor3: '4'
		},
		{
			baseColor4: '5'
		},
		{
			baseColor5: '6'
		},
		{
			baseColor6: '7'
		},
		{
			baseColor7: '8'
		},
		{
			baseColor8: '9'
		},
		{
			baseColor9: '10'
		},
		{
			baseColor10: '11'
		}
	];
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
		ansiColorA: 1,
		ansiColorB: 2,
		ansiColorC: 3,
		ansiColorD: 4,
		ansiColorE: 5,
		ansiColorF: 6,
		ansiColorG: 7,
		ansiColorH: 8,
		ansiColorI: 9,
		ansiColorJ: 10,
		ansiColorK: 11,
		ansiColorL: 12,
		ansiColorM: 13,
		ansiColorN: 14,
		ansiColorO: 15,
		ansiColorP: 16
	};
	let brightColorsArr = ['brightColorA', 'brightColorB'];
	let brightColors = {
		brightColorA: 1,
		brightColorB: 2
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
		otherColorA: 1,
		otherColorB: 2,
		otherColorC: 3,
		otherColorD: 4,
		otherColorE: 5,
		otherColorF: 6,
		otherColorG: 7,
		otherColorH: 8,
		otherColorI: 9
	};

	const generateTheme = () => {
		// let testString = 'thisisateststringforben';
		// let newString = testString.replace('stringfor', 'excercisefor');
		// console.log(newString);
		/*change colors functions*/
		//base colors
		Object.entries(template1.colors).forEach(([key, val], i) => {
			const replaceIfTrue = baseColorsArr.find((color) => {
				return val.includes(color);
			});
			if (replaceIfTrue) {
				const newColor = template1.colors[key].replace(
					replaceIfTrue,
					`${baseColors[replaceIfTrue]}`
				);
				template1.colors[key] = newColor;
			}
		});
		//ansi colors
		Object.entries(template1.colors).forEach(([key, val], i) => {
			const replaceIfTrue = ansiColorsArr.find((color) => {
				return val.includes(color);
			});
			if (replaceIfTrue) {
				const newColor = template1.colors[key].replace(
					replaceIfTrue,
					`${ansiColors[replaceIfTrue]}`
				);
				template1.colors[key] = newColor;
			}
		});
		//bright other colors
		Object.entries(template1.colors).forEach(([key, val], i) => {
			const replaceIfTrue = brightColorsArr.find((color) => {
				return val.includes(color);
			});
			if (replaceIfTrue) {
				const newColor = template1.colors[key].replace(
					replaceIfTrue,
					`${brightColors[replaceIfTrue]}`
				);
				template1.colors[key] = newColor;
			}
		});
		//other colors
		Object.entries(template1.colors).forEach(([key, val], i) => {
			const replaceIfTrue = otherColorsArr.find((color) => {
				return val.includes(color);
			});
			if (replaceIfTrue) {
				const newColor = template1.colors[key].replace(
					replaceIfTrue,
					`${otherColors[replaceIfTrue]}`
				);
				template1.colors[key] = newColor;
			}
		});
		/*end change colors*/

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
		Object.entries(template1.colors).forEach(([key, val], i) => {
			console.log(key, val);
		});
	};
</script>

<h1>Welcome to Visual Studio Code Theme Generator</h1>
<p>input colors into the following inputs and click generate to download your custom theme json</p>
<div>
	<span>
		<h3>Base Colors</h3>
		{#each baseColorsArr as color, i}
			<div>
				<label>
					color {i + 1}
					<input type="text" bind:value={baseColors[color]} />
				</label>
			</div>
		{/each}
	</span>
	<span>
		<h3>ANSI Colors</h3>
		{#each ansiColorsArr as color, i}
			<div>
				<label>
					color {i + 1}
					<input type="text" bind:value={ansiColors[color]} />
				</label>
			</div>
		{/each}
	</span>
	<span>
		<h3>Bright Other Colors</h3>
		{#each brightColorsArr as color, i}
			<div>
				<label>
					color {i + 1}
					<input type="text" bind:value={brightColors[color]} />
				</label>
			</div>
		{/each}
	</span>
	<span>
		<h3>Other Colors</h3>
		{#each otherColorsArr as color, i}
			<div>
				<label>
					color {i + 1}
					<input type="text" bind:value={otherColors[color]} />
				</label>
			</div>
		{/each}
	</span>
</div>

<div class="generate-btn-container">
	<button on:click={generateTheme}>Generate Theme</button>
</div>

<style>
	span {
		display: inline-block;
	}

	.generate-btn-container {
		margin-top: 10rem;
	}
</style>
