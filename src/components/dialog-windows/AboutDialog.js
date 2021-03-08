// Allow html strings to be formatted with lit-html plugins
// this does absolutely nothing to the code
import html from "../../utils/html";

export default {
  template: html`<div id="about" style="display: block;">
    <button class="close-button">
      <svg width="20" height="20" viewBox="0 0 1792 1792">
        X
        <path
          d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
          fill="#fff"
        ></path>
      </svg>
    </button>
    <h1>About Lospec Pixel Editor</h1>
    <div>version 1.1.0</div>
    <p>This is a web-based tool for creating and editing pixel art.</p>
    <p>
      The goal of this tool is to be an accessible and intuitive tool that's
      simple enough for a first time pixel artist while still being usable
      enough for a veteran.
    </p>
    <p>
      In the future I hope to add enough features to become a full fledged pixel
      art editor, with everything an artist could need.
    </p>
    <h1>About Lospec</h1>
    <p>
      Lospec is a website created to host tools for pixel artists. To see more
      of our tools, visit our <a href="/">homepage</a>. To hear about any
      updates or new tools, follow us on
      <a href="http://twitter.com/lospecofficial">Twitter</a>.
    </p>
  </div>`,
};
