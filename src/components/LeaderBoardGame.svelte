<script>
  export let name;
  export let position;
  export let avatarURL = null;
  export let count;
</script>

<div class="top-item">
  <div class="top-whois">
    <div class="top-bubble {position === 0 ? 'first' : position === 1 ? 'second' : position === 2 ? 'third' : ''}">
      {position + 1}
    </div>
    {#if avatarURL != null}
      <img class="top-avatar" src={avatarURL} alt="" />
    {:else}
      <svg class="top-avatar" aria-hidden="false" width="50" height="50" viewBox="0 0 40 40"
        ><g fill="none" fill-rule="evenodd"
          ><path
            fill="currentColor"
            fill-opacity=".8"
            d="M21.226 30v-4.154h-3.755V30h3.755zm-.512-8.62c3.67-1.337 5.718-2.959 5.718-6.145 0-3.272-2.36-5.235-6.088-5.235-2.589 0-4.637.825-6.344 2.048l.484 3.3c1.621-1.251 3.47-2.162 5.49-2.162 1.707 0 2.845.854 2.845 2.305 0 1.593-1.08 2.475-3.812 3.442l-.882.342.342 4.523 2.076-.455.171-1.963z"
          /><rect
            width="38"
            height="38"
            x="1"
            y="1"
            stroke="currentColor"
            stroke-opacity=".4"
            stroke-width="2"
            rx="5"
          /><circle cx="7" cy="7" r="2" fill="currentColor" fill-opacity=".4" /><circle
            cx="7"
            cy="33"
            r="2"
            fill="currentColor"
            fill-opacity=".4"
          /><circle cx="33" cy="7" r="2" fill="currentColor" fill-opacity=".4" /><circle
            cx="33"
            cy="33"
            r="2"
            fill="currentColor"
            fill-opacity=".4"
          /></g
        ></svg
      >
    {/if}
    <h3 class="top-name">{name}</h3>
  </div>
  <div class="top-messages">
    <h3>{count} <small>hours</small></h3>
  </div>
</div>

<style>
  .top-item {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid white;
    align-items: center;
    justify-content: space-between;
    padding-top: 1%;
    padding-bottom: 1%;
    width: 49%;
  }
  .top-whois {
    padding: 8px;
    align-items: center;
    display: flex;
    min-width: 0;
    width: 70%;
  }
  .top-avatar {
    height: 50px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .top-name {
    margin-left: inherit;
    display: flex;
    flex-direction: column;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .top-messages {
    flex-shrink: 0;
  }
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
