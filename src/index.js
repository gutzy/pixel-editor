import Vue from 'vue/dist/vue';
import "./style.scss";
import AppManager from "./classes/AppManager";

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

		components : { },

		template : `
            <div class="app">
            	<div class="canvas-wrapper">
            		<canvas id="main-canvas" ref="canvas"></canvas>
				</div>
		    </div>
            `
	},
).$mount('#app');
