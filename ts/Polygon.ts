class Offset {
    v: number;
    h: number;

    constructor(horizontal: number, vertical: number) {
        this.v = vertical;
        this.h = horizontal;
    }
}

class Coord {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    ScaleCoord(scale: number, offset: Offset) {
        return new ScaledCoord(this.x, this.y, scale, offset);
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

class Point {
    coord: Coord;
    type: number;

    constructor(x: number, y: number, type: number = -1) {
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

class Polygon {
    row: HTMLTableRowElement;
    points: Point[];
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, tableRow: HTMLTableRowElement) {
        this.row = tableRow;
        this.points = [];
        this.ctx = ctx;
    }

    AddPoint(x: number, y: number, type: number) {
        this.points.push(new Point(x, y, type));
    }

    Draw(ctx, scale, offset) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        for (var i = 0; i < points.length; i++) {
            //console.log("from (" + array[i].x + ", " + array[i].y + ") to (" + array[i+1].x + ", " + array[i+1].y + ")");
            ctx.beginPath();
            var pos = points[i].GetDrawX(scale, offset);
            ctx.moveTo(pos.x, pos.y);
            pos = points[i + 1].GetDrawX(scale, offset);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    }

    GetPointPosition(index) {
        var item = points[index];
        switch (item.type) {
            //point
            case 0:

                break;
            //vector
            case 1:
                break;
        }
    }

    get bounds() {
        var miX = Number.MAX_VALUE, miY = Number.MAX_VALUE, maX = Number.MIN_VALUE, maY = Number.MIN_VALUE;
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.x < miX)
                miX = point.x;
            if (point.y < miY)
                miY = point.y;
            if (point.x > maX)
                maX = point.x;
            if (point.y > maY)
                maY = point.y;
        }
        return {
            miX: miX,
            miY: miY,
            maX: maX,
            maY: maY
        }
    }
}