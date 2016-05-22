class Polygon extends Shape {
    points: Coord[];

    constructor(ctx: CanvasRenderingContext2D, tableRow: HTMLTableRowElement) {
        super(ctx, tableRow);
        this.row = tableRow;
        this.points = [];
        this.ctx = ctx;
    }

    AddPoint(x: number, y: number, isVector: boolean) {
        //Add point/vector if vector get previous coord, if no coord is found, insert zero
        this.points.push(
            isVector ?
                new Vector(
                    x,
                    y,
                    this.points.length > 0 ?
                        this.points[this.points.length - 1] :
                        Coord.zero
                ) :
                new Coord(x, y)
        );
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        for (var i = 0; i < this.points.length - 1; i++) {
            //console.log("from (" + array[i].x + ", " + array[i].y + ") to (" + array[i+1].x + ", " + array[i+1].y + ")");
            ctx.beginPath();
            var pos = this.points[i].ScaleCoord(scale, offset);
            ctx.moveTo(pos.scaledX, pos.scaledY);
            pos = this.points[i + 1].ScaleCoord(scale, offset);
            ctx.lineTo(pos.scaledX, pos.scaledY);
            ctx.stroke();
        }
    }

    GetPoint(index: number) {
        return this.points[index];
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