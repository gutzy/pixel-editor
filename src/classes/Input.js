import EventBus from "../utils/EventBus";
import {getEventXY} from "../utils/InputUtils";

export default class Input {

    constructor(canvasEl) {
        this._canvas = canvasEl;
        this._keyDown = {};
        this._mouseDown = false;
        this._lastKeyDown = null;
    }

    bindInputs() {
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onMouseUp(e) {
        const xy = getEventXY(e, this._canvas.el);
        this._mouseDown = false;
        EventBus.$emit('input-mouse-up', ...xy);
    }

    onMouseDown(e) {
        const xy = getEventXY(e, this._canvas.el);
        this._mouseDown = true;
        EventBus.$emit('input-mouse-down', ...xy);
    }

    onMouseMove(e) {
        const xy = getEventXY(e, this._canvas.el);
        EventBus.$emit('input-mouse-move', ...xy);
    }

    onKeyUp(e) {
        if (this._keyDown[e.key]) delete this._keyDown[e.key];
        EventBus.$emit('input-key-up', e.key, this);
        if (e.key === this._lastKeyDown) {
            this._lastKeyDown = null;
        }
    }

    onKeyDown(e) {
        if (e.key === this._lastKeyDown) return;
        this._keyDown[e.key] = true;
        let combo = this.onKeyCombination(e);
        if (!combo) EventBus.$emit('input-key-down', e.key, this);
        this._lastKeyDown = e.key;
    }

    onResize(e) {
        this._canvas.el.removeAttribute('width');
        this._canvas.el.removeAttribute('height');
        this._canvas.el.setAttribute('width', this._canvas.el.offsetWidth*1+'');
        this._canvas.el.setAttribute('height', this._canvas.el.offsetHeight*1+'');
        EventBus.$emit('redraw-canvas');
    }

    onKeyCombination(e) {
        const alt = this.isKeyDown("Alt"), shift = this.isKeyDown("Shift"), ctrl = this.isKeyDown("Control") || this.isKeyDown("Meta");

        if ((alt || shift || ctrl) && (e.key !== "Alt" && e.key !== "Shift" && e.key !== "Control" && e.key !== "Meta")) {
            let res = [e.key];
            if (alt) res.push('alt');
            if (shift) res.push('shift');
            if (ctrl) res.push('ctrl');
            EventBus.$emit('input-key-combination', res, this);
        }
        return false;

    }

    isKeyDown(key) {
        return (typeof this._keyDown[key] !== "undefined");
    }

    isMouseDown() {
        return this._mouseDown;
    }

}
