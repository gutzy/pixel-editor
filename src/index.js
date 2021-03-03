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
import Toolbox from "./components/Toolbox";
import ColorPalette from "./components/ColorPalette";
import MenuBar from "./components/MenuBar";

import { Component, litable, html, render } from "../litable";
import LitMenuBar from "./lit-components/MenuBar";
import LitToolbox from "./lit-components/Toolbox";
import LitColorPalette from "./lit-components/ColorPalette";
import LitLayersPanel from "./lit-components/LayersPanel";

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log("App mounted!");
    let canvasElement = document.getElementById("main-canvas");
    AppManager.init(canvasElement);
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
          ${LitLayersPanel()}
          <!-- <color-palette /> -->
          <!-- <layers-panel /> -->
        </div>
      </div>
    `;
  }
}

const litableApp = litable(App);

render(litableApp(), document.getElementById("app"));

// const vm = new Vue({

// 		async mounted() {
// 			AppManager.init(this.$refs.canvas);
// 		},

// 		components : { LayersPanel, Toolbox, ColorPalette, MenuBar },

// 		template : `
//             <div class="app">
//             	<div class="header">
//             		<menu-bar />
// 				</div>
// 				<div class="main-content">
// 					<toolbox />
// 	            	<div class="canvas-wrapper">
//     	        		<canvas id="main-canvas" ref="canvas"></canvas>
// 					</div>
// 					<color-palette />
//             		<layers-panel />
// 				</div>
// 		    </div>
// 				`
// 	},
// ).$mount('#app');
