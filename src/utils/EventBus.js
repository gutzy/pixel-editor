/**
 A very simple EventBus implementation.
 Basically, it's a global event bulletin-board that allows separate components to know what's going on,
 with very little deep coupling or spaghetti code.

 What's exported is a singleton instance
*/

const DEBUG = false;

class _EventBus {

    constructor() {
        this.bus = {};
    }

    $on(id, callback) {
        if (!this.bus[id]) this.bus[id] = [];
        this.bus[id].push(callback);
    }

    $off(id, callback) {
        if (!this.bus[id]) return;
        for (let i = this.bus[id].length-1; i >= 0; i--) {
            if (this.bus[id][i] === callback) {
                this.bus.splice(i, 1);
                return;
            }
        }
    }

    $emit(id, ...vars) {

        if (DEBUG) console.log('[emit]', id, ...vars);

        if (this.bus[id]) {
            for (let callback of this.bus[id]) callback(...vars);
        }
    }
}

const EventBus = new _EventBus();

export default EventBus;
