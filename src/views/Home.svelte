<script>
import { fly } from 'svelte/transition';
import { data } from "../app/store";
import { generateAvatarURL } from '../app/helpers';
import Chart from 'svelte-frappe-charts';
import Modal from '../components/Modal.svelte';
import { getContext, onMount } from 'svelte';
import SvelteTooltip from 'svelte-tooltip'
import { toast } from '@zerodevx/svelte-toast';

onMount(() => {
    toast.push('Your data has been loaded!', {
        theme: {
            '--toastBackground': '#48BB78',
            '--toastProgressBackground': '#2F855A'
        }
    });
});

const { open } = getContext('simple-modal');

const showModal = (message) => {
    open(Modal, { message });
};

const hoursLabels = new Array(24).fill(0).map((v, i) => i == 0 ? '12am' : i < 12 ? `${i}am` : i == 12 ? '12pm' : `${i-12}pm`);
</script>

<div class="statistics" transition:fly="{{ y: 200, duration: 1000 }}">
    <div class="cards">
        <div class="profile card">
            <div class="avatar">
                <img src="{ generateAvatarURL($data.user.avatar_hash, $data.user.id, $data.user.discriminator) }" alt="Avatar" />
            </div>
            <h1>
                { $data.user.username }<small class="text-muted">#{ $data.user.discriminator.toString().padStart(4, "0") }</small>
            </h1>
        </div>
        <div class="messages-stats card">
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                <h3 style="margin-left: 10px;">You talked to <span class="text-discord">{ $data.channels.filter((c) => c.isDM).length.toLocaleString('en-US') }</span> distinct users</h3>
            </div>
            <small>Well, you know a lot of people!</small>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 style="margin-left: 10px;">You sent <span class="text-discord">{ $data.sentMessageCount.toLocaleString('en-US') }</span> messages on Discord</h3>
            </div>
            <small>That's about { $data.averageMessageCountPerDay.toLocaleString('en-US') } messages per day!</small>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <h3 style="margin-left: 10px;">You opened Discord <span class="text-discord">{ $data.openCount.toLocaleString('en-US') }</span> times</h3>
            </div>
            <small>You are opening Discord ~{ $data.averageOpenCountPerDay.toLocaleString('en-US') } times per day!</small>
        </div>
        <div class="other-stats card">
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 style="margin-left: 10px;">You spent <span class="text-discord" on:click="{showModal($data.payments.list)}">${ parseInt($data.payments.total).toLocaleString('en-US') }</span> on Discord</h3>
            </div>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                <h3 style="margin-left: 10px;">You sent <span class="text-discord">{ $data.channels.map((channel) => channel.messages).flat().map((message) => message.length).reduce((p, c) => p + c).toLocaleString('en-US') }</span> characters through Discord</h3>
            </div>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                <h3 style="margin-left: 10px;">Your favorite words are
                    <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[0].count} times" bottom color="#000000"><span class="text-discord">{$data.favoriteWords[0].word}</SvelteTooltip></span> and
                    <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[1].count} times" bottom color="#000000">{$data.favoriteWords[1].word}</SvelteTooltip></span>
                </h3>
            </div>
            <div class="fun-fact">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <h3 style="margin-left: 10px;">You clicked on <span class="text-discord">{ $data.notificationCount.toLocaleString('en-US') }</span> Discord notifications</h3>
            </div>
            <small>If I were you I would set my status to DND right now...</small>
        </div>
        <div class="top-users card">
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
                            <h3>{ channel.messages.length.toLocaleString('en-US') } <small>messages</small></h3>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class="hours card">
            <h1>Your Discord Hours</h1>
            <p>{ hoursLabels[$data.hoursValues.indexOf(Math.max(...$data.hoursValues))] } is definitely your favorite hour to chat with your friends!</p>
            <Chart data={{
                labels: hoursLabels,
                datasets: [
                    {
                        name: 'Messages',
                        values: $data.hoursValues
                    }
                ]
            }} axisOptions="{{
                xAxisMode: 'tick'
            }}" type="bar" />
        </div>
        <div class="analytics-stats card">
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                <h3 style="margin-left: 10px;">You joined <span class="text-discord">{ $data.joinVoiceChannelCount.toLocaleString('en-US') }</span> voice channels</h3>
            </div>
            <div class="fun-fact">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"></path></svg>
                <h3 style="margin-left: 10px;">You accepted <span class="text-discord">{ $data.joinCallCount.toLocaleString('en-US') }</span> calls in DMs</h3>
            </div>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 style="margin-left: 10px;">You added <span class="text-discord">{ $data.addReactionCount.toLocaleString('en-US') }</span> reactions on messages</h3>
            </div>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                <h3 style="margin-left: 10px;">You edited <span class="text-discord">{ $data.messageEditedCount.toLocaleString('en-US') }</span> of your messages</h3>
            </div>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
                <h3 style="margin-left: 10px;">You used <span class="text-discord">{ $data.slashCommandUsedCount.toLocaleString('en-US') }</span> Slash Commands</h3>
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
    .text-muted {
        color: #6c757d;
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
        .card.messages-stats {
            grid-column: 4 / 8;
        }
        .card.other-stats {
            grid-column: 8 / 12;
        }
        .card.analytics-stats {
            grid-column: 6 / 12;
        }
        .card.top-users {
            grid-column: 1 / 6;
            grid-row: 2 / 5;
        }
        .card.hours {
            grid-column: 6 / 12;
        }
        .card.profile {
            grid-column: 1 / 4;
        }
    }
    
</style>
