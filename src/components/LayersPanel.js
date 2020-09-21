import EventBus from "../utils/EventBus";

export default {

    data : function() {
        return {
            layers : null,
            selectedLayer : null,
        }
    },

    methods : {
        selectLayer(layer) {
            EventBus.$emit('try-selecting-layer', layer.name);
        }
    },

    mounted() {
        EventBus.$on('update-layers', layers => {
            layers = layers.map(l => { return {name: l.name}});
            this.layers = layers;
        });
        EventBus.$on('select-layer', layer => {
            this.selectedLayer = layer.name;
            console.log(layer);
        })
    },

    template : `
    <div class="layers-panel">
        <div v-if="layers" class="list">
            <div :class="'layer'+(selectedLayer==layer.name?' selected':'')" v-for="layer in layers" v-on:click="selectLayer(layer)">
                <div class="layer-thumb"></div>
                <div class="layer-meta">
                
                </div>
                <p>{{layer.name}}</p>
            </div>
        </div>
    </div>
    `

}
