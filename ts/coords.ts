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
        return new ScaledCoord(this.x, -this.y, scale, offset);
    }

    Distance(c: Coord) {
        return Math.pow(c.x - this.x, 2) + Math.pow(this.y - c.y, 2);
    }

    Minus(c: Coord) {
        return new Vector(this.x - c.x, this.y - c.y);
    }

    static get zero() {
        return new Coord(0, 0);
    }

    get x() {
        return this.cx;
    }

    set x(val: number) {
        changed = true;
        this.cx = val;
    }

    get y() {
        return this.cy;
    }

    set y(val: number) {
        changed = true;
        this.cy = val;
    }

    get sqrlenght() {
        return this.x * this.x + this.y * this.y;
    }

    get lenght() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class Vector extends Coord {
    base: Coord;
    constructor(x: number, y: number, base: Coord = Coord.zero) {
        super(x, y);
        this.base = base;
    }

    ScaleCoord(scale: number, offset: Offset) {
        return new ScaledVector(this.x, -this.y, scale, offset);
    }

    Dot(v: Vector) {
        return this.x * v.x + this.y * v.y;
    }


    get x() {
        return this.base.x + this.cx;
    }

    set x(val: number) {
        changed = true;
        this.cx = val;
    }

    get y() {
        return this.base.y + this.cy;
    }

    set y(val: number) {
        changed = true;
        this.cy = val;
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