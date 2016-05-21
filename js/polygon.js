
function DrawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined")
        stroke = true;
    if (typeof radius === "undefined")
        radius = 5;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke)
        ctx.stroke();
    if (fill)
        ctx.fill();
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get drawPos(scale, offset) {
        return {
            x: x * scale + offset.halfWidth,
            y: -y * scale + offset.halfHeight
        }
    }

    get type() {
        return 1;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Draw(ctx, scale, offset) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#757575';
        DrawRoundedRect(pos.draw.x - 30, pos.draw.y + 15, 60, 30, 7, true, false);
    }

    GetDraw(scale, offset) {
        return {
            x: x * scale + offset.halfWidth,
            y: -y * scale + offset.halfHeight
        }
    }

    get type() {
        return 0;
    }
}

class Polygon {
    constructor(index) {
        this.index = index;
        this.points = [];
    }

    AddPoint(point) {
        this.points.push(point);
    }

    AddPoint(x, y) {
        this.points.push({ "x": x, "y": y });
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

    get pointPosition(index) {
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