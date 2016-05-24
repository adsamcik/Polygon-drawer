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
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }

    GenerateTableFieldsFor(row: HTMLTableRowElement) {
        var _this = this;

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) _this.radius = +t.value });
        inp.value = this.radius.toString();
        row.children[0].appendChild(inp);

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) _this.coord.x = +t.value });
        inp.value = this.coord.x.toString();
        row.children[1].appendChild(inp);

        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) _this.coord.y = +t.value });
        inp.value = this.coord.y.toString();
        row.children[2].appendChild(inp);
    }

    Collides(s: Shape): Coord[] {
        if (s instanceof Circle)
            return this.CollidesCircle(<Circle>s);
        return []
    }

    CollidesCircle(c: Circle): Coord[] {
        /*e = c - a[difference in x coordinates]
        f = d - b[difference in y coordinates]
        p = sqrt(e ^ 2 + f ^ 2)[distance between centers]
        k = (p ^ 2 + r ^ 2 - s ^ 2) / (2p)         [distance from center 1 to line
                                      joining points of intersection]
        x = a + ek / p + (f / p)sqrt(r ^ 2 - k ^ 2)
        y = b + fk / p - (e / p)sqrt(r ^ 2 - k ^ 2)
        OR
        x = a + ek / p - (f / p)sqrt(r ^ 2 - k ^ 2)
        y = b + fk / p + (e / p)sqrt(r ^ 2 - k ^ 2)*/

        var e = c.x - this.x;
        var f = c.y - this.y;
        var p = Math.sqrt(e * e + f * f);
        var k = (p * p + this.radius * this.radius - c.radius * c.radius) / (2 * p);

        return [
            new Coord(this.x + e * k / p + (f / p) * Math.sqrt(this.radius * this.radius - k * k), this.y + f * k / p - (e / p) * Math.sqrt(this.radius * this.radius - k * k)),
            new Coord(this.x + e * k / p - (f / p) * Math.sqrt(this.radius * this.radius - k * k), this.y + f * k / p + (e / p) * Math.sqrt(this.radius * this.radius - k * k))
        ]
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

    get bounds() {
        return new Bounds(this.coord.x - this.radius, this.coord.y - this.radius, this.coord.x + this.radius, this.coord.y + this.radius);
    }
}