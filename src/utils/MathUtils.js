export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export function roundToHalf(number) {
    return Math.round(number*2)/2
}