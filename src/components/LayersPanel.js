/**
 * @VueComponent: Layers Panel
 * @Description The draggable/droppable list of layers, with lock and visibility buttons etc.
 *
 */
import EventBus from "../utils/EventBus";
import VisibleIcon from "../assets/svg/visible.svg";
import InvisibleIcon from "../assets/svg/invisible.svg";
import LockedIcon from "../assets/svg/lockedpadlock.svg";
import UnlockedIcon from "../assets/svg/unlockedpadlock.svg";
import PlusIcon from "../assets/svg/plus.svg";

import Draggable from "vuedraggable";

export default {
  /**
   * Component State
   * @vars VisibleIcon, InvisibleIcon, LockedIcon, UnlockedIcon, PlusIcon - svg icons
   * @var layers - array of file's layers
   * @var selectedLayer - index of the currently selected layer
   * @var showMenu - index of the layer to display menu for
   * @var renaming - index of the layer that is currently being renamed
   * @var newLayerName - placeholder string for new layer name
   * @var drag - boolean indicator to whether a layer is dragged
   */
  data: function () {
    return {
      VisibleIcon,
      InvisibleIcon,
      LockedIcon,
      UnlockedIcon,
      PlusIcon,
      layers: null,
      selectedLayer: null,
      showMenu: null,
      renaming: null,
      newLayerName: "",
      drag: false,
    };
  },

  methods: {
    /**
     * Select layer - Emits 'try-selecting-layer' event to the editor
     *
     * @param layer - Vue layer object
     */
    selectLayer(layer) {
      this.showMenu = null;
      EventBus.$emit("try-selecting-layer", layer.name);
    },

    /**
     * Toggle Layer Lock - Emits 'try-toggling-layer-lock' event to the editor
     *
     * @param layer - Vue layer object
     */
    toggleLayerLock(layer) {
      EventBus.$emit("try-toggling-layer-lock", layer.name);
    },

    /**
     * Toggle Layer Visibility - Emits 'try-toggling-layer-visibility' event to the editor
     *
     * @param layer - Vue layer object
     */
    toggleLayerVisibility(layer) {
      EventBus.$emit("try-toggling-layer-visibility", layer.name);
    },

    /**
     * Delete Layer - Emits 'try-deleting-layer' event to the editor
     *
     * @param layer - Vue layer object
     */
    deleteLayer(layer) {
      EventBus.$emit("try-deleting-layer", layer.name);
    },

    /**
     * Set Layer Rename - Allows renaming a layer, shows an input box instead of the name
     *
     * @param layer - Vue layer object
     */
    setLayerRename(layer) {
      // set the renamed layer
      this.renaming = layer.name;
      this.newLayerName = layer.name;

      // set a timeout for after the view was updated, then focus and select the text in the input field
      setTimeout(() => {
        this.$refs.layerNameInput[0].focus();
        this.$refs.layerNameInput[0].select();
      }, 0);
    },

    /**
     * Rename layer - Emits 'try-renaming-layer' event to the editor
     *
     * @param layer - Vue layer object
     * @param name - new layer name
     */
    renameLayer(layer, name) {
      EventBus.$emit("try-renaming-layer", layer.name, name);
      this.renaming = null;
    },

    /**
     * Merge Layer Below - Emits 'try-merging-layer-below' event to the editor
     *
     * @param layer - Vue layer object
     */
    mergeBelow(layer) {
      EventBus.$emit("try-merging-layer-below", layer.name);
    },

    /**
     * Flatten Visible Layers - Emits 'try-flatten-visible-layers' event to the editor
     */
    flattenVisible() {
      EventBus.$emit("try-flatten-visible-layers");
    },

    /**
     * Flatten All Layers - Emits 'try-flatten-all-layers' event to the editor
     */
    flattenAll() {
      EventBus.$emit("try-flatten-all-layers");
    },

    /**
     * Sort layers. Uses the changed position from the drag/drop thing to reset layers.
     * Emits 'sort-layers' event to the editor.
     *
     * @param change - output from the Vue draggable component
     */
    sortLayers(change) {
      const { oldIndex, newIndex } = change.moved;
      EventBus.$emit("sort-layers", oldIndex, newIndex);
    },

    /**
     * Add Layer - Emits 'try-adding-layer' event to the editor
     */
    addLayer() {
      EventBus.$emit("try-adding-layer", "Layer 1");
    },

    /**
     * on Right Click - Sets the menu to display for the designated layer.
     *
     * @param layer - Vue layer object
     */
    rightClick(layer) {
      this.showMenu = layer.name;
    },
  },

  /**
   * Mounted component hook
   */
  mounted() {
    // bind 'ui-update-layers' editor event to set the layers in the panel
    EventBus.$on("ui-update-layers", (layers) => {
      layers = layers.map((l) => ({
        name: l.name,
        visible: l.visible,
        locked: l.locked,
        thumb: l.getImage().toDataURL("image/png"),
      }));
      this.$set(this, "layers", layers.reverse());
    });

    // bind 'ui-select-layer' editor event to set the selected layer in the panel
    EventBus.$on("ui-select-layer", (layer) => {
      this.selectedLayer = layer.name;
    });

    // bind 'ui-select-layer' editor event to make set a layer to rename mode, showing an input instead of its name
    EventBus.$on("ui-start-renaming-layer", (layer) => {
      this.setLayerRename(layer);
    });

    // stop propagation of mousedown events beyond the component
    this.$refs.panel.addEventListener("mousedown", (e) => e.stopPropagation());
  },

  components: { Draggable },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  /**
   * Rendered template
   */
  template: `
    <div class="layers-panel" ref="panel">
        <div v-if="layers" class="list">
            <draggable v-model="layers" @change="sortLayers" v-bind="dragOptions" class="list-group" @start="drag = true" @end="drag = false">
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                <div :key="index" :class="'layer'+(selectedLayer===layer.name?' selected':'')" v-for="(layer, index) in layers" @mousedown="selectLayer(layer)" @contextmenu.prevent="rightClick(layer)">
                    <div v-if="showMenu === layer.name" class="layer-menu">
                        <button @mousedown="deleteLayer(layer)">Delete</button>
                        <button @mousedown="setLayerRename(layer)">Rename</button>
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
                    <p v-if="renaming !== layer.name" @dblclick="setLayerRename(layer)">{{layer.name}}</p>
                    <input v-if="renaming === layer.name" v-model="newLayerName" ref="layerNameInput" @keydown.enter="renameLayer(layer, newLayerName)" />
                </div>
                </transition-group>
            </draggable>
            <div class="add-layer" @click="addLayer">
                <img :src="PlusIcon" />
                <span>Add Layer</span>
            </div>
        </div>
    </div>
    `,
};
