/// <reference path="shape.ts"/>
class Circle extends Shape {
    _radius: number
    constructor(ctx: CanvasRenderingContext2D, center: Coord, radius: number) {
        super(ctx, center);
        this.radius = radius;
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
        ctx.beginPath();
        var scaled = this.coord.ScaleCoord(scale, offset);
        ctx.arc(scaled.scaledX, scaled.scaledY, this.radius * scale, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }

    GenerateTableFieldsFor(row: HTMLTableRowElement) {
        var __this = this;

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) __this.radius = +t.value });
        inp.value = this.radius.toString();
        row.children[0].appendChild(inp);

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) __this.coord.x = +t.value });
        inp.value = this.coord.x.toString();
        row.children[1].appendChild(inp);

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) __this.coord.y = +t.value });
        inp.value = this.coord.y.toString();
        row.children[2].appendChild(inp);
    }

    Collides(s: Shape): Coord[] {
        if (s instanceof Circle)
            return Intersection.CircleCircle(this, <Circle>s);
        else if (s instanceof Polygon)
            return Intersection.CirclePolygon(this, <Polygon>s);
        return []
    }

    get radius() {
        return this._radius;
    }

    set radius(value: number) {
        changed = true;
        this._radius = value;
    }

    get x() {
        return this.coord.x;
    }

    get y() {
        return this.coord.y;
    }

    get center() {
        return this.coord;
    }

    get bounds() {
        return new Bounds(this.coord.x - this.radius, this.coord.y - this.radius, this.coord.x + this.radius, this.coord.y + this.radius);
    }
}