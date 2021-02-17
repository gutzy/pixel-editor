/**
 * Watch Key
 * @ActionType: Tool
 * @Description Allow a tool to watch whenever a key is held down or released
 *
 */
import {ToolAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class WatchKey extends ToolAction {
	/**
	 *
	 * @param tool
	 * @param {string|string[]} key - the key (or array of keys) to watch
	 * @param {function} callback - the action to run when the key state has changed
	 */
	do(tool, key, callback) {

		this._watchCallback = callback;
		this._watchKey = key;
		this._tool = tool;

		// bind key events from the input class to different methods
		EventBus.$on('input-key-down', this._onKeyChanges.bind(this));
		EventBus.$on('input-key-up', this._onKeyChanges.bind(this));
		EventBus.$on('focus', this._onFocus.bind(this));
	}

	// emit a null key on focus, to release old stuff
	_onFocus(input) { this._onKeyChanges(null, input); }

	_onKeyChanges(k, input) {
		if (!this._tool.selected) return;
		// if only one key, covert it to array
		if (typeof this._watchKey === 'string') this._watchKey = [this._watchKey];
		let ok = false;
		// check if any of the keys is down
		for (let key of this._watchKey) {
			if (input.isKeyDown(key)) {
				ok = true;
				break;
			}
		}

		// run watch callback
		this._watchCallback(ok);
	}
}
