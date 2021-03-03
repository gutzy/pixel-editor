/**
 * APP LAUNCHER
 * This runs the Pixel editor.
 *
 * 1. Defines the Vue application wrapper.
 * 2. Once the application is mounted, initializes the pixel editor on the main canvas.
 *
 * The pixel editor works inside the main canvas element, completely independently of Vue.
 * The parts Vue.js is in charge of are the menus, panels, toolbox - stuff that aren't drawn inside the canvas.
 *
 * The Editor and Vue components communicate with each other using our own simple EventBus system, so Vue can be easily
 * detached and replaced with another framework if the need arises.
 *
 * Have fun!
 *
 */
import Vue from "vue/dist/vue";
import "./style.scss";
import AppManager from "./classes/AppManager";
import LayersPanel from "./components/LayersPanel";

import { Component, litable, html, render } from "../litable";
import LitMenuBar from "./lit-components/MenuBar";
import LitToolbox from "./lit-components/Toolbox";
import LitColorPalette from "./lit-components/ColorPalette";
import LitLayersPanel from "./lit-components/LayersPanel";

import EventBus from "./utils/EventBus";

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log("App mounted!");
    let canvasElement = document.getElementById("main-canvas");
    AppManager.init(canvasElement);

    // temporarily mounting view version of layers
    const vm = new Vue(LayersPanel).$mount("#vue-layers-mount");
    console.log(AppManager.file.layers);
    EventBus.$emit("ui-update-layers", AppManager.file.layers);
  }

  render() {
    return html`
      <div class="canvas-wrapper">
        <canvas id="main-canvas" ref="canvas"></canvas>
      </div>
      <div class="app">
        <div class="header">${LitMenuBar({ menu: AppManager.menu })}</div>
        <div class="main-content">
          ${LitToolbox()}
          <div style="position:relative; flex: 1">${LitColorPalette()}</div>
          <!-- ${LitLayersPanel()} -->
          <div id="vue-layers-mount"></div>
        </div>
      </div>
    `;
  }
}

const litableApp = litable(App);

render(litableApp(), document.getElementById("app"));
