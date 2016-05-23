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
        ctx.arc(scaled.scaledX, scaled.scaledY, this.radius, 0, 2 * Math.PI, false);
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
    
    get radius() {
        return this._radius;
    }
    
    set radius(value:number) {
        changed = true;
        this._radius = value;
    }
}