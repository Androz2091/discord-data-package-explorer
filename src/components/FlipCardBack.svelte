<div class="flip-card-back">
	<slot />
</div>

<style>
	.flip-card-back {
    padding: unset;
    background-color: #202225;
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		transform: rotateY(180deg);
	}
</style>
