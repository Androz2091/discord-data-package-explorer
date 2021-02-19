# Svelte Starter Template (with TailwindCSS) 

This is a project template for [Svelte](https://svelte.dev) apps. It is forked from https://github.com/sveltejs/template. It adds support for [TailwindCSS](https://tailwindcss.com)

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sa1f/svelte-tailwind-starter svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
yarn # or npm i
```

...then start [Rollup](https://rollupjs.org):

```bash
yarn dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Folder Structure

```
├── README.md
├── package.json
├── postcss.config.js       # Handles all css processing using https://postcss.org
├── public
│   ├── build
│   │   ├── bundle.css      # Bundles main.css and all <style> tags from *.svelte files
│   │   ├── bundle.css.map
│   │   ├── bundle.js       # Bundles main.js 
│   │   └── bundle.js.map
│   ├── favicon.png
│   └── index.html          # What the server sends to the user
├── rollup.config.js        # Handles configs for bundling and serving things (like webpack)
├── src
│   ├── App.svelte          # Start editing here 👈
│   ├── main.css            
│   └── main.js             
├── tailwind.config.js      # https://tailwindcss.com/docs/configuration/
└── yarn.lock
```


## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```


## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
cd public
now deploy --name my-project
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
