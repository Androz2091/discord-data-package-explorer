<script>
    import JSZip from 'jszip';
    import { extractData } from '../app/package';

    let loading = false;
    let error = false;

    function handleFile (file) {
        let loadingStartAt = Date.now();
        loading = true;
        JSZip.loadAsync(file).then((zip) => {
            loading = false;
            const validPackage = !!zip.files['README.txt'];
            if (!validPackage) return error = true;

            extractData(zip).then((statistics) => {
                alert('Statistics loaded!');
            });
        });
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
