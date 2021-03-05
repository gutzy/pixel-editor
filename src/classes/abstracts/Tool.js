/**
 * Tool abstract class
 * An abstract from which any new tool needs to inherit.
 * It enforces implementation of the basic start/stop/use actions, and exposes select and hover as well.
 */
import { ToolAction } from "./Actions";
import EventBus from "../../utils/EventBus";

//class for tools
export default class Tool {
  constructor() {
    this.params = [];
    this.name = "Untitled Tool";
    this.selected = false;
    this.cursorOffset = [0, 0];
    this.size = undefined;
    this.cursorPos = null;
    EventBus.$on("input-mouse-move", this.onMouseMove.bind(this));
  }

  onMouseMove(x, y) {
    this.cursorPos = { x, y };
  }

  start(file, canvas, x, y, toolCanvas) {
    throw new Error("Tool start action not implemented");
  }
  stop(file, canvas, x, y, toolCanvas) {
    throw new Error("Tool stop action not implemented");
  }
  use(file, canvas, x, y, toolCanvas) {
    throw new Error("Tool use action not implemented");
  }
  select(file, canvas, x, y, toolCanvas) {}
  hover(file, canvas, x, y, toolCanvas) {}
  ui(file, canvas, x, y) {}

  // Run a tool action on a tool.
  doAction(action, ...params) {
    const a = new action();
    if (!(a instanceof ToolAction)) {
      throw new Error("Not a tool action!");
    }
    return a.do(this, ...params);
  }
}
