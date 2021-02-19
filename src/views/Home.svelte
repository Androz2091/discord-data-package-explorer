<script>
import { data } from "../app/store";
import { generateAvatarURL } from '../app/helpers';
</script>

<div class="statistics">
    <div class="cards">
        <div class="profile card">
            <div class="avatar">
                <img src="{ generateAvatarURL($data.user.avatar_hash, $data.user.id, $data.user.discriminator) }" alt="Avatar" />
            </div>
            <h1>
                { $data.user.username }<small class="text-muted">#{ $data.user.discriminator }</small>
            </h1>
        </div>
        <div class="stats card">
            <h1 style="margin-top: 10px; margin-bottom: 10px;">Messages Fun Facts</h1>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                <h3 style="margin-left: 10px;">You talked to <span class="text-discord">{ $data.channels.filter((c) => c.isDM).length }</span> distinct users</h3>
            </div>
            <small>Well, you know a lot of people!</small>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 style="margin-left: 10px;">You sent <span class="text-discord">{ $data.messageCount }</span> messages on Discord</h3>
            </div>
            <small>That's about { $data.averageMessageCountPerDay } messages per day!</small>
        </div>
        <div class="top card">
            <h1>Top Users</h1>
            <p>The users you chat the most with!</p>
            <div>
                {#each $data.topDMs as channel, i}
                    <div class="top-item">
                        <div class="top-whois">
                            <div class="top-bubble { i === 0 ? 'first' : i === 1 ? 'second' : i === 2 ? 'third' : '' }">{ i + 1 }</div>
                            <img class="top-avatar" src="{ generateAvatarURL(channel.userData.avatar, channel.userData.id, channel.userData.discriminator) }" alt="Avatar" />
                            <h3 class="top-name">{ channel.userData.username } <small class="text-muted">#{ channel.userData.discriminator }</small></h3>
                        </div>
                        <div class="top-messages">
                            <h3>{ channel.messages.length } <small>messages</small></h3>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .statistics {
        color: white;
        padding: 20px;
    }
    .fun-fact {
        display: flex;
        align-items: center;
    }
    .text-discord {
        color: #7289DA;
    }
    svg {
        height: 40px;
    }
    .cards {
        display: grid;
        grid-gap: 10px;
    }
    .card {
        background-color: #202225;
        border-radius: 10px;
        padding: 20px;
    }
    .card.profile {
        display: grid;
        justify-content: center;
    }
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
    }
    .top-item:last-child {
        border-bottom: 0;
    }
    .top-avatar {
        border-radius: 50%;
        height: 50px;
        margin-right: 10px;
    }
    .top-name {
        margin-left: inherit;
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
    .avatar {
        text-align: center;
    }
    .avatar img {
        margin-top: 20px;
        border-radius: 50%;
        height: 128px;
    }
    @media screen and (max-width: 600px){
        .avatar img {
            height: 120px;
        }
    }
    @media (min-width: 600px) {
        .cards {
            grid-template-columns: repeat(12, 1fr);
        }
        .card.stats {
            grid-column: 4 / 8;
        }
        .card.top {
            grid-row: 2;
            grid-column: 1 / 6;
        }
        .card.profile {
            grid-column: 1 / 4;
        }
    }
    
</style>
