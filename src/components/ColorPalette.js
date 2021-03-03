/**
 * @VueComponent: Color Palette
 * @Description The color palette, displays the colors in the active File
 *
 */
import EventBus from "../utils/EventBus";
import Draggable from "vuedraggable";

export default {

	/**
	 * Component State
	 * @var colors - array of colors in the palette
	 * @var selectedColor - index of the currently selected color
	 */
	data : function() {
		return {
			colors : null,
			selectedColor: null,
		}
	},

	methods : {
		/**
		 * select color - emits an 'try-selecting-color' event to the editor
		 *
		 * @param {string} color
		 */
		selectColor(color) {
			EventBus.$emit("try-selecting-color", color);
		}
	},

	/**
	 * Mounted component hook
	 */
	mounted() {
		// bind 'ui-set-palette' editor event to set the colors in the palette (when loading a file or palette etc.)
		EventBus.$on('ui-set-palette', colors => {
			this.colors = colors;
		});

		// bind 'ui-select-color' to set the selected color in the UI (when using an eyedropper tool etc.)
		EventBus.$on('ui-select-color', selectedColor => {
			this.selectedColor = selectedColor;
		});

		// stop propagation of mousedown events beyond the component
		this.$refs.panel.addEventListener('mousedown', e => e.stopPropagation());
	},

	components : { Draggable },

    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        }
    },

	/**
	 * Rendered template
	 */
	template : `
    <div class="color-palette-panel" ref="panel">
        <div v-if="colors" class="colors">
			<draggable class="draggable-colors" v-model="colors" group="paletteColors" draggable=".color" v-bind="dragOptions">
				<div :class="'color' + (color === selectedColor?' selected':'')" v-for="color of colors" :style="{'background-color': color}" @click="selectColor(color)">
				
				</div>
			</draggable>
        </div>
    </div>
    `

}
