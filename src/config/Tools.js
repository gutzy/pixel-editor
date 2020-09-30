import Pencil from "../tools/Pencil";
import PaintBucket from "../tools/PaintBucket";
import Rectangle from "../tools/Rectangle";
import Eraser from "../tools/Eraser";
import EyeDropper from "../tools/Eyedropper";
import Pan from "../tools/Pan";
import Zoom from "../tools/Zoom";
import Select from "../tools/Select";

export default [
    Pencil,
    Eraser,
    Rectangle,
    PaintBucket,
    EyeDropper,
    Pan,
    Zoom,
    Select
];

export const ZoomConfig = {
    ZoomLevels : [
        0.1, 0.2, 0.25, 0.3333333, 0.5, 0.6666666, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32
    ]
};
