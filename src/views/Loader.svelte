<script>
    import { link } from 'svelte-routing';
	import { Unzip, AsyncUnzipInflate } from 'fflate';
    import { navigate } from "svelte-routing";
    import { loadTask, loadEstimatedTime, data } from '../app/store';
    import { extractData } from '../app/extractor';

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
            data.set(extractedData);
            loadTask.set(null);
            loadEstimatedTime.set(null);
            console.log(`[debug] Data extracted in ${(Date.now() - extractStartAt) / 1000} seconds.`);
            navigate('/stats');
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
</script>
    
<template>
    <div class="app-loader">
        <div class="app-loader-boxes">
            <p class="app-loader-description"><a href="/" use:link>DDPE</a> is a site that generates stats from your Discord Data Package. It is your device that processes the data, nothing is sent to any server!</p>
            <p>
                <a class="app-loader-tuto" href="/help" use:link>
                    <small class="app-loader-tag tag">1</small>
                    Get my Discord JSON data 👆
                    <br>
                    <span>(click on this button)</span>
                </a>
            </p>
            <div class="app-loader-upload" on:click="{filePopup}" style="cursor: { loading ? '' : 'pointer' }" on:drop="{handleDrop}" on:dragover="{handleDragOver}">
                <small class="app-loader-tag tag">2</small>
                <label for="upload">
                    <svg width="59" height="49" viewBox="0 0 59 49" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-9d8e2fa4="" d="M29.5 0.652008C25.0436 0.652008 20.5671 2.36576 17.1679 5.81576C14.4136 8.61109 12.8123 12.1254 12.2894 15.7607C5.37305 16.6594 0.0200195 22.6337 0.0200195 29.892C0.0200195 37.7705 6.32733 44.172 14.09 44.172H21.46C21.5488 44.1733 21.6369 44.1566 21.7193 44.123C21.8017 44.0894 21.8767 44.0395 21.9399 43.9763C22.0032 43.913 22.0534 43.8376 22.0876 43.7545C22.1219 43.6713 22.1396 43.5821 22.1396 43.492C22.1396 43.4019 22.1219 43.3127 22.0876 43.2295C22.0534 43.1464 22.0032 43.071 21.9399 43.0077C21.8767 42.9445 21.8017 42.8946 21.7193 42.861C21.6369 42.8274 21.5488 42.8107 21.46 42.812H14.09C7.0516 42.812 1.36002 37.0355 1.36002 29.892C1.36002 23.1472 6.43112 17.6122 12.9175 17.0145C13.0706 17.001 13.2145 16.9345 13.325 16.8262C13.4355 16.7179 13.506 16.5743 13.5247 16.4195C13.928 12.8934 15.4639 9.47896 18.1309 6.77201C21.273 3.58315 25.383 2.01201 29.5 2.01201C33.617 2.01201 37.7052 3.58215 40.8481 6.77201C44.4813 10.4594 46.0212 15.486 45.4544 20.287C45.4425 20.3832 45.4509 20.4808 45.4792 20.5734C45.5075 20.666 45.555 20.7513 45.6184 20.8238C45.6818 20.8962 45.7598 20.954 45.8471 20.9934C45.9343 21.0328 46.0289 21.0528 46.1244 21.052H46.92C52.8705 21.052 57.64 25.8927 57.64 31.932C57.64 37.9713 52.8705 42.812 46.92 42.812H37.54C37.4512 42.8107 37.3631 42.8274 37.2807 42.861C37.1983 42.8946 37.1233 42.9445 37.0601 43.0077C36.9969 43.071 36.9467 43.1464 36.9124 43.2295C36.8781 43.3127 36.8605 43.4019 36.8605 43.492C36.8605 43.5821 36.8781 43.6713 36.9124 43.7545C36.9467 43.8376 36.9969 43.913 37.0601 43.9763C37.1233 44.0395 37.1983 44.0894 37.2807 44.123C37.3631 44.1566 37.4512 44.1733 37.54 44.172H46.92C53.5897 44.172 58.98 38.7012 58.98 31.932C58.98 25.1628 53.5897 19.692 46.92 19.692H46.7944C47.1723 14.7203 45.554 9.61428 41.8113 5.81576C38.4131 2.36678 33.9565 0.652008 29.5 0.652008ZM29.437 23.772C29.2789 23.7856 29.1417 23.8585 29.0393 23.942L21.6693 30.742C21.4092 30.9862 21.385 31.457 21.6277 31.7195C21.8699 31.982 22.3337 31.9878 22.5908 31.7406L28.83 25.9819V47.5718C28.83 47.9474 29.13 48.2518 29.5 48.2518C29.8701 48.2518 30.17 47.9474 30.17 47.5718V25.9819L36.4094 31.7406C36.6665 31.9879 37.1303 31.9821 37.3725 31.7195C37.6147 31.457 37.6062 31.0233 37.331 30.742L29.961 23.942C29.7746 23.8029 29.5957 23.7581 29.4375 23.772H29.437Z" fill-opacity="0.39"></path></svg>
                    <span class="app-loader-upload-info">
                        {#if loading}
                            {$loadTask || "Loading your package file..."}
                            {#if $loadEstimatedTime}
                                <small style="display: block; margin-top: 4px;">{$loadEstimatedTime}</small>
                            {/if}
                        {:else if error}
                            <p style="color: red;">{@html error}</p>
                        {:else}
                            Click <strong>here</strong> to select your Discord data
                        {/if}
                    </span>
                </label>
            </div>
            <div class="app-discord">
                <a href="https://androz2091.fr/discord" target="_blank"><button class="app-discord-btn">Need help? Chat with us on Discord!</button></a>
            </div>
            <div class="app-demo">
                no package yet? <a href="/stats/demo" use:link>demo</a>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .app-loader {
		padding-top: 3rem;
		max-width: 768px;
		margin: auto;
	}
	.app-loader-boxes {
		padding: 0 30px;
	}
	.app-loader-description {
        font-weight: 500;
        margin: auto;
        margin-top: 5rem;
        margin-bottom: 3rem;
	}
	.app-loader-tuto {
		position: relative;
		padding: 1.25rem 0.75rem;
		text-decoration: none;
		text-align: center;
		background-color: rgba(var(--secondary-color-r), var(--secondary-color-g), var(--secondary-color-b), .1);
		display: block;
		color: var(--main-color);
		font-weight: 400;
		border-radius: 0.3rem;
	}
	.app-loader-upload {
		position: relative;
		label {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 1.25rem 0;
			margin: 2.5rem 0 0;
			border: 0.18rem dashed var(--main-color);
			border-radius: 0.3rem;
			cursor: pointer;
		}
	}
	.app-loader-upload-info {
		padding: 1.25rem 0.62rem 0;
		text-align: center;
	}
	.app-loader-tag {
		position: absolute;
		top: -10px;
		left: -10px;
		color: white;
	}
    .app-discord {
        padding-top: 2rem;
        width: 100%;
    }
    .app-discord-btn {
        padding: 1rem;
        color: white;
        font-weight: 600;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: #7289da;
        width: 100%;
    }
    .app-demo {
        padding-top: 1rem;
    }
</style>