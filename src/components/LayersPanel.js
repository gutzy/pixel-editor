import EventBus from "../utils/EventBus";
import VisibleIcon from "../assets/svg/visible.svg";
import InvisibleIcon from "../assets/svg/invisible.svg";
import LockedIcon from "../assets/svg/lockedpadlock.svg";
import UnlockedIcon from "../assets/svg/unlockedpadlock.svg";
import PlusIcon from "../assets/svg/plus.svg";

export default {

    data : function() {
        return {
            VisibleIcon, InvisibleIcon, LockedIcon, UnlockedIcon, PlusIcon,
            layers : null,
            selectedLayer : null,
        }
    },

    methods : {
        selectLayer(layer) {
            EventBus.$emit('try-selecting-layer', layer.name);
        },

        toggleLayerLock(layer) {
            EventBus.$emit('try-toggling-layer-lock', layer.name);
        },
        toggleLayerVisibility(layer) {
            EventBus.$emit('try-toggling-layer-visibility', layer.name);
        },
        addLayer() {
            EventBus.$emit('try-adding-layer');
        }
    },

    mounted() {
        EventBus.$on('update-layers', layers => {
            layers = layers.map(l => { return {name: l.name, visible: l.visible, locked: l.locked}});
            this.$set(this, 'layers', layers.reverse());
        });
        EventBus.$on('select-layer', layer => {
            this.selectedLayer = layer.name;
        });
    },

    template : `
    <div class="layers-panel">
        <div v-if="layers" class="list">
            <div :class="'layer'+(selectedLayer==layer.name?' selected':'')" v-for="layer in layers" v-on:mousedown="selectLayer(layer)">
                <div class="layer-thumb"></div>
                <div class="layer-meta">
                    <div class="layer-meta-btn" v-on:mousedown="toggleLayerLock(layer)">
                        <img :src="layer.locked?LockedIcon:UnlockedIcon" />
                    </div>
                    <div class="layer-meta-btn" v-on:mousedown="toggleLayerVisibility(layer)">
                        <img :src="layer.visible?VisibleIcon:InvisibleIcon" />
                    </div>
                </div>
                <p>{{layer.name}}</p>
            </div>
        </div>
        <div class="add-layer" v-on:click="addLayer">
            <img :src="PlusIcon" />
            <span>Add Layer</span>
        </div>
    </div>
    `

}
