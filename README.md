# [Discord Data Package Explorer](https://ddpe.netlify.app)

![Logo](./public/favicon.png)

What is there **really** in your Discord Data package? And how can this data be useful? Discord Data Package Explorer does the job for you!

## Example

![Example](./example.png)

### Installation

Discord Data Package Explorer is built with **[Svelte](https://svelte.dev)**, and is quite easy to install.

* Clone the repository.
* Install the dependencies using `npm install` or `yarn install`.
* Start the app using `npm run dev` or `yarn dev`!

### ZIP Library

I decided to use zip.js instead of JSZip. Some benchmarks with the same package file:

| **Name** | **Time to read files** |
|----------|----------|
| Zip.js | **47 seconds** |
| JSZip | 123 seconds |
