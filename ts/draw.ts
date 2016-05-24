function DrawCoords(ctx:CanvasRenderingContext2D, coord:ScaledCoord) {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#757575';
    DrawRoundedRect(ctx, coord.drawCoords, 60, 30, 7, true, false);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';

    ctx.font = "500 11px Roboto";

    ctx.textAlign = 'left';
    ctx.fillText("x: " + coord.x, coord.scaledX, coord.scaledY + 27);
    ctx.fillText("y: " + -coord.y, coord.scaledX, coord.scaledY + 40);
};

function DrawRoundedRect(ctx: CanvasRenderingContext2D, p: Coord, width, height, radius, fill, stroke) {
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
};

function DrawCross(o:Offset, halfMaxSize:number) {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(o.h, o.v - halfMaxSize);
    ctx.lineTo(o.h, o.v + halfMaxSize);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(o.h - halfMaxSize, o.v);
    ctx.lineTo(o.h + halfMaxSize, o.v);
    ctx.stroke();
    ctx.closePath();
};
