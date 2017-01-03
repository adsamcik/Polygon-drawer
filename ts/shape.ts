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

    Collides(s: Shape): Coord[] {
        return [];
    }
};