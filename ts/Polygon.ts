/// <reference path="Bounds.ts"/>

function DrawRoundedRect(ctx: CanvasRenderingContext2D, p: Point, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined")
        stroke = true;
    if (typeof radius === "undefined")
        radius = 5;
    ctx.beginPath();
    ctx.moveTo(p.x + radius, p.y);
    ctx.lineTo(p.x + width - radius, p.y);
    ctx.quadraticCurveTo(p.x + width, p.y, p.x + width, p.y + radius);
    ctx.lineTo(p.x + width, p.y + height - radius);
    ctx.quadraticCurveTo(p.x + width, p.y + height, p.x + width - radius, p.y + height);
    ctx.lineTo(p.x + radius, p.y + height);
    ctx.quadraticCurveTo(p.x, p.y + height, p.x, p.y + height - radius);
    ctx.lineTo(p.x, p.y + radius);
    ctx.quadraticCurveTo(p.x, p.y, p.x + radius, p.y);
    ctx.closePath();
    if (stroke)
        ctx.stroke();
    if (fill)
        ctx.fill();
}

class Point {
    x: number;
    y: number;
    type: number;
    constructor(x: number, y: number, type: number = -1) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    Draw(ctx: CanvasRenderingContext2D, scale: number, offset: number) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#757575';
        var drawPos = this.GetDrawPos(scale, offset);
        DrawRoundedRect(ctx, drawPos, 60, 30, 7, true, false);
    }

    GetDrawPos(scale: number, offset) {
        return new Point(this.x * scale + offset.halfWidth, -this.y * scale + offset.halfHeight);
    }
}

class Polygon {
    index: number;
    points: Point[];
    constructor(index) {
        this.index = index;
        this.points = [];
    }

    AddPoint(x: number, y: number, type: number) {
        this.points.push(new Point(x, y, type));
    }

    Draw(ctx, scale, offset) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        for (var i = 0; i < points.length; i++) {
            //console.log("from (" + array[i].x + ", " + array[i].y + ") to (" + array[i+1].x + ", " + array[i+1].y + ")");
            ctx.beginPath();
            var pos = points[i].GetDrawX(scale, offset);
            ctx.moveTo(pos.x, pos.y);
            pos = array[i + 1].GetDrawX(scale, offset);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    }

    GetPointPosition(index) {
        var item = points[index];
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
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
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