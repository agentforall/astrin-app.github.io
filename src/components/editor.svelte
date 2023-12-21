<script lang="ts">
    import { onMount } from "svelte";
    import { FFmpeg } from '@ffmpeg/ffmpeg';
    import { fetchFile, toBlobURL } from '@ffmpeg/util';
    import { derived, writable } from "svelte/store";
  import { tweened } from "svelte/motion";
  var downloadBlob, downloadURL;

downloadBlob = function(data, fileName, mimeType) {
  var blob, url;
  blob = new Blob([data], {
    type: mimeType
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function() {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

downloadURL = function(data, fileName) {
  var a;
  a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = 'display: none';
  a.click();
  a.remove();
};
    let imageFiletypes = [
        "png",
        "jpeg",
        "webp",
        "gif"
    ]
    let videoFiletypes = [
        "mp4",
        "mpeg",
        "mkv",
        "gif",
    ]
    let fileGenre = writable("");
    let ffmpeg: FFmpeg;
    let progress = tweened(0);
    let mode = "loading"
    let fileInput: HTMLInputElement;
    let fileName = writable("");
    let outputFileInput = writable("");
    let convertableFileTypes = derived(fileGenre, $fileGenre => {
        

        if ($fileGenre == "image"){
            var index = imageFiletypes.indexOf($fileName);
            if (index !== -1) {
                imageFiletypes.splice(index, 1);
            }

            console.log(imageFiletypes)
            return imageFiletypes
        }else {
            return videoFiletypes
        }
    })
    async function loadFFMpeg() {
        try {   
        ffmpeg = new FFmpeg()
            ffmpeg.on("progress", (p) => {
                console.log(p.progress * 100)
                    $progress = p.progress * 100
            })
            await ffmpeg.load({
                coreURL: `${location.origin}/ffmpeg-core.js`,
                wasmURL: `${location.origin}/ffmpeg-core.wasm`,
            });
            mode = "loaded"
        }catch (e) {
            console.log(e)
        }

    }

    onMount(() => {
        loadFFMpeg()
    })

    $: console.log(mode,$convertableFileTypes)
    let fileUpload = (e: Event) => {
        document.startViewTransition(() => {
            mode = "file__selected"
        })
        $fileName = fileInput.files.item(0).type.split("/")[1]
        $fileGenre = fileInput.files.item(0).type.split("/")[0]
        
    }

    let startConversion = async () => {
        try {
            mode = "progress__start"
            let date = new Date().toISOString().split('T')[0].replaceAll("-","")
            let inputFileName = date + "." + $fileName
            console.log(date+"."+outputFileInput)
            let fileArrayBuffer = await fileInput.files.item(0).arrayBuffer()
            let fileUintArray = new Uint8Array(fileArrayBuffer)
            await ffmpeg.writeFile(inputFileName,fileUintArray)
            await ffmpeg.exec(['-i',inputFileName, date+"."+outputFileInput]);
            let out = await ffmpeg.readFile(date+"."+outputFileInput)
            downloadBlob(out, date,`image/${outputFileInput}`)
            setTimeout(() => {
            location.reload()

            },2000)
        }catch (e){
            console.log(e)
        }
    }
</script>

<div  class="parent" class:loading={mode == "loading"} aria-busy={mode == "loading"}>
    <div>
        <h1>Start Editing</h1>
    </div>
    <div class:hidden={mode != "file__selected"}  class=" select">
        <h1>Convert</h1>
        <select required>
            <option selected disabled value="">{$fileName}</option>

          </select>
          <h1>To</h1>
          <select bind:value={outputFileInput} required>
            {#each $convertableFileTypes as format }
                <option>{format}</option>
            {/each}
          </select>
    </div>
    <div class="input__parent">
        <input bind:this={fileInput} on:change={fileUpload} type="file" name="" id="">
    </div>
    {#if mode == "file__selected" }
        <div>
            <button on:click={startConversion}>Start Conversion</button>
        </div>
    {/if}
    {#if mode == "progress__start"}
        <progress value={$progress} max="100"></progress>
    {/if}
</div>