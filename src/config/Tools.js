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
        1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32
    ]
};
