class Polygon extends Shape {
    points: Coord[];

    constructor(ctx: CanvasRenderingContext2D, tableRow: HTMLTableRowElement) {
        super(ctx, tableRow);
        this.row = tableRow;
        this.points = [];
        this.ctx = ctx;
    }

    AddPoint(x: number, y: number, isVector: boolean) {
        this.points.push(isVector ? new Vector(x, y) : new Coord(x, y));
    }

    Draw(ctx, scale, offset) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        for (var i = 0; i < this.points.length; i++) {
            //console.log("from (" + array[i].x + ", " + array[i].y + ") to (" + array[i+1].x + ", " + array[i+1].y + ")");
            ctx.beginPath();
            var pos = this.points[i].ScaleCoord(scale, offset);
            ctx.moveTo(pos.scaledX, pos.scaledY);
            pos = this.points[i + 1].ScaleCoord(scale, offset);
            ctx.lineTo(pos.scaledX, pos.scaledY);
            ctx.stroke();
        }
    }

    GetPointPosition(index) {
        var item = this.points[index];
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
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
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