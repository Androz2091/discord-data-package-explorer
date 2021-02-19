<script>
import { data } from "../app/store";


</script>

<div class="statistics">
    <div class="cards">
        <div class="card">
            <div class="avatar">
                <img src="https://cdn.discordapp.com/{ $data.user.avatar_hash ? 'avatars/'+ $data.user.id + '/' + $data.user.avatar_hash + '.webp' : 'embed/avatars/' + $data.user.discriminator % 5 + '.png' }" alt="Avatar" />
            </div>
            <h1>
                { $data.user.username }<small class="text-muted">#{ $data.user.discriminator }</small>
            </h1>
        </div>
        <div class="card">
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
    .cards {
        display: grid;
        grid-gap: 10px;
    }
    .card {
        background-color: #202225;
        border-radius: 10px;
        display: grid;
        justify-content: center;
    }
    .avatar {
        text-align: center;
    }
    
    .avatar img {
        margin-top: 20px;
        border-radius: 50%;
    }

    @media screen and (max-width: 600px){
        .avatar img {
            height: 120px;
        }
    }

    @media (min-width: 600px) {
        .cards {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    
</style>
