<script>
    let defaultAvatar = '/default-avatar.png';

    export let name;
    export let discriminator;
    export let avatar;
</script>

<div class="user-profile">
    <div class="avatar">
        <img src="{ avatar }" alt="Avatar" />
    </div>
    <h1>
        { name }<small class="text-muted">#{ discriminator }</small>
    </h1>
</div>

<style>
    .user-profile {
        display: grid;
        justify-content: center;
    }
    .avatar {
        text-align: center;
    }
    .avatar img {
        margin-top: 20px;
        border-radius: 50%;
        height: 128px;
        width: 128px;
    }
    @media screen and (max-width: 600px){
        .avatar img {
            height: 120px;
        }
    }
</style>
