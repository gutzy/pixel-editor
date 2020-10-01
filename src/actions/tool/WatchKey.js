import {ToolAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class WatchKey extends ToolAction {
	do(tool, key, callback) {
		this._watchCallback = callback;
		this._watchKey = key;
		this._tool = tool;

		EventBus.$on('input-key-down', this._onKeyChanges.bind(this));
		EventBus.$on('input-key-up', this._onKeyChanges.bind(this));
		EventBus.$on('focus', this._onFocus.bind(this));
	}

	_onFocus(input) { this._onKeyChanges(null, input); }

	_onKeyChanges(k, input) {
		if (!this._tool.selected) return;
		if (!(this._watchKey instanceof Array)) this._watchKey = [this._watchKey];
		let ok = false;
		for (let key of this._watchKey)
		if (input.isKeyDown(key)) {
			ok = true;
			break;
		}

		this._watchCallback(ok);
	}
}