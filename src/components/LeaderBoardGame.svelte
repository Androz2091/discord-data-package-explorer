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
    <img class="top-avatar" src={avatarURL} alt="Avatar" />
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
  }
  .top-whois {
    padding: 8px;
    align-items: center;
    display: flex;
    min-width: 0;
    width: 100%;
  }
  .top-name {
    margin-left: inherit;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .top-item:last-child {
    border-bottom: 0;
  }
  .top-avatar {
    height: 50px;
    margin-right: 10px;
    flex-shrink: 0;
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
