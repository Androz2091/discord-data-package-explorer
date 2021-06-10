<script>
    import { Unzip, AsyncUnzipInflate } from 'fflate';
    import { getContext } from 'svelte';

    import { loaded, loadTask, loadEstimatedTime, data } from '../app/store';
    import { extractData } from '../app/extractor';
    
    import Modal from '../components/Modal.svelte';

    const { open } = getContext('simple-modal');
    
    const showModal = (message) => {
        open(Modal, { message });
    };

    let loading = false;
    let error = false;

    async function handleFile (file) {
        loading = true;

        const uz = new Unzip();
        uz.register(AsyncUnzipInflate);

        const files = [];
        uz.onfile = (f) => files.push(f);

        if (!file.stream) {
            loading = false;
            error = 'This browser is not supported. Try using Google Chrome instead.';
            return;
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

        /**
         * If the package is valid and have
         * all the required files files.
         */
        const validPackage = (() => {
            const requiredFiles = [
                'README.txt',
                'account/user.json',
                'messages/index.json',
                'servers/index.json'
            ];

            for (const requiredFile of requiredFiles) {
                if (! files.some((file) => file.name === requiredFile)) {
                    return false;
                }
            }

            return true;
        })();

        if (!validPackage) {
            error = 'Your package seems to be corrupted. Click or drop your package file here to retry';
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
            if (err.message === 'invalid_package_missing_messages') {
                error = 'Some data is missing in your package, therefore it can not be read. <br> It is a bug on Discord side (06-10-21), and will be fixed in the next few days. <br> Join <a href="https://androz2091.fr/discord">our Discord</a> to get more information.';
                loading = false;
            } else {
                error = 'Something went wrong... Click or drop your package file here to retry';
                loading = false;
                alert(err.stack);
            }
        });
    }

    function handleDragOver (event) {
        event.preventDefault();
    }

    /** @see https://developer.mozilla.org/en-US/docs/Web/API/Document/drop_event */
    function handleDrop (event) {
        event.preventDefault();

        if (event.dataTransfer.items[0].getAsFile() !== null) {
            handleFile(event.dataTransfer.items[0].getAsFile());
        } else {
            error = 'Error trying to handle the dropped file. Try clicking instead.';
        }
    }

    function filePopup (event) {
        if (event.target.classList.value.includes('help') || loading) return;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.zip');
        input.addEventListener('change', (e) => handleFile(e.target.files[0]));
        input.addEventListener('error', () => error = true);
        input.click();
    }

    function helpPopup () {
        showModal(`
            <h3>About DDPE</h3>
            <p>Data privacy is important. DDPE is an <a href="https://github.com/Androz2091/discord-data-package-explorer" target="_blank">open source</a> website. No data is sent to any server. You can donate <a href="https://github.com/sponsors/Androz2091" target="_blank">here</a> ❤️</p>
        `);
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
        <p class="loader-error">{@html error}</p>
    {:else}
        <div>
            <div style="display: flex; align-items: center;">
                <p>Click or drop your package file here</p>
                <svg on:click="{helpPopup}" class="help" style="width: 25px; margin-left: 5px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
        </div>
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
        text-align: center;
        color: red;
    }
</style>
