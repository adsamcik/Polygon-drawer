class Offset {
    v: number;
    h: number;

    constructor(horizontal: number, vertical: number) {
        this.v = vertical;
        this.h = horizontal;
    }
}

class Coord {
    protected cx: number;
    protected cy: number;

    constructor(x: number, y: number) {
        this.cx = x;
        this.cy = y;
    }

    ScaleCoord(scale: number, offset: Offset) {
        return new ScaledCoord(this.x, this.y, scale, offset);
    }

    static get zero() {
        return new Coord(0, 0);
    }
    
    get x() {
        return this.cx;
    }
    
    get y() {
        return this.cy;
    }
}

class Vector extends Coord {
    base: Coord;
    constructor(x: number, y: number, base: Coord) {
        super(x, y);
        this.base = base;
    }

    ScaleCoord(scale: number, offset: Offset) {
        return new ScaledVector(this.x, this.y, scale, offset);
    }

    get x() {
        return this.base.x + this.cx;
    }
    
    get y() {
        return this.base.y + this.cy;
    }
    
    get dir() {
        return new Coord(this.cx, this.cy);
    }
}


class ScaledCoord extends Coord {
    scaledX: number;
    scaledY: number;

    constructor(x: number, y: number, scale: number, offset: Offset) {
        super(x, y);
        this.scaledX = x * scale + offset.h;
        this.scaledY = y * scale + offset.v;
    }

    get drawCoords() {
        return new Coord(this.scaledX, this.scaledY);
    }

    get origCoords() {
        return new Coord(this.x, this.y);
    }
}

//todo
class ScaledVector extends ScaledCoord {
    constructor(x: number, y: number, scale: number, offset: Offset) {
        super(x, y, scale, offset);
    }

    get drawCoords() {
        return new Coord(this.scaledX, this.scaledY);
    }

    get origCoords() {
        return new Coord(this.x, this.y);
    }
}