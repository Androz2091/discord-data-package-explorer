<div class="flip-card-front">
	<slot />
</div>

<style>
	.flip-card-front {
		background-color: #202225;
		position: absolute;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
	}
</style>
