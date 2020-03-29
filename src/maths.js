
// dogshit maths module as an example

export function rect(x,y,w,h) {
    return [x,y,w,h];
}

export function moveRect(r, x, y) {
    return [r.x + x, r.y + y,]
}