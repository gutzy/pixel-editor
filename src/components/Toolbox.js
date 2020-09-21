import EventBus from "../utils/EventBus";

export default {

    data : function() {
        return {
            tools : null,
            selectedTool: null,
        }
    },

    methods : {
        selectTool(tool) {
            EventBus.$emit("try-selecting-tool", tool.name);
        }
    },

    mounted() {
        EventBus.$on('set-tools', tools => {
            tools = tools.map(tool => { return {name: tool.name, icon: tool.icon }});
            this.tools = tools;
        });
        EventBus.$on('select-tool', selectedTool => {
            this.selectedTool = selectedTool;
        });
    },

    template : `
    <div class="tools-panel">
        <div v-if="tools" class="tools">
            <div :class="'tool'+(selectedTool==tool.name?' selected':'')" v-for="tool of tools">
                <img :src="tool.icon" :title="tool.name" v-on:mousedown="selectTool(tool)" />
            </div>
        </div>
    </div>
    `

}
