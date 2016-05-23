class Shape {
    ctx: CanvasRenderingContext2D;
    coord: Coord;
    constructor(ctx: CanvasRenderingContext2D, coord: Coord) {
        this.ctx = ctx;
        this.coord = coord;
    }

    get bounds() {
        return new Bounds(0, 0, 0, 0);
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
    }

    GenerateTableFieldsFor(row: HTMLTableRowElement) {

    }
}

class Point extends Shape {
    constructor(ctx: CanvasRenderingContext2D, coord: Coord) {
        super(ctx, coord);
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

    GenerateTableFieldsFor(row: HTMLTableRowElement) {
        var _this = this;
        var inp = <HTMLInputElement>document.createElement("input");
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) _this.x = +t.value });
        inp.value = this.x.toString();
        row.children[1].appendChild(inp);

        var inp = <HTMLInputElement>document.createElement("input");
        inp.value = this.y.toString();
        inp.addEventListener("input", event => { var t = (<HTMLInputElement>event.target); if (IsValid(t)) _this.y = +t.value; });
        row.children[2].appendChild(inp);
    }
}