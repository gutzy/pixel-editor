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
