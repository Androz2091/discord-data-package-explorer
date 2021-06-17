<script>
    import { fly } from 'svelte/transition';
    import { data } from "../app/store";
    import { generateAvatarURL, getGitHubContributors } from '../app/helpers';
    import Chart from 'svelte-frappe-charts';
    import Modal from '../components/Modal.svelte';
    import { getContext, onMount } from 'svelte';
    import SvelteTooltip from 'svelte-tooltip'
    import { toast } from '@zerodevx/svelte-toast';
    
    import ProfileCard from '../components/ProfileCard.svelte';
    import Card from '../components/Card.svelte';
    import FunFact from '../components/FunFact.svelte';
    import Leaderboard from '../components/Leaderboard.svelte';
    import LeaderboardItem from '../components/LeaderboardItem.svelte';
    
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
    const channels = $data.channels.filter(c => !c.isDM);
    </script>
    
    <div class="statistics" transition:fly="{{ y: 200, duration: 1000 }}">
        <div class="cards">
            <Card name="profile">
                <ProfileCard
                    name="{ $data.user.username }"
                    discriminator="????"
                    avatar="{ generateAvatarURL($data.user.avatar_hash, $data.user.id, $data.user.discriminator) }"
                />
            </Card>
            <Card name="first">
                <FunFact
                    svg="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    content="You talked to % distinct users"
                    count="{ $data.channels.filter((c) => c.isDM).length }"
                    explanation="Well, you know a lot of people!"
                />
                <FunFact
                    svg="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    content="You sent % messages on Discord"
                    count="{ $data.sentMessageCount }"
                    explanation="That's about { $data.averageMessageCountPerDay && $data.averageMessageCountPerDay.toLocaleString('en-US') } messages per day!"
                />
                <FunFact
                    svg="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    content="You opened Discord % times"
                    count="{ $data.openCount }"
                    explanation="You are opening Discord ~{ $data.averageOpenCountPerDay && $data.averageOpenCountPerDay.toLocaleString('en-US') } times per day!"
                />
            </Card>
            <Card name="second">
                <FunFact
                    svg="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                >
                    <div  slot="content">
                    <h3>
                        You spent
                        <span class="text-discord" on:click="{ $data.payments.list.length ? showModal(`<h3 style="text-align: center">${$data.payments.list}</h3>`) : undefined }">
                            ${ parseInt($data.payments.total).toLocaleString('en-US') }
                        </span>
                        on Discord
                    </h3>
                    </div>
                </FunFact>
                <FunFact
                    svg="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    content="You sent % characters through Discord"
                    count="{ $data.channels.map((channel) => channel.messages).flat().map((message) => message.length).reduce((p, c) => p + c) }"
                />
                <FunFact svg="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                    <h3 slot="content">Your favorite words are
                        <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[0].count.toLocaleString('en-US')} times" bottom color="#000000"><span class="text-discord">{$data.favoriteWords[0].word}</SvelteTooltip></span>, 
                        <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[1].count.toLocaleString('en-US')} times" bottom color="#000000">{$data.favoriteWords[1].word}</SvelteTooltip></span>, 
                        <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[2].count.toLocaleString('en-US')} times" bottom color="#000000">{$data.favoriteWords[2].word}</SvelteTooltip></span>, 
                        <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[3].count.toLocaleString('en-US')} times" bottom color="#000000">{$data.favoriteWords[3].word}</SvelteTooltip></span> and 
                        <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[4].count.toLocaleString('en-US')} times" bottom color="#000000">{$data.favoriteWords[4].word}</SvelteTooltip></span>
                    </h3>
                </FunFact>
                <FunFact
                    svg="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    content="You clicked on % Discord notifications"
                    count="{ $data.notificationCount }"
                    explanation="If I were you I would set my status to DND right now..."
                />
            </Card>
            <Card name="top-users">
                <Leaderboard title="Top Users" description="The users you chat the most with!">
                    {#each $data.topDMs as channel, i}
                        <LeaderboardItem
                            position={i}
                            avatarURL={generateAvatarURL(channel.userData.avatar, channel.userData.id, channel.userData.discriminator)}
                            username={channel.userData.username}
                            discriminator={channel.userData.discriminator}
                            count={channel.messages.length.toLocaleString('en-US')}
                            word={channel.words}
                        />
                    {/each}
                </Leaderboard>
            </Card>
            <Card name="hours">
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
            </Card>
            <Card name="third">
                <FunFact
                    svg="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    content="You joined % voice channels"
                    count="{ $data.joinVoiceChannelCount }"
                />
                <FunFact
                    svg="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                    content="You accepted % calls in DMs"
                    count="{ $data.joinCallCount }"
                />
                <FunFact
                    svg="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    content="You added % reactions on messages"
                    count="{ $data.addReactionCount }"
                />
                <FunFact
                    svg="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    content="You edited % of your messages"
                    count="{ $data.messageEditedCount }"
                />
                <FunFact
                    svg="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                    content="You used % Slash Commands"
                    count="{ $data.slashCommandUsedCount }"
                />
                <FunFact
                    svg="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"
                    strokeWidth={1}
                    strokeLinecap="square"
                    strokeLinejoin="square"
                    content="You have spoken in % different text channels"
                    count="{ channels.length }"
                    explanation="That's ~{ Math.round(channels.length / $data.guilds.length) } per guild!"
                />
            </Card>
            <Card name="top-users">
                <Leaderboard title="Top Users" description="The users you chat the most with!">
                    {#each $data.topDMs as channel, i}
                        <LeaderboardItem
                            position={i}
                            avatarURL={generateAvatarURL(channel.userData.avatar, channel.userData.id, channel.userData.discriminator)}
                            name={channel.userData.username}
                            discriminator={channel.userData.discriminator}
                            count={channel.messages.length.toLocaleString('en-US')}
                        />
                    {/each}
                </Leaderboard>
            </Card>
            <Card name="top-channels">
                <Leaderboard title="Top Channels" description="The channels you chat the most in!">
                    {#each $data.channels.filter(c => c.data && c.data.guild).sort((a, b) => b.messages.length - a.messages.length).slice(0, 10) as channel, i}
                        <LeaderboardItem
                            position={i}
                            name={channel.name}
                            guild={channel.data.guild.name}
                            count={channel.messages.length}
                            channel
                        />
                    {/each}
                </Leaderboard>
            </Card>
            
            <Card name="about">
                <div style="text-align: center;">
                    <h2>About this project</h2>
                    <p>Discord Data Package Explorer is a free, ad-free and <a href="https://github.com/Androz2091/discord-data-package-explorer" target="_blank" class="text-discord" style="text-decoration: none;">open source</a> website made with Svelte.
                    <p>These are all the developers who contributed to the creation of DDPE!</p>
                    <p>Liens: <a href="https://ddpe.androz2091.fr/" target="_blank" class="text-discord" style="text-decoration: none;">Le site original</a><br><a href="https://github.com/a9ex/discord-data-package-explorer" target="_blank" class="text-discord" style="text-decoration: none;">Le code open source modifié dont les modifications sont en dessous</a></p>
                    <p>Note: ceci est une modifcation rapide par A1ex pour mes fins, incluant les modifications suivantes :<br>- Le Top 100 des utilisateurs en DM (au lieu du top 10), avec un chargement d'une minute 40 au total pour éviter les ratelimit de Discord.<br>- Top 5 des mots les plus utilisées (au lieu du top 2), de plus de >= 5 caractères (sinon les mots ne sont pas intéréssents)<br>- Top 2 des mots les plus utilisées en DM de plus de >= 6 caractères et inf. 23 caractères (car "c'est" est toujours le mot favori ainsi que les emojis dans 95% des DM)<br>- Fix du bug de l'écran gris à la fin de l'écran de chargement ne permettant pas de voir les stats pour certains (pb. dû au fetcheur du discriminant)<br>- Fix de l'affichage des grilles dû au Top 100 qui cassait l'interface<br>- L'ID de la personne est affiché à la place si il y a eu un ratelimit de Discord (au lieu de undefined)<br>- Les mots ne sont normalement plus sensible à la casse (avant ils l'étaient)<br> Allez voir le repo officiel mentionné au dessus pour les soutenir !<br></p>
                </div>
                
                <div class="contributors">
                    {#await getGitHubContributors()}
                        <p>Loading...</p>
                    {:then users}
                        {#each users as user}
                            <SvelteTooltip tip="{user.username}" bottom color="#000000">
                                <a href="{user.url}" target="_blank">
                                    <div class="contributors-item" style="background-image: url('{user.avatar}');"></div>
                                </a>
                            </SvelteTooltip>
                        {/each}
                    {:catch users}
                        <SvelteTooltip tip="Androz2091" bottom color="#000000">
                            <a href="https://github.com/Androz2091">
                                <div class="contributors-item" style="background-image: url('https://avatars.githubusercontent.com/u/42497995?s=460&u=86b6310688c5e05140c6d12902d878cacdcf93db&v=4');"></div>
                            </a>
                        </SvelteTooltip>
                    {/await}
                </div>
            </Card>
        </div>
    </div>
    
    <style>
        h3 {
            margin-left: 10px;
        }

        .statistics {
            color: white;
            padding: 20px;
        }

        .cards {
            display: grid;
            grid-gap: 10px;
        }

        .contributors {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
    
            margin-top: 5px;
    
            border-radius: 10px;
        }

        .contributors-item {
            width: 50px;
            height: 50px;
            
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 5px;
            margin-left: 5px;
    
            border-radius: 100%;
            background-color: #373c42;
            background-size: contain;
            cursor: pointer;
        }

        @media (min-width: 600px) {
            .cards {
                grid-template-columns: repeat(11, 1fr);
            }
        }
    </style>
