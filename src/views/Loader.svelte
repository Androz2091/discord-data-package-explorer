<script>
    import * as zip from '@zip.js/zip.js';
    import { loaded, data, loadedPercent, loadedStartAt } from '../app/store';
    import { extractData } from '../app/package';

    let loading = false;
    let error = false;

    function handleFile (file) {
        loading = true;
        const reader = new zip.ZipReader(new zip.BlobReader(file));
        reader.getEntries().then((entries) => {
            const validPackage = entries.some((entry) => entry.filename === 'README.txt');
            if (!validPackage) return error = true;
            extractData(entries).then((extractedData) => {
                loading = false;
                data.set(extractedData)
                loaded.set(true);
            });
        })
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

<div class="loader" on:click="{filePopup}" style="cursor: { loading ? '' : 'pointer' }">
    {#if loading}
        <div class="loader-loading">
            <p>
                Loading your package file... { $loadedPercent }% loaded
            </p>
            <small>Estimated time: { ($loadedPercent && $loadedStartAt) ? parseInt(((Date.now() - $loadedStartAt) / $loadedPercent) * (100 - $loadedPercent) / 1000) + ' seconds' : '...' }</small>
        </div>
    {:else if error}
        <p class="loader-error">Something went wrong... Click or drop your package file here to retry</p>
    {:else}
        <p>Click or drop your package file here</p>
    {/if}
</div>
