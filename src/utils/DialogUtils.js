/** Makes a menu visible or not depending on the visible variable
 * 
 * @param {*} menu The menu to toggle
 * @param {*} visible Tells if the menu is currently visible or not
 * @returns The new state of the menu (which is always the opposite of visible)
 */
export function toggleMenu(menu, visible) {
    if (visible) {
        menu.style.display = "none";
    }
    else {
        menu.style.display = "block";
    }

    return !visible;
}