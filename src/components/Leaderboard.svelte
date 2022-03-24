<script>
	export let title;
	export let description;
</script>

<div>
	<h1 class="{title}">{title}</h1>
	<p class="{title}">{description}</p>
	<div>
		<slot />
	</div>
</div>

<style>
	h1.Voctime, p.Voctime {
		text-align: center;
	}
</style>
