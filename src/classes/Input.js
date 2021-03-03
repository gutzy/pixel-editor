/**
 * Input Wrapper.
 * The input wrapper class bind to windows input events, as well as resizing, and dispatches them as EventBus events.
 * The reason is to make sure there is only one input binding handler, to avoid event lifecycle bugs and to
 * allow any component interested in input to subscribe to safe custom events rather than risky input events.
 *
 */
import EventBus from "../utils/EventBus";
import { getEventXY } from "../utils/InputUtils";

export default class Input {
  /**
   * constructor
   * @param {HTMLCanvasElement} canvasEl - main application canvas element. Relevant to resizing etc.
   */
  constructor(canvasEl) {
    this._canvas = canvasEl;
    this._keyDown = {};
    this._mouseDown = false;
    this._lastKeyDown = null;
  }

  /**
   * Bind window input event to the eventbus proxy
   */
  bindInputs() {
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("wheel", this.onMouseWheel.bind(this));
    window.addEventListener("pointermove", this.onMouseMove.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("focus", this.onFocus.bind(this));
  }

  /**
   * Mousewheel EventBus proxy
   */
  onMouseWheel(e) {
    const delta = e.deltaY;
    const xy = getEventXY(e, this._canvas.el);
    EventBus.$emit("input-mouse-wheel", delta, ...xy);
  }

  /**
   * Mouseup EventBus proxy
   */
  onMouseUp(e) {
    const xy = getEventXY(e, this._canvas.el);
    this._mouseDown = false;
    EventBus.$emit("input-mouse-up", ...xy);
  }
  /**
   * Mousedown EventBus proxy
   */
  onMouseDown(e) {
    const xy = getEventXY(e, this._canvas.el);
    this._mouseDown = true;
    EventBus.$emit("input-mouse-down", ...xy);
  }

  /**
   * Mousemove EventBus proxy
   */
  onMouseMove(e) {
    const xy = getEventXY(e, this._canvas.el);

    let coalesced;
    if (e.getCoalescedEvents) {
      coalesced = e
        .getCoalescedEvents()
        .map((event) => getEventXY(event, this._canvas.el));
    }

    EventBus.$emit("input-mouse-move", ...xy, coalesced);
  }
  /**
   * OnKeyUp EventBus proxy
   */
  onKeyUp(e) {
    if (this._keyDown[e.key]) delete this._keyDown[e.key];
    EventBus.$emit("input-key-up", e.key, this);
    if (e.key === this._lastKeyDown) {
      this._lastKeyDown = null;
    }

    // keys to prevent normal execution of
    if (["Alt"].indexOf(e.key) > -1) {
      e.preventDefault();
    }
  }
  /**
   * OnKeyDown EventBus proxy
   */
  onKeyDown(e) {
    if (e.key === this._lastKeyDown) return;
    this._keyDown[e.key] = true;

    let keys = Object.keys(this._keyDown);
    if (keys.length > 1) {
      EventBus.$emit("input-key-combination", keys, this);
    }
    else {
      EventBus.$emit("input-key-down", e.key, this);
    }

    this._lastKeyDown = e.key;

    // keys to prevent normal execution of
    if (["Alt"].indexOf(e.key) > -1) {
      e.preventDefault();
    }
  }

  /**
   * OnResize - resizes main canvas to fit full screen size
   */
  onResize(e) {
    this._canvas.el.removeAttribute("width");
    this._canvas.el.removeAttribute("height");
    this._canvas.el.setAttribute("width", this._canvas.el.offsetWidth * 1 + "");
    this._canvas.el.setAttribute(
      "height",
      this._canvas.el.offsetHeight * 1 + ""
    );
    EventBus.$emit("redraw-canvas");
  }

  /**
   * onFocus - runs when app screen is focused
   */
  onFocus() {
    this._keyDown = {};
    this._lastKeyDown = null;
    this._mouseDown = false;
    EventBus.$emit("focus", this);
  }

  /**
   * onKeyCombination - resolves alt/shift/ctrl key combinations, and emit an event with the combination in case
   * something is using it.
   *
   * @return boolean - whether a combination event was triggered
   */
  onKeyCombination(e) {
    // designate which meta keys are pressed
    const alt = this.isKeyDown("Alt"),
      shift = this.isKeyDown("Shift"),
      ctrl = this.isKeyDown("Control") || this.isKeyDown("Meta");

    // if meta keys are pressed along with another key, create a combination array
    if (
      (alt || shift || ctrl) &&
      e.key !== "Alt" &&
      e.key !== "Shift" &&
      e.key !== "Control" &&
      e.key !== "Meta"
    ) {
      // combination array
      let res = [e.key];

      // add any meta keys pressed to the combination
      if (alt) res.push("alt");
      if (shift) res.push("shift");
      if (ctrl) res.push("ctrl");

      // dispatch combination event
      EventBus.$emit("input-key-combination", res, this);
      return true;
    }
    return false;
  }

  /**
   * Check if a key is down
   * @param key
   * @return boolean
   */
  isKeyDown(key) {
    return typeof this._keyDown[key] !== "undefined";
  }

  /**
   * Check if the mouse is pressed down
   * @return boolean
   */
  isMouseDown() {
    return this._mouseDown;
  }
}
