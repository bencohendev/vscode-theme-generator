<script>
  import Header from "../components/Header.svelte"
</script>

<Header/>
<main>

  <slot></slot>
</main>

<style>
  @import '/static/global.css';
	main {
		max-width: 1280px;
		margin: auto;
		padding: 0 8rem;
    margin-bottom: 3rem;
	}
  @media only screen and (max-width: 768px ) {
		main {
			padding: 1rem;
		}
	}
</style>