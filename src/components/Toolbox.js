/**
 * @VueComponent: Tool Box
 * @Description The panel containing all the tools, allowing selecting them.
 *
 */
import EventBus from "../utils/EventBus";
import IncreaseIcon from "../assets/svg/plus.svg";
import DecreaseIcon from "../assets/svg/minus.svg";

export default {

    /**
     * Component State
     * @var tools - array of tools
     * @var selectedTool - name of the currently selected tool
     */
    data : function() {
        return {
            IncreaseIcon, DecreaseIcon,
            tools : null,
            selectedTool: null,
        }
    },

    methods : {
        /**
         * Select Tool - Emits 'try-selecting-tool' event to the editor
         *
         * @param tool - Vue tool object
         */
        selectTool(tool) {
            EventBus.$emit("try-selecting-tool", tool.name);
        },

        changeToolSize(tool, delta) {
            EventBus.$emit("try-changing-tool-size", tool, delta);
        }
    },

    mounted() {
        // bind 'ui-set-tools' editor event to set the tools in the tool box
        EventBus.$on('ui-set-tools', tools => {
            tools = tools.map(tool => { return {name: tool.name, icon: tool.icon, size: tool.size }});
            this.tools = tools;
        });

        // bind 'ui-select-tool' editor event to set the selected tool
        EventBus.$on('ui-select-tool', selectedTool => {
            this.selectedTool = selectedTool;
        });
    },

    /**
     * Rendered template
     */
    template : `
    <div class="tools-panel">
        <div v-if="tools" class="tools">
            <div :class="'tool'+(selectedTool===tool.name?' selected':'')" v-for="tool of tools" @mousedown="selectTool(tool)">
                <img :src="tool.icon" :title="tool.name" />
                <div v-if="tool.size" class="toolSize">
                    <ul>
                        <li @mouseDown="changeToolSize(tool, 1)"> <img :src="IncreaseIcon"/></li>
                        <li @mouseDown="changeToolSize(tool, -1)"><img :src="DecreaseIcon"/></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `
}
