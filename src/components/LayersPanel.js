import EventBus from "../utils/EventBus";
import VisibleIcon from "../assets/svg/visible.svg";
import InvisibleIcon from "../assets/svg/invisible.svg";
import LockedIcon from "../assets/svg/lockedpadlock.svg";
import UnlockedIcon from "../assets/svg/unlockedpadlock.svg";

export default {

    data : function() {
        return {
            VisibleIcon, InvisibleIcon, LockedIcon, UnlockedIcon,
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
            <div :class="'layer'+(selectedLayer==layer.name?' selected':'')" v-for="layer in layers" v-on:mousedown="selectLayer(layer)">
                <div class="layer-thumb"></div>
                <div class="layer-meta">
                    <div class="layer-meta-btn">
                        <img :src="layer.locked?LockedIcon:UnlockedIcon" />
                    </div>
                    <div class="layer-meta-btn">
                        <img :src="layer.visible?InvisibleIcon:VisibleIcon" />
                    </div>
                </div>
                <p>{{layer.name}}</p>
            </div>
        </div>
    </div>
    `

}
