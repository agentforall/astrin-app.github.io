import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import {createEffect, createSignal} from 'solid-js'

export default function () {
    let [mode,setMode] = createSignal("loading")
    let [ffmpeg,setFFmpeg] = createSignal<FFmpeg>()

    async function loadFFmpeg() {
        let baseURL = `https://unpkg.com/@ffmpeg/core@0.12.5/dist/esm`
        setFFmpeg(new FFmpeg())
        ffmpeg().on("log", (e) => {
            console.log(e)
        })
        ffmpeg().on("progress", (e) => {
            console.log(e)
        })
        await ffmpeg().load(
            {
                coreURL: `${baseURL}/ffmpeg-core.js`,
                wasmURL:  `${baseURL}/ffmpeg-core.wasm`
            }
        )

        console.log("Loading")
    }

    createEffect(() => {
        loadFFmpeg()
    })
    return <>
    
    </>
}