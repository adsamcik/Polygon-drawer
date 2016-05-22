class Polygon extends Shape {
    points: Coord[];

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
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

    AddPointC(coord: Coord) {
        //Add point/vector if vector get previous coord, if no coord is found, insert zero
        this.points.push(coord);
    }


    RemovePoint(index: number) {
        this.points.splice(index, 1);
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (this.points.length > 0 && this.points[0]) {
            var pos = this.points[0].ScaleCoord(scale, offset);
            ctx.moveTo(pos.scaledX, pos.scaledY);
        }
        for (var i = 0; i < this.points.length; i++) {
            //console.log("from (" + this.points[i].x + ", " + this.points[i].y + ") to (" + this.points[i+1].x + ", " + this.points[i+1].y + ")");
            pos = this.points[i].ScaleCoord(scale, offset);
            ctx.lineTo(pos.scaledX, pos.scaledY);
        }
        ctx.stroke();
    }

    GetPoint(index: number = -1) {
        if (index == -1)
            return this.points[this.points.length - 1];
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
        return new Bounds(miX, miY, maX, maY);
    }
}