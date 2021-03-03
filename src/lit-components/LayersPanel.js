import { Component, litable, html } from "../../litable";
import EventBus from "../utils/EventBus";
import VisibleIcon from "../assets/svg/visible.svg";
import InvisibleIcon from "../assets/svg/invisible.svg";
import LockedIcon from "../assets/svg/lockedpadlock.svg";
import UnlockedIcon from "../assets/svg/unlockedpadlock.svg";
import PlusIcon from "../assets/svg/plus.svg";

class LayersPanel extends Component {
  constructor() {
    super();
    this.state = {
      layers: null,
      selectedLayer: null,
      showMenu: null,
      renaming: null,
      newLayerName: "",
      drag: false,
    };
  }

  componentDidMount() {
    // bind 'ui-update-layers' editor event to set the layers in the panel
    EventBus.$on("ui-update-layers", (layers) => {
      layers = layers.map((l) => ({
        name: l.name,
        visible: l.visible,
        locked: l.locked,
        thumb: l.getImage().toDataURL("image/png"),
      }));
      this.setState({ layers });
    });

    // bind 'ui-select-layer' editor event to set the selected layer in the panel
    EventBus.$on("ui-select-layer", (layer) => {
      this.setState({ selectLayer: layer.name });
    });

    // bind 'ui-select-layer' editor event to make set a layer to rename mode, showing an input instead of its name
    EventBus.$on("ui-start-renaming-layer", (layer) => {
      this.setLayerRename(layer);
    });

    // stop propagation of mousedown events beyond the component
    document
      .getElementById("layers-panel")
      .addEventListener("mousedown", (e) => e.stopPropagation());
  }

  selectLayer(layer) {
    this.setState({ showMenu: null });
    EventBus.$emit("try-selecting-layer", layer.name);
  }

  toggleLayerLock(layer) {
    EventBus.$emit("try-toggling-layer-lock", layer.name);
  }

  toggleLayerVisibility(layer) {
    EventBus.$emit("try-toggling-layer-visibility", layer.name);
  }

  deleteLayer(layer) {
    EventBus.$emit("try-deleting-layer", layer.name);
  }

  setLayerRename(layer) {
    // set the renamed layer
    this.setState({
      renaming: layer.name,
      newLayerName: layer.name,
    });

    // set a timeout for after the view was updated, then focus and select the text in the input field
    setTimeout(() => {
      // this.$refs.layerNameInput[0].focus();
      // this.$refs.layerNameInput[0].select();
    }, 0);
  }

  renameLayer(layer, name) {
    EventBus.$emit("try-renaming-layer", layer.name, name);
    this.setState({ renaming: null });
  }

  mergeBelow(layer) {
    EventBus.$emit("try-merging-layer-below", layer.name);
  }

  flattenVisible() {
    EventBus.$emit("try-flatten-visible-layers");
  }

  flattenAll() {
    EventBus.$emit("try-flatten-all-layers");
  }

  sortLayers(change) {
    const { oldIndex, newIndex } = change.moved;
    EventBus.$emit("sort-layers", oldIndex, newIndex);
  }

  addLayer() {
    EventBus.$emit("try-adding-layer", "Layer 1");
  }

  rightClick(layer) {
    this.setState({ showMenu: layer.name });
  }

  dragOptions() {
    return {
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    };
  }

  render() {
    return html`
      <div class="layers-panel" id="layers-panel">
        <div v-if="layers" class="list">
          <div
            :key="index"
            :class="'layer'+(selectedLayer===layer.name?' selected':'')"
            v-for="(layer, index) in layers"
            @mousedown="selectLayer(layer)"
            @contextmenu.prevent="rightClick(layer)"
          >
            <div v-if="showMenu === layer.name" class="layer-menu">
              <button @mousedown="deleteLayer(layer)">Delete</button>
              <button @mousedown="setLayerRename(layer)">Rename</button>
              <button
                v-if="index < layers.length-1"
                @mousedown="mergeBelow(layer)"
              >
                Merge Below
              </button>
              <button @mousedown="flattenVisible()">Flatten Visible</button>
              <button @mousedown="flattenAll()">Flatten All</button>
            </div>
            <div class="layer-thumb">
              <img :src="layer.thumb" />
            </div>
            <div class="layer-meta">
              <div
                :class="'layer-meta-btn' + (layer.locked?' active':'')"
                @mousedown.stop="toggleLayerLock(layer)"
              >
                <img :src="layer.locked?LockedIcon:UnlockedIcon" />
              </div>
              <div
                :class="'layer-meta-btn' + (layer.visible?' active':'')"
                @mousedown.stop="toggleLayerVisibility(layer)"
              >
                <img :src="layer.visible?VisibleIcon:InvisibleIcon" />
              </div>
            </div>
            <p v-if="renaming !== layer.name" @dblclick="setLayerRename(layer)">
              {{layer.name}}
            </p>
            <input
              v-if="renaming === layer.name"
              v-model="newLayerName"
              ref="layerNameInput"
              @keydown.enter="renameLayer(layer, newLayerName)"
            />
          </div>

          <div class="add-layer" @click="addLayer">
            <img :src="PlusIcon" />
            <span>Add Layer</span>
          </div>
        </div>
      </div>
    `;
  }
}

export default litable(LayersPanel);
