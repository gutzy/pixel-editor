/**
 * @Config Tools configuration.
 * This allows adding and removing tools from the editor, as well as setting some stuff that tools use as configuration,
 * for example the zoom levels.
 */
import Pencil from "../tools/Pencil";
import PaintBucket from "../tools/PaintBucket";
import Rectangle from "../tools/Rectangle";
import Eraser from "../tools/Eraser";
import EyeDropper from "../tools/Eyedropper";
import Pan from "../tools/Pan";
import Zoom from "../tools/Zoom";
import Select from "../tools/Select";
import MagicWand from "../tools/MagicWand";

export default [
    Pencil,
    Eraser,
    Rectangle,
    PaintBucket,
    EyeDropper,
    Pan,
    Zoom,
    Select,
    MagicWand,
];

export const ZoomConfig = {
    ZoomLevels : [
        1, 2, 4, 8, 16, 32, 64
    ]
};
