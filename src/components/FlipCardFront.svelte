<div class="flip-card-front">
	<slot />
</div>

<style>
	.flip-card-front {
		padding: unset;
		background-color: #202225;
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
	}

	.flip-card-front > * {
		padding: unset;
	}
</style>
