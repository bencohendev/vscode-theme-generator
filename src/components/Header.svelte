<script>
</script>

<div class="header">
	<h3 class="logo"><a href="https://bencohen.dev">BEN COHEN DEV</a></h3>
	<div class="links">
		<a href="/">theme generator</a>
		<span>|</span>
		<a href="/about">about</a>
	</div>
</div>

<style>
	.header {
		width: 100%;
		height: 10rem;
		background-color: #1a2238;
		display: flex;
		align-items: center;
	}
	.logo a, 
	.logo a:visited {
		color: #9daaf2;
		font-size: 2rem;
		margin-left: 2rem;
	}

	.links {
		display: flex;
		margin-left: auto;
	}

	a {
		margin: 0 1rem;
		text-decoration: none;
	}
	.links a,
	span {
		color: #ff6a3d;
	}
	@media only screen and (max-width: 768px ) {
		h3 a{
			font-size: 1rem;
		}

		.links {
			align-items: center;

		}
		.links a {
			font-size: .5rem;
		}
	}
</style>
