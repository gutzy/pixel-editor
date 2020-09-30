import Vue from 'vue/dist/vue';
import "./style.scss";
import AppManager from "./classes/AppManager";
import LayersPanel from "./components/LayersPanel";
import Toolbox from "./components/Toolbox";
import ColorPalette from "./components/ColorPalette";

const vm = new Vue({

		data : function() {
			return {
			}
		},

		methods : {

		},

		async mounted() {
			AppManager.init(this.$refs.canvas);
		},

		components : { LayersPanel, Toolbox, ColorPalette },

		template : `
            <div class="app">
            	<div class="header">
            	
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
