<script>
    import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';

    import { loaded, loadTask, loadEstimatedTime, data } from '../app/store';
    import { extractData } from '../app/extractor';

    let loading = false;
    let error = false;

    async function handleFile (file) {
        loading = true;

        const uz = new Unzip();
        uz.register(AsyncUnzipInflate);

        const files = [];
        uz.onfile = (f) => files.push(f);

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
        }).catch((err) => {
            error = true;
            loading = false;
            alert(err.stack);
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
        <div>
            {$loadTask || "Loading your package file..."}
            {#if $loadEstimatedTime}
                <small style="display: block; margin-top: 4px;">{$loadEstimatedTime}</small>
            {/if}
        </div>
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
