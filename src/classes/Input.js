import EventBus from "../utils/EventBus";

export default class Input {

    constructor(canvasEl) {
        this._canvas = canvasEl;
        this._keyDown = {};
        this._mouseDown = false;
    }

    bindInputs() {
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onMouseUp(e) {
        const {pageX, pageY} = e;
        this._mouseDown = false;
        EventBus.$emit('input-mouse-up', pageX, pageY);
    }

    onMouseDown(e) {
        const {pageX, pageY} = e;
        this._mouseDown = true;
        EventBus.$emit('input-mouse-down', pageX, pageY);
    }

    onMouseMove(e) {
        const {pageX, pageY} = e;
        EventBus.$emit('input-mouse-move', pageX, pageY);
    }

    onKeyUp(e) {
        if (this._keyDown[e.key]) delete this._keyDown[e.key.charCodeAt(0)];
        EventBus.$emit('input-key-up', e.key);
    }

    onKeyDown(e) {
        this._keyDown[e.key.charCodeAt(0)] = true;
        EventBus.$emit('input-key-down', e.key);
    }

    isKeyDown(key) {
        return (typeof this._keyDown[key.charCodeAt(0)] !== "undefined");
    }

    isMouseDown() {
        return this._mouseDown;
    }

}
