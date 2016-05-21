class Shape {
    row: HTMLTableRowElement;
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D, tableRow: HTMLTableRowElement) {
        this.ctx = ctx;
        this.row = tableRow;
    }
}

class Point extends Shape {
    coord: Coord;
    type: number;

    constructor(ctx: CanvasRenderingContext2D, tableRow: HTMLTableRowElement, x: number, y: number, type: number = -1) {
        super(ctx, tableRow);
        this.coord = new Coord(x, y);
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