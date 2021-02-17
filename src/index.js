/**
 * APP LAUNCHER
 * This runs the Pixel editor.
 *
 * 1. Defines the Vue application wrapper.
 * 2. Once the application is mounted, initializes the pixel editor on the main canvas.
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

		data : function() {
			return {
			}
		},

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
