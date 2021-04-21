// Allow html strings to be formatted with lit-html plugins
// this does absolutely nothing to the code
import html from "../../utils/html";

export default {
  template: html`<div id="changelog" style="display: block;">
    <button class="close-button">
      <svg width="20" height="20" viewBox="0 0 1792 1792">
        X
        <path
          d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
          fill="#fff"
        ></path>
      </svg>
    </button>

    <h1>Changelog</h1>
    <h2>Version 1.3.0 - 9/8/20</h2>
    <ul>
      <li>Added layers <span class="weak">- Unsettled</span></li>
    </ul>
    <h2>Version 1.2.0 - 4/14/20</h2>
    <ul>
      <li>
        Added rectangle / selection tools <span class="weak">- Unsettled</span>
      </li>
    </ul>
    <h2>Version 1.1.0 - 4/4/19</h2>
    <ul>
      <li>
        Added transparency / eraser tool <span class="weak">- Unsettled</span>
      </li>
    </ul>
    <h2>Version 1.0.0 - 11/17/17</h2>
    <ul>
      <li>Initial release <span class="weak">- skeddles</span></li>
    </ul>
  </div>`,
};
