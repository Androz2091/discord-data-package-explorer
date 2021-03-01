<script>
    import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';
    import clarinet from 'clarinet';

    import { loaded, loadTask, data } from '../app/store';
    import { extractData } from '../app/extractor';

    let loading = false;
    let error = false;

    async function handleFile (file) {
        loading = true;
        const uz = new Unzip();
        uz.register(AsyncUnzipInflate);

        console.time('read account');

        uz.onfile = (f) => {
            if (f.name === 'activity/analytics/events-2021-00000-of-00001.json') {
                console.time('read analytics');
                console.time('read file');
                const decoder = new DecodeUTF8();
                let permRequested = 0;
                f.ondata = (err, data, final) => decoder.push(data, final);
                decoder.ondata = (str, final) => {
                    if (str.includes('add_reaction')) permRequested++;
                    if (final) {
                        console.timeEnd('read file');
                        console.log(permRequested)
                    }
                }
                f.start();
            }
        }

        /*
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
        }*/
        const reader = file.stream().getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                uz.push(new Uint8Array(0), true);
                break;
            }
            for (let i = 0; i < value.length; i += (65536*2)) {
                uz.push(value.subarray(i, i + (65536*2)));
            }
        }

        /*jszip.loadAsync(file).then((zip) => {
            const validPackage = !!zip.files['README.txt'];
            if (!validPackage) {
                error = true;
                loading = false;
                return;
            }
            const extractStartAt = Date.now();
            extractData(zip).then((extractedData) => {
                loading = false;
                data.set(extractedData)
                loaded.set(true);
                loadTask.set(null);
                console.log(`[debug] Data extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);
            });
        })*/
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
