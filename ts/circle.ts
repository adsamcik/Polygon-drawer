class Circle extends Shape {
    center:Coord;
    radius:number
    constructor(ctx: CanvasRenderingContext2D, tableRow: HTMLTableRowElement, center:Coord, radius:number) {
        super(ctx, tableRow);
        this.center = center;
        this.radius = radius;
    }
    
    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: Offset) {
        ctx.beginPath();
        var scaled = this.center.ScaleCoord(scale, offset);
        ctx.arc(scaled.scaledX, scaled.scaledY, this.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
}