<script>
import { fly } from 'svelte/transition';
import { data } from "../app/store";
import { generateAvatarURL } from '../app/helpers';
import Chart from 'svelte-frappe-charts';
import Modal from '../components/Modal.svelte';
import { getContext } from 'svelte';
import SvelteTooltip from 'svelte-tooltip';
import { listen } from 'svelte/internal';

const { open } = getContext('simple-modal');

const showModal = (message) => {
    open(Modal, { message });
};

const hoursLabels = new Array(24).fill(0).map((v, i) => i == 0 ? '12am' : i < 12 ? `${i}am` : i == 12 ? '12pm' : `${i-12}pm`);
</script>

<div class="statistics" transition:fly="{{ y: 200, duration: 1000 }}">
    <div class="cards">
        <div class="welcome card">
            <h2>Hey, here is your extracted data! You can load another package by refreshing the page.</h2>
        </div>
        <div class="profile card">
            <div class="avatar">
                <img src="{ generateAvatarURL($data.user.avatar_hash, $data.user.id, $data.user.discriminator) }" alt="Avatar" />
            </div>
            <h1>
                { $data.user.username }<small class="text-muted">#{ $data.user.discriminator.toString().padStart(4, "0") }</small>
            </h1>
        </div>
        <div class="messages-stats card">
            <h1 style="margin-top: 10px; margin-bottom: 10px;">Messages Fun Facts</h1>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                <h3 style="margin-left: 10px;">You talked to <span class="text-discord">{ $data.channels.filter((c) => c.isDM).length.toLocaleString('en-US') }</span> distinct users</h3>
            </div>
            <small>Well, you know a lot of people!</small>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 style="margin-left: 10px;">You sent <span class="text-discord">{ $data.messageCount.toLocaleString('en-US') }</span> messages on Discord</h3>
            </div>
            <small>That's about { $data.averageMessageCountPerDay.toLocaleString('en-US') } messages per day!</small>
        </div>
        <div class="other-stats card">
            <h1 style="margin-top: 10px; margin-bottom: 10px;">Some other stats</h1>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 style="margin-left: 10px;">You spent <span class="text-discord" on:click="{ $data.payments.list.length ? showModal($data.payments.list) : undefined }">${ parseInt($data.payments.total).toLocaleString('en-US') }</span> on Discord</h3>
            </div>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                <h3 style="margin-left: 10px;">You sent <span class="text-discord">{ $data.channels.map((channel) => channel.messages).flat().map((message) => message.length).reduce((p, c) => p + c).toLocaleString('en-US') }</span> characters through Discord</h3>
            </div>
            <div class="fun-fact">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                <h3 style="margin-left: 10px;">Your favorite words are <span class="text-discord">
                    {#each $data.favoriteWords as favoriteWord, index}
                        <SvelteTooltip tip="Used {favoriteWord.count} times" bottom color="#000000">{favoriteWord.word}{@html (index+1 < $data.favoriteWords.length) ? ',&nbsp;' : '' }</SvelteTooltip>
                    {/each}
                    </span>
                </h3>
            </div>
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
        .card.welcome {
            grid-column: 1 / 12;
        }
        .card.messages-stats {
            grid-column: 4 / 8;
        }
        .card.other-stats {
            grid-column: 8 / 12;
        }
        .card.top-users {
            grid-column: 1 / 6;
            grid-row: 3 / 5;
        }
        .card.hours {
            grid-column: 6 / 12;
        }
        .card.profile {
            grid-column: 1 / 4;
        }
    }
    
</style>
