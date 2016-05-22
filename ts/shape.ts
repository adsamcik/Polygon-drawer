class Shape {
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
}

class Point extends Shape {
    coord: Coord;
    type: number;

    constructor(ctx: CanvasRenderingContext2D, coord:Coord, type: number = -1) {
        super(ctx);
        this.coord = coord;
        this.type = type;
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#757575';
        DrawRoundedRect(ctx, this.coord.ScaleCoord(scale, offset).drawCoords, 60, 30, 7, true, false);
    }

    get x() {
        return this.coord.x;
    }

    get y() {
        return this.coord.y;
    }
}