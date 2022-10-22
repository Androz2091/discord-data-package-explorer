<script>
    import { getGitHubContributors } from "../app/helpers";


    let contributors = [];
    getGitHubContributors().then((contribs) => {
        contributors = contribs;
    });
</script>

<div class="about">
    <div>
        <h1>About</h1>
        Discord Data Package Explorer (shorten as DDPE) has been created on 19th February 2021 by <a href="https://twitter.com/androz2091" target="_blank">Androz2091</a>, as a side-project. Its goal is to generate interesting statistics from your Discord data package. The first version was based on <a href="https://git.kaki87.net" target="_blank">Kaki</a>'s one, who also had the idea of creating a website to read the Discord data packages.
        <h1>Privacy Policy</h1>
        When creating this app, our main goal was to make the app as independent as possible. The app makes requests to two private domains :
        <ul>
            <li><a href="https://analytics.androz2091.fr" target="_blank">https://analytics.androz2091.fr</a> - this is a hosted version of <a href="https://umami.is" target="_blank">Umami</a>, an open source tool to have an overview of views and visitors on the website. Analytics are anonymous, not any data of your package is sent there, of course.</li>
            <br>
            <li><a href="https://diswho.androz2091.fr" target="_blank">https://diswho.androz2091.fr</a> - this is an API that resolves Discord user data (name, avatar, etc.) from a Discord user ID. This is required to show you nicely displayed data instead of ugly user IDs. Of course, this API is <a href="https://github.com/Androz2091/deno-diswho">open source</a> and can be self-hosted. Data is again anonymous and the API only receives IDs one by one without being able to link it to your own ID.</li>
        </ul>
        The website is deployed on <a href="https://netlify.com" target="_blank">Netlify</a> from this <a href="https://github.com/Androz2091/discord-data-package-explorer">GitHub repository</a>.
        <h1>Credits</h1>
        This app would not exist without the help of the following persons!
        <div class="contrib-table">
            {#each contributors as contrib}
                <div class="contrib-item">
                    <a href="{contrib.url}"><img src="{contrib.avatar}" width="100px" style="border-radius: 50%" alt="github avatar" /><br /><sub><b>{contrib.username}</b></sub></a>
                </div>
            {/each}
        </div>
        Thanks to <a href="https://twitter.com/steveschoger" target="_blank">Steve Schoger</a> for his <a href="https://heroicons.dev/" target="_blank">Hero</a> icons!
    </div>
</div>

<style lang="scss">
    .about {
        margin-right: 0.5rem;
        margin-left: 0.5rem;
        padding-top: 7rem;
		max-width: 768px;
	}
    .contrib-table {
        margin: 2rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 0.5rem;
        row-gap: 1rem;
    }
    .contrib-item {
        text-align: center;
    }
    @media (min-width: 1080px) {
        .contrib-table {
            grid-template-columns: repeat(6, 1fr);
        }
        .about {
            margin: auto;
        }
    }
</style>
