// Allow html strings to be formatted with lit-html plugins
// this does absolutely nothing to the code
import html from "../../utils/html";

export default {
  template: html`<div id="new-pixel" style="display: block;">
    <button class="close-button">
      <svg width="20" height="20" viewBox="0 0 1792 1792">
        X
        <path
          d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
          fill="#fff"
        ></path>
      </svg>
    </button>
    <h1>New Pixel</h1>

    <!-- Editor mode-->
    <h2>Editor mode</h2>
    <button id="editor-mode-button" class="dropdown-button">
      Choose a mode...
    </button>
    <div id="editor-mode-menu" class="dropdown-menu">
      <button>Basic</button><button>Advanced</button>
    </div>
    <input id="editor-mode" value="'Advanced'" autocomplete="off" />
    <p id="editor-mode-info"></p>

    <!-- Preset-->
    <h2>Preset</h2>
    <button id="preset-button" class="dropdown-button">
      Choose a preset...
    </button>
    <div id="preset-menu" class="dropdown-menu">
      <button>Gameboy Color</button><button>PICO-8</button
      ><button>Commodore 64</button>
    </div>

    <h2>Size</h2>
    <input id="size-width" value="64" autocomplete="off" /><svg
      width="16"
      height="16"
      viewBox="0 0 1792 1792"
      class="dimentions-x"
    >
      X
      <path
        d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
        fill="#fff"
      ></path></svg
    ><input id="size-height" value="64" autocomplete="off" />
    <h2>Palette</h2>
    <button id="palette-button" class="dropdown-button">
      Choose a palette...
    </button>
    <div id="palette-menu" class="dropdown-menu">
      <button id="no-palette-button">Empty Palette</button
      ><button id="load-palette-button">Load palette...</button
      ><button>Endesga 32</button><button>AAP-64</button><button>Pear36</button
      ><button>Zughy 32</button><button>Resurrect 64</button
      ><button>Journey</button><button>Endesga 64</button
      ><button>Sweetie 16</button><button>Vinik24</button
      ><button>Fantasy 24</button><button>Commodore 64</button
      ><button>PICO-8</button><button>Gameboy Color</button>
    </div>

    <div id="new-pixel-warning" style="display: block;">
      Creating a new pixel will discard your current one.
    </div>
    <div>
      <button id="create-button" class="default">Create</button>
    </div>
  </div>`,
};
