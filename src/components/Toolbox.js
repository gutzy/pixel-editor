/**
 * @VueComponent: Tool Box
 * @Description The panel containing all the tools, allowing selecting them.
 *
 */
import EventBus from "../utils/EventBus";

export default {

    /**
     * Component State
     * @var tools - array of tools
     * @var selectedTool - name of the currently selected tool
     */
    data : function() {
        return {
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
        }
    },

    mounted() {
        // bind 'ui-set-tools' editor event to set the tools in the tool box
        EventBus.$on('ui-set-tools', tools => {
            tools = tools.map(tool => { return {name: tool.name, icon: tool.icon }});
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
            </div>
        </div>
    </div>
    `

}
