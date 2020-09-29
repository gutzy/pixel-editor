import EventBus from "../utils/EventBus";

export default {

	data : function() {
		return {
			colors : null,
			selectedColor: null,
		}
	},

	methods : {
		selectColor(color) {
			EventBus.$emit("try-selecting-color", color);
		}
	},

	mounted() {
		EventBus.$on('set-palette', colors => {
			this.colors = colors;
		});
		EventBus.$on('select-color', selectedColor => {
			this.selectedColor = selectedColor;
			console.log(this.selectedColor);
		});
	},

	template : `
    <div class="color-palette-panel">
        <div v-if="colors" class="colors">
            <div :class="'color' + (color == selectedColor?' selected':'')" v-for="color of colors" :style="{'background-color': color}" @click="selectColor(color)">
               
            </div>
        </div>
    </div>
    `

}
