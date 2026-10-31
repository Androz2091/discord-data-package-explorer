<script>
    import Frame from '../Frame.svelte';
    import Facets from '../Facets.svelte';
    import Eyebrow from '../Eyebrow.svelte';
    import Avatar from '../Avatar.svelte';
    import { fit } from '../fit';
    import { plural } from '../data';

    export let data;

    const { user, years } = data;
</script>

<Frame background="radial-gradient(120% 70% at 85% 0%, #7dd3fc 0%, #0ea5e9 34%, #0369a1 62%, #020617 100%)">
    <svelte:fragment slot="texture">
        <Facets seed={data.seed ^ 3} max={0.16} />
    </svelte:fragment>
    <Eyebrow text="Discord recap · Lifetime" />
    <div class="profile">
        <Avatar src={user.avatar} name={user.name} background={user.background} size={400} ring="0 0 0 12px rgba(255, 255, 255, 0.92), 0 30px 80px rgba(2, 6, 23, 0.45)" />
        <div class="name" use:fit={{ text: user.name, max: 150, min: 96 }}>{user.name}</div>
        <div class="handle">{user.handle}</div>
    </div>
    <div class="headline">
        {years >= 1 ? `${years} ${plural(years, 'year', 'years')} of Discord,` : 'Your Discord so far,'}
        <span>unpacked.</span>
    </div>
</Frame>

<style>
    .profile {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -40px;
    }

    .name,
    .handle {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .name {
        margin-top: 84px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.04em;
    }

    .handle {
        margin-top: 22px;
        color: #e0f2fe;
        font-size: 50px;
        font-weight: 600;
        opacity: 0.8;
    }

    .headline {
        margin-bottom: 340px;
        font-size: 104px;
        font-weight: 900;
        line-height: 0.95;
        letter-spacing: -0.035em;
    }

    .headline span {
        color: #bae6fd;
    }
</style>
