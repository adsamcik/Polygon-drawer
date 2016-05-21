
function DrawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
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
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
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
}

class Polygon {
  constructor(index) {
      this.index = index;
      this.points = [];
      
  }
  
  AddPoint(point) {
      this.points.push(point);
  }
  
  AddPoint(x,y) {
      this.points.push({"x":x,"y":y});
  }
  
  Draw(ctx, scale, offset) {
      
  }
}