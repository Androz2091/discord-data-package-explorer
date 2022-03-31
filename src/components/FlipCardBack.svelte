<div class="flip-card-back">
	<slot />
</div>

<style>
	.flip-card-back {
		background-color: #202225;
		position: absolute;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		transform: rotateY(180deg);
	}
</style>
