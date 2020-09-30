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
