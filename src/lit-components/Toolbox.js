import { Component, litable, html } from "../../litable";
import EventBus from "../utils/EventBus";

class Toolbox extends Component {
  constructor() {
    super();
    this.state = {
      tools: [],
      selectedTool: null,
    };
  }

  componentDidMount() {
    // bind 'ui-set-tools' editor event to set the tools in the tool box
    EventBus.$on("ui-set-tools", (tools) => {
      tools = tools.map((tool) => {
        return { name: tool.name, icon: tool.icon };
      });
      this.setState({ tools });
    });

    // bind 'ui-select-tool' editor event to set the selected tool
    EventBus.$on("ui-select-tool", (selectedTool) => {
      this.setState({ selectedTool });
    });
  }

  selectTool(tool) {
    console.log("SELECT");
    EventBus.$emit("try-selecting-tool", tool.name);
  }

  renderTools() {
    console.log("TOOL RENDER", this.state.selectedTool);
    return this.state.tools.map((tool) => {
      // "'tool'+(selectedTool===tool.name?' selected':'')"
      return html`
        <div
          class=${"tool" +
          (this.state.selectedTool === tool.name ? " selected" : "")}
          @mousedown=${() => this.selectTool(tool)}
        >
          <img src=${tool.icon} title=${tool.name} />
        </div>
      `;
    });
  }

  render() {
    return html`
      <div class="tools-panel">
        <div class="tools">${this.renderTools()}</div>
      </div>
    `;
  }
}

export default litable(Toolbox);
