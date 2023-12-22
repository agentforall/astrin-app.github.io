<script lang="ts">
  import { onMount } from "svelte";
  import {Rive} from "@rive-app/canvas"
  import { writable } from "svelte/store";
  let isDark = writable(false);
  let el = writable<Rive>()
    let canvas: HTMLCanvasElement;
    onMount(() => {
        let dark;
        if (!localStorage.getItem("theme")){
            dark = true
        }else if(localStorage.getItem("theme") == "dark") {
            dark = true
        }else {
            dark = false
        }
        $el = new Rive({
        src: "/theme.riv",
        // Or the path to a public Rive asset
        // src: '/public/example.riv',
        canvas,
        autoplay: true,
        stateMachines: "State Machine 1",
        onLoad: () => {
          $el.resizeDrawingSurfaceToCanvas();
            
          let l = $el.stateMachineInputs("State Machine 1")
                .find((input) => input.name == "isDark")
          l.value =dark
        },
    });
    })

    let changeTheme = () => {
        let theme = localStorage.getItem("theme")

        if (theme == "dark"){
            localStorage.setItem("theme","light")
            $isDark = false
            let l = $el.stateMachineInputs("State Machine 1")
                .find((input) => input.name == "isDark")
          l.value = $isDark
          
        }else {
            localStorage.setItem("theme","dark")
            $isDark = true
            let l = $el.stateMachineInputs("State Machine 1")
                .find((input) => input.name == "isDark")
          l.value = $isDark
        }
        document.dispatchEvent(new Event("storage"))
    }

</script>

<nav>
    <ul>
      <li><strong>Astrin</strong></li>
    </ul>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/editor">Editor</a></li>
      <li>        <button on:click={changeTheme} class="mode-switch">
        <canvas bind:this={canvas} width="90" height="50"></canvas>
    </button></li>
    </ul>
  </nav>

<style>
@import "https://unpkg.com/open-props";
    nav {
        padding-inline:30px;
        box-sizing: border-box;
        background-color: var(--gray-9);
        box-shadow: var(--shadow-3);
    }
    nav ul li strong {
        color: var(--gray-2)
    }
    .mode-switch {
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: none;
}
</style>