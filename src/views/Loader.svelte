<script>
    import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';

    import { loaded, loadTask, data } from '../app/store';
    import { extractData } from '../app/extractor';

    let loading = false;
    let error = false;

    async function handleFile (file) {
        loading = true;

        const readFile = (fileToRead) => {
            const fileContent = [];
            const decoder = new DecodeUTF8();
            fileToRead.ondata = (err, data, final) => {
                decoder.push(data, final);
            };
            decoder.ondata = (str, final) => {
                fileContent.push(str);
                if (final) console.log(fileContent.join(''));
            };
            fileToRead.start()
        }

        const uz = new Unzip();
        uz.register(AsyncUnzipInflate);

        const files = [];
        uz.onfile = (f) => {
            files.push(f);
            if (f.name === 'account/user.json') readFile(f)
        }

        const reader = file.stream().getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                uz.push(new Uint8Array(0), true);
                break;
            }
            for (let i = 0; i < value.length; i += 65536) {
                uz.push(value.subarray(i, i + 65536));
            }
        }

        const userFile = files.find((file) => file.name === 'account/user.json');
        //readFile(userFile); // throws the following error:
/*
browser.js:2281 Uncaught (in promise) TypeError: Cannot read property '0' of null
    at Object.start (browser.js:2281)
    at readFile (Loader.svelte:23)
    at handleFile (Loader.svelte:47)
*/

        return;

        const validPackage = files.some((file) => file.name === 'README.txt');
        if (!validPackage) {
            error = true;
            loading = false;
            return;
        }
        const extractStartAt = Date.now();
        extractData(files).then((extractedData) => {
            loading = false;
            data.set(extractedData)
            loaded.set(true);
            loadTask.set(null);
            console.log(`[debug] Data extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);
        });
    }

    function handleDragOver (event) {
        event.preventDefault();
    }

    function handleDrop (event) {
        event.preventDefault();
        handleFile(event.dataTransfer.items[0].getAsFile());
    }

    function filePopup () {
        if (loading) return;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.zip');
        input.addEventListener('change', (e) => handleFile(e.target.files[0]));
        input.addEventListener('error', (e) => error = true);
        input.click();
    }

</script>

<div class="loader" on:click="{filePopup}" style="cursor: { loading ? '' : 'pointer' }" on:drop="{handleDrop}" on:dragover="{handleDragOver}">
    {#if loading}
        {$loadTask || "Loading your package file..."}
    {:else if error}
        <p class="loader-error">Something went wrong... Click or drop your package file here to retry</p>
    {:else}
        <p>Click or drop your package file here</p>
    {/if}
</div>

<style>
    .loader {
        color: white;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .loader-error {
        color: red;
    }
</style>
