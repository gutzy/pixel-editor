import { Component, litable, html } from "../../litable";
import EventBus from "../utils/EventBus";

class ColorPalette extends Component {
  constructor() {
    super();
    this.state = {
      colors: [],
      selectedColor: null,
    };
  }

  selectColor(color) {
    EventBus.$emit("try-selecting-color", color);
  }

  componentDidMount() {
    // bind 'ui-set-palette' editor event to set the colors in the palette (when loading a file or palette etc.)
    EventBus.$on("ui-set-palette", (colors) => {
      this.setState({ colors });
    });

    // bind 'ui-select-color' to set the selected color in the UI (when using an eyedropper tool etc.)
    EventBus.$on("ui-select-color", (selectedColor) => {
      this.setState({ selectedColor });
    });

    // stop propagation of mousedown events beyond the component
    document
      .getElementById("palette-panel")
      .addEventListener("mousedown", (e) => e.stopPropagation());
  }

  render() {
    return html`
      <div class="color-palette-panel" id="palette-panel">
        <div class="colors">
          ${this.state.colors.map((color) => {
            return html`
              <div
                class=${"color" +
                (color === this.state.selectedColor ? " selected" : "")}
                @click=${() => this.selectColor(color)}
                style=${`background-color:${color}`}
              ></div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

export default litable(ColorPalette);
