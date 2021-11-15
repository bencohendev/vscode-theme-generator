<script>
	import Header from '../components/Header.svelte';
</script>

<Header />
<div class="about">
	<div>
		<h3>About</h3>
		<p>
			This project is an attempt to make theming Vs Code easier and more approachable. One should be
			able to get a general idea of the uses of each color from the description and for more in
			depth information, a list of all tags and scopes to which each color is applied are supplied.
		</p>
	</div>
	<div>
		<h3>Resources</h3>
		<ul>
			<li><a href="https://code.visualstudio.com/docs/getstarted/themes">Basic Theming Info</a></li>
		</ul>
	</div>
</div>

<style>
	.about {
		max-width: 1280px;
		margin: auto;
	}
	a {
		text-decoration: none;
	}
	ul {
		list-style: none;
	}
</style>
