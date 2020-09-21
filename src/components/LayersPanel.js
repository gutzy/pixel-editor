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
            showMenu : null,
            renaming : null,
            newLayerName: '',
        }
    },

    methods : {
        selectLayer(layer) {
            this.showMenu = null;
            EventBus.$emit('try-selecting-layer', layer.name);
        },
        toggleLayerLock(layer) {
            EventBus.$emit('try-toggling-layer-lock', layer.name);
        },
        toggleLayerVisibility(layer) {
            EventBus.$emit('try-toggling-layer-visibility', layer.name);
        },
        deleteLayer(layer) {
            console.log("del", layer.name);
            EventBus.$emit('try-deleting-layer', layer.name);
        },
        renameLayer(layer, name) {
            EventBus.$emit('try-renaming-layer', layer.name, name);
            this.renaming = null;
        },
        mergeBelow(layer) {
            EventBus.$emit('try-merging-layer-below', layer.name);
        },
        flattenVisible() {
            EventBus.$emit('try-flatten-visible-layers');
        },
        flattenAll() {
            EventBus.$emit('try-flatten-all-layers');
        },

        selectLayerToRename(layer) {
            this.renaming = layer.name;
            this.newLayerName = layer.name;
            setTimeout(() => {
                this.$refs.layerNameInput[0].focus();
                this.$refs.layerNameInput[0].select();
            },0)
        },
        addLayer() {
            EventBus.$emit('try-adding-layer');
        },
        rightClick(layer) {
            this.showMenu = layer.name;
        }
    },

    mounted() {
        EventBus.$on('update-layers', layers => {
            layers = layers.map(l => { return {name: l.name, visible: l.visible, locked: l.locked, thumb: l.getImage().toDataURL("image/png")}});
            this.$set(this, 'layers', layers.reverse());
        });
        EventBus.$on('select-layer', layer => {
            this.selectedLayer = layer.name;
        });
    },

    template : `
    <div class="layers-panel">
        <div v-if="layers" class="list">
            <div :class="'layer'+(selectedLayer==layer.name?' selected':'')" v-for="(layer, index) in layers" @mousedown="selectLayer(layer)" @contextmenu.prevent="rightClick(layer)">
                <div v-if="showMenu == layer.name" class="layer-menu">
                    <button @mousedown="deleteLayer(layer)">Delete</button>
                    <button @mousedown="selectLayerToRename(layer)">Rename</button>
                    <button v-if="index < layers.length-1" @mousedown="mergeBelow(layer)">Merge Below</button>
                    <button @mousedown="flattenVisible()">Flatten Visible</button>
                    <button @mousedown="flattenAll()">Flatten All</button>
                </div>
                <div class="layer-thumb">
                    <img :src="layer.thumb" />
                </div>
                <div class="layer-meta">
                    <div :class="'layer-meta-btn' + (layer.locked?' active':'')" @mousedown.stop="toggleLayerLock(layer)">
                        <img :src="layer.locked?LockedIcon:UnlockedIcon" />
                    </div>
                    <div :class="'layer-meta-btn' + (layer.visible?' active':'')" @mousedown.stop="toggleLayerVisibility(layer)">
                        <img :src="layer.visible?VisibleIcon:InvisibleIcon" />
                    </div>
                </div>
                <p v-if="renaming != layer.name" @dblclick="selectLayerToRename(layer)">{{layer.name}}</p>
                <input v-if="renaming == layer.name" v-model="newLayerName" ref="layerNameInput" @keydown.enter="renameLayer(layer, newLayerName)" />
            </div>
        </div>
        <div class="add-layer" @click="addLayer">
            <img :src="PlusIcon" />
            <span>Add Layer</span>
        </div>
    </div>
    `

}
