class Polygon extends Shape {
    points: Coord[];

    constructor(ctx: CanvasRenderingContext2D, coord: Coord) {
        super(ctx, coord);
        this.points = [coord];
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
            if (this.points[i] instanceof Vector)
                (<Vector>this.points[i]).base = i > 0 ? this.points[i - 1] : Coord.zero;

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

    GenerateTableFieldsFor(row: HTMLTableRowElement) {
        var _this = this;
        var _coord = this.GetPoint();
        var _index = this.points.length - 1;

        row.children[0].innerHTML = "<img src='icons/" + (_this instanceof Vector ? "vector" : "point") + ".svg'>";
        row.children[0].className = 'cellCollapsed';
        row.children[0].addEventListener('click', event => {
            changed = true;
            if (_coord instanceof Vector) {
                (<HTMLImageElement>event.target).src = 'icons/point.svg';
                var dir = (<Vector>_coord).dir;
                _coord = new Coord(dir.x, dir.y);
            }
            else {
                (<HTMLImageElement>event.target).src = 'icons/vector.svg';
                _coord = new Vector(_coord.x, _coord.y);
            }
            _this.points[_index] = _coord;
        });

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) _coord.x = +t.value; });
        inp.value = _coord.x.toString();
        row.children[1].appendChild(inp);

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) _coord.y = +t.value; });
        inp.value = _coord.y.toString();
        row.children[2].appendChild(inp);
    }

    Collides(s: Shape): Coord[] {
        if (s instanceof Circle)
            return Intersection.CirclePolygon(<Circle>s, this);
        else if (s instanceof Polygon)
            return Intersection.PolygonPolygon(this, <Polygon>s);
        return []
    }
}