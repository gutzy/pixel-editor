import Vue from 'vue/dist/vue';
import "./style.scss";
import AppManager from "./classes/AppManager";
import LayersPanel from "./components/LayersPanel";
import Toolbox from "./components/Toolbox";
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

		components : { LayersPanel, Toolbox },

		template : `
            <div class="app">
            	<div class="canvas-wrapper">
            		<canvas id="main-canvas" ref="canvas"></canvas>
				</div>
				<toolbox />
            	<layers-panel />
		    </div>
            `
	},
).$mount('#app');
