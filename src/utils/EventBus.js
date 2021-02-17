/**
 A very simple EventBus implementation.
 Basically, it's a global event bulletin-board that allows separate components to know what's going on,
 with very little deep coupling or spaghetti code.

 What's exported is a singleton instance - we only need one Event Bus.
*/

const DEBUG = false;

class _EventBus {

    constructor() {
        this.bus = {};
    }

    /**
     * Subscribe to an event
     *
     * @param {string} id - event name
     * @param {function} callback - function to run when feed has a message
     */
    $on(id, callback) {
        if (!this.bus[id]) this.bus[id] = [];
        this.bus[id].push(callback);
    }

    /**
     * Unsubscribe from an event
     *
     * @param {string} id - event name
     * @param {function} callback - function to remove from subscription
     */
    $off(id, callback) {
        if (!this.bus[id]) return;
        for (let i = this.bus[id].length-1; i >= 0; i--) {
            if (this.bus[id][i] === callback) {
                this.bus.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Emit an event, run callbacks on all its subscribers

     * @param {string} id - event name
     * @param vars - additional event variables
     */
    $emit(id, ...vars) {

        if (DEBUG) console.log('[emit]', id, ...vars);

        if (this.bus[id]) {
            for (let callback of this.bus[id]) callback(...vars);
        }
    }
}

const EventBus = new _EventBus();

export default EventBus;
