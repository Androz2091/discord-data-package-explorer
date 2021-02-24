<script>
    import jszip from 'jszip';
    import { loaded, loadTask, data } from '../app/store';
    import { extractData } from '../app/extractor';

    let loading = false;
    let error = false;

    function handleFile (file) {
        loading = true;
        jszip.loadAsync(file).then((zip) => {
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
        })
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
