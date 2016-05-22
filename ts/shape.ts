class Shape {
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    get bounds() {
        return new Bounds(0, 0, 0, 0);
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
    }
}

class Point extends Shape {
    coord: Coord;

    constructor(ctx: CanvasRenderingContext2D, coord: Coord) {
        super(ctx);
        this.coord = coord;
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
        ctx.beginPath();
        var scaled = this.coord.ScaleCoord(scale, offset);
        ctx.arc(scaled.scaledX, scaled.scaledY, maxSize / 100, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#003300';
        ctx.stroke();
        ctx.fill();
        //DrawRoundedRect(ctx, this.coord.ScaleCoord(scale, offset).drawCoords, 60, 30, 7, true, false);
    }

    get x() {
        return this.coord.x;
    }

    set x(val: number) {
        this.coord.x = val;
    }

    get y() {
        return this.coord.y;
    }

    set y(val: number) {
        this.coord.y = val;
    }

    get bounds() {
        return new Bounds(this.x, this.y, this.x, this.y);
    }
}