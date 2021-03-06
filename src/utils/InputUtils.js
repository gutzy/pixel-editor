/**
 * Get normalized x/y coordinates for a mouse event
 * @param {MouseEvent} e
 * @param {HTMLCanvasElement} el
 * @return {number[]}
 */
export function getEventXY(e, el) {
    let x, y;

    if (e.pageX !== undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= el.offsetLeft;
    y -= el.offsetTop;

    return [x,y];
}

/**
 * Check if a combination is valid
 *
 * @param {[]} combo
 * @param {string} meta1
 * @param {string} meta2
 * @param {string|null} meta3
 * @param {string|null} key
 * @return {boolean}
 */
export function comboIs(combo, meta1, meta2, meta3 = null, key = null) {
    let metas = 3;
    if (key === null) {
        metas--;
        key = meta3;
    }
    if (meta3 === null) {
        metas--;
        key = meta2;
    }

    if (metas === 3) {
        return (combo[0].toLowerCase() === key && combo.indexOf(meta1) > -1 && combo.indexOf(meta2) > -1 && combo.indexOf(meta3) > -1)
    }
    else if (metas === 2) {
        return (combo[0].toLowerCase() === key && combo.indexOf(meta1) > -1 && combo.indexOf(meta2))
    }
    else {
        return (combo[0] === key && combo.indexOf(meta1) > -1)
    }
}
