// Allow html strings to be formatted with lit-html plugins
// this does absolutely nothing to the code
import html from "../../utils/html";

export default {
  template: html`<div id="settings" style="display: block;">
    <button class="close-button">
      <svg width="20" height="20" viewBox="0 0 1792 1792">
        X
        <path
          d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
          fill="#fff"
        ></path>
      </svg>
    </button>
    <h1>Settings</h1>

    <div id="settings-container">
      <label for="setting-numberOfHistoryStates"
        >Number of History States</label
      >
      <input id="setting-numberOfHistoryStates" value="20" autocomplete="off" />
    </div>

    <p id="cookies-disabled-warning">
      Your browsers cookies are disabled, settings will be lost upon closing
      this page.
    </p>

    <div>
      <button id="save-settings" class="default">Save</button>
    </div>
  </div>`,
};
