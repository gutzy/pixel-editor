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
import Vue from 'vue/dist/vue';
import "./style.scss";
import AppManager from "./classes/AppManager";
import LayersPanel from "./components/LayersPanel";
import Toolbox from "./components/Toolbox";
import ColorPalette from "./components/ColorPalette";
import MenuBar from "./components/MenuBar";

const vm = new Vue({

		async mounted() {
			AppManager.init(this.$refs.canvas);
		},

		components : { LayersPanel, Toolbox, ColorPalette, MenuBar },

		template : `
            <div class="app">
            	<div class="header">
            		<menu-bar />
				</div>
				<div class="main-content">
					<toolbox />
	            	<div class="canvas-wrapper">
    	        		<canvas id="main-canvas" ref="canvas"></canvas>
					</div>
					<color-palette />
            		<layers-panel />
				</div>
		    </div>`
	},
).$mount('#app');
