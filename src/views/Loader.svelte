<script>
    import * as zip from '@zip.js/zip.js';
    import { extractData } from '../app/package';

    let loading = false;
    let error = false;

    function handleFile (file) {
        let loadingStartAt = Date.now();
        loading = true;
        const reader = new zip.ZipReader(new zip.BlobReader(file));
        reader.getEntries().then((entries) => {
            loading = false;
            const validPackage = entries.some((entry) => entry.filename === 'README.txt');
            if (!validPackage) return error = true;
            extractData(entries).then((statistics) => {
                alert('Statistics loaded!');
            });
        })
    }

    function filePopup () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.zip');
        input.addEventListener('change', (e) => handleFile(e.target.files[0]));
        input.addEventListener('error', (e) => error = true);
        input.click();
    }

</script>

<div class="loader" on:click="{filePopup}">
    {#if loading}
        <p>Loading your package file...</p>
    {:else if error}
        <p class="loader-error">Something went wrong... Click or drop your package file here to retry</p>
    {:else}
        <p>Click or drop your package file here</p>
    {/if}
</div>
