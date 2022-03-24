<script>
	export let name;
	export let position;
	export let duration;
	export let ifNull = "Unknow Server";
	import humanizeDuration from "humanize-duration";
	const myHumanizer = humanizeDuration.humanizer({
		conjunction: " and ",
		units: ["y", "mo", "w", "d", "h", "m"],
		serialComma: false,
		largest: 3,
		round: true,
	});
</script>

<div class="top-item">
	<div class="top-whois">
		<div class="top-bubble {position === 0 ? 'first' : position === 1 ? 'second' : position === 2 ? 'third' : ''}">
			{position + 1}
		</div>

		<h3 class="top-name">
			{name ?? ifNull} <small class="text-muted channel">{myHumanizer(duration)}</small>
		</h3>
	</div>
	<!-- <div class="top-messages">
    <h6>{myHumanizer(duration)}</h6>
  </div> -->
</div>

<style>
	.text-muted {
		color: #6c757d;
	}
	.text-muted.channel {
		white-space: nowrap;
	}
	.top-item {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid white;
		align-items: center;
		justify-content: space-between;
		width: 49%;
	}
	.top-whois {
		padding: 8px;
		align-items: center;
		display: flex;
		min-width: 0;
		width: 98%;
	}

	.top-name {
		margin-left: inherit;
		display: flex;
		flex-direction: column;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	/* .top-messages {
    flex-shrink: 0;
  } */
	.top-bubble {
		align-items: center;
		justify-content: center;
		display: flex;
		flex: 0 0 35px;
		height: 35px;
		background-color: #50555a;
		border-radius: 50%;
		margin-right: 10px;
	}
	.top-bubble.first {
		background-color: #da9e3b;
	}
	.top-bubble.second {
		background-color: #989898;
	}
	.top-bubble.third {
		background-color: #ae7441;
	}
</style>
