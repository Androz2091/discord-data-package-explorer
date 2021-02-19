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
            <h1><span>DMs:</span> 4,000</h1>
            <small>Coucou</small>
            <h1><span>Friends:</span> 4,000</h1>
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
    <!--<div class="column right">
        <div class="cards">
            <div class="card">
                <h2>
                    <span>50</span> friends
                </h2>
                <small>Woaw, you have a lot of friends on Discord!</small>
            </div>
            <div class="card">
                <h2>
                    <span>200</span> DMs
                </h2>
                <small>You discussed with 200 users on Discord!</small>
            </div>
            <div class="card">
                <h2>
                    <span>13,000</span> messages
                </h2>
                <small>You sent 13,000 messages on Discord! Congrats, this is a high ratio!</small>
            </div>
        </div>
        <div class="top">
            Hey
        </div>
    </div> -->
</div>

<style>
    .statistics {
        color: white;
        padding: 20px;
    }
    span {
        color: #7289DA;
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
