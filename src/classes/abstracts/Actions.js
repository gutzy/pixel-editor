/**
 * Action Abstracts
 *
 * This is the base class for the different types of actions.
 * All actions get a do() method, however the sub-actions have the first parameter injected to them
 * depending on the action's context.
 *
 * For example, a CanvasAction's do() method will always receive as a first argument the canvas on which it ran,
 * meaning do(canvas, ...args) - while a FileAction will get the file on which it ran: do(file, ...args)
 *
 */
class AbstractAction {
    do() { throw new Error("Action do method not implemented") }
}

export class CanvasAction extends AbstractAction {}
export class DialogAction extends AbstractAction {}
export class AppAction extends AbstractAction {}
export class FileAction extends AbstractAction {}
export class InputAction extends AbstractAction {}
export class LayerAction extends AbstractAction {}
export class PaletteAction extends AbstractAction {}
export class ToolAction extends AbstractAction {}
