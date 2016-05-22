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
}

/*function DrawIntersection(ctx, iLine, array, enableMouseInteraction) {
    var intersections = [];
    //Go through every item in array and check if it intersects with mouse line
    for (var i = 0; i < array.length - 1; i++) {
        var line = {
            start: array[i],
            end: array[i + 1]
        }

        var result = CheckLineIntersection(iLine, line);

        if (result.intersects)
            intersections.push(result);
    }
    //draws base line for the intersections
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.setLineDash([10]);

    var startScaled = ScaleToDraw(iLine.start);
    ctx.moveTo(startScaled.x, startScaled.y);

    var endScaled = ScaleToDraw(iLine.end);
    ctx.lineTo(endScaled.x, endScaled.y);

    ctx.closePath();
    ctx.strokeStyle = '#9297B5';
    ctx.stroke();
    ctx.setLineDash([0]);
    //draw every intersection point found
    for (var i = 0; i < intersections.length; i++) {
        if (enableMouseInteraction)
            var mouseInRange = IsMouseInRange(intersections[i], 10);

        var radius = mouseInRange ? 10 : 5;
        //if (mouseInRange) DrawCoords(intersections[i]);
        ctx.beginPath();
        ctx.arc(intersections[i].draw.x, intersections[i].draw.y, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = '#3F51B5';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}*/

function DrawCoords(ctx:CanvasRenderingContext2D, coord:ScaledCoord) {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#757575';
    DrawRoundedRect(ctx, coord, 60, 30, 7, true, false);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';

    ctx.font = "500 11px Roboto";

    ctx.textAlign = 'center';
    ctx.fillText("x: " + coord.x, coord.scaledX, coord.scaledY + 27);
    ctx.fillText("y: " + coord.y, coord.scaledX, coord.scaledY + 40);
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
