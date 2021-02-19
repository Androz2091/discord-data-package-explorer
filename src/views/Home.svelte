<script>
import { data } from "../app/store";


</script>

<div class="statistics">
    <div class="profile-card">
        <div class="profile">
            <div>
                <img class="avatar" src="https://cdn.discordapp.com/{ $data.user.avatar_hash ? 'avatars/'+ $data.user.id + '/' + $data.user.avatar_hash + '.webp' : 'embed/avatars/' + $data.user.discriminator % 5 + '.png' }" alt="Avatar" />
                <h1>
                    { $data.user.username }<small class="text-muted">#{ $data.user.discriminator }</small>
                </h1>
            </div>
            <div>
                <h3>
                    ID
                    <span class="highlight">{ $data.user.id }</span>
                </h3>
                <h3>
                    Email
                    <span class="highlight">{ $data.user.email }</span>
                </h3>
                <h3>
                    Phone
                    <span class="highlight">{ $data.user.phone }</span>
                </h3>
                <h3>
                    IP Address
                    <span class="highlight">{ $data.user.ip }</span>
                </h3>
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
    .highlight {
        color: #7289DA;
        display: block;
        margin-top: 4px;
    }
    .statistics {
        color: white;
        padding: 20px;
    }
    .profile-card {
        margin-left: auto;
        margin-right: auto;
        background-color: #202225;
        width: 70%;
        border-radius: 5px;
    }

    .profile {
        padding: 10px;
        text-align: center;

        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-gap: 1rem;
    }
    .avatar {
        margin-top: 20px;
        border-radius: 50%;
    }

    @media screen and (max-width: 600px){
        .profile-card {
            width: 90%;
        }
        .avatar {
            height: 120px;
        }
    }

    @media (min-width: 600px) {
        .profile {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
</style>
