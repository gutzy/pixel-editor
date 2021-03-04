import { Component, litable, html } from "../../litable";
import EventBus from "../utils/EventBus";
import Logo from "../assets/svg/lospec.svg";

class MenuBar extends Component {
  constructor() {
    super();
    this.state = { menu: null, zoom: 1, toolInfo: null };
  }

  componentDidMount() {
    EventBus.$on("ui-set-menu", (menu) => {
      this.setState({ menu });
    });

    // blur click behavior - avoid weirdness, stop propagation that will close the menu otherwise
    // document
    //   .getElementById("menubar-panel")
    //   .addEventListener("mousedown", (e) => e.stopPropagation());
    // document
    //   .getElementById("menubar-panel")
    //   .addEventListener("click", (e) => e.stopPropagation());

    // status updates
    EventBus.$on("ui-zoom", (zoom) => this.setState({ zoom }));
    EventBus.$on("ui-tool-info", (toolInfo) => {
      this.setState({ toolInfo });
    });
  }

  getZoomLevel() {
    return parseFloat(this.state.zoom * 100).toFixed(0) + "%";
  }

  renderToolInfo() {
    if (!this.state.toolInfo) return null;
    for (const key in this.state.toolInfo) {
      return html`
        <div class="status">
          <span>${key}: <b>${this.state.toolInfo[key]}</b></span>
        </div>
      `;
    }
  }

  stopPropagation(e) {}

  render() {
    return html`
      <div
        class="menubar"
        id="menubar-panel"
        @mousedown=${(e) => e.stopPropagation()}
        @click=${(e) => e.stopPropagation()}
      >
        <img src=${Logo} style="padding:8px" />
        <!-- <h1>Lospec Pixel Editor</h1> -->
        <div class="menubar-content">
          ${Nav(this.state.menu)}
          <div class="menubar-status">
            <div class="status">
              <span>Zoom: <b>${this.getZoomLevel()}</b></span>
            </div>
            ${this.renderToolInfo()}
          </div>
        </div>
      </div>
    `;
  }
}

const Nav = litable(
  class extends Component {
    constructor() {
      super();
      this.state = {
        selected: null,
      };
    }

    componentDidMount() {
      // when make a propagated click close the menu
      window.addEventListener("click", () => {
        this.openSubMenu(null);
      });
    }

    openSubMenu(item) {
      this.setState({ selected: item === this.state.selected ? null : item });
    }

    selectMenuItem(menuItem) {
      EventBus.$emit("run-menu-item", menuItem);
    }

    handleMouseOver(name) {
      if (this.state.selected && this.state.selected !== name)
        this.setState({ selected: name });
    }

    renderMenuItems(group) {
      return group.map((item) => {
        return html`
          <div class="menubar-item" @click=${() => this.selectMenuItem(item)}>
            ${item.name}
          </div>
        `;
      });
    }

    render() {
      if (!this.props) return null;
      return html`
        <nav ref="nav">
          ${Object.keys(this.props).map((item) => {
            return html`
              <div
                class=${"menubar-item" +
                (this.state.selected === item ? " selected" : "")}
                @click=${() => this.openSubMenu(item)}
                @mouseover=${() => this.handleMouseOver(item)}
              >
                ${item}
                <div class="menubar-sub-items">
                  ${this.state.selected === item
                    ? this.renderMenuItems(this.props[item])
                    : null}
                </div>
              </div>
            `;
          })}
        </nav>
      `;
    }
  }
);

export default litable(MenuBar);
