// Allow html strings to be formatted with lit-html plugins
// this does absolutely nothing to the code
import html from "../../utils/html";

export default {
  template: html`<div id="help" style="display: block;">
    <button class="close-button">
      <svg width="20" height="20" viewBox="0 0 1792 1792">
        X
        <path
          d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
          fill="#fff"
        ></path>
      </svg>
    </button>
    <h1>Help</h1>
    <h2>Palette</h2>
    <ul>
      <li>Left Click - Choose Color</li>
      <li>Right Click - Edit Color</li>
    </ul>
    <h2>Hotkeys</h2>
    <ul>
      <li>
        Pencil: <span class="keyboard-key">B</span> or
        <span class="keyboard-key">1</span>
      </li>
      <li>
        Fill: <span class="keyboard-key">F</span> or
        <span class="keyboard-key">2</span>
      </li>
      <li>
        Eyedropper: <span class="keyboard-key">E</span> or
        <span class="keyboard-key">3</span>
      </li>
      <li>
        Pan: <span class="keyboard-key">P</span> or
        <span class="keyboard-key">M</span> or
        <span class="keyboard-key">4</span>
      </li>
      <li>
        Zoom: <span class="keyboard-key">Z</span> or
        <span class="keyboard-key">5</span>
      </li>
      <li>Undo: Ctrl + <span class="keyboard-key">Z</span></li>
      <li>
        Redo: Ctrl + <span class="keyboard-key">Y</span> or Ctrl + Alt +
        <span class="keyboard-key">Z</span>
      </li>
    </ul>
    <h2>Mouse Shortcuts</h2>
    <ul>
      <li>Alt + Click - Eyedropper</li>
      <li>Space + Click - Pan</li>
      <li>Alt + Scroll Wheel - Zoom</li>
    </ul>
  </div>`,
};
