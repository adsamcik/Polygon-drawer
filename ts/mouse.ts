class Mouse {
    x: number;
    y: number;
    inRange: ScaledCoord[];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.inRange = [];
    }

    CheckNearby(points: ScaledCoord[]):boolean {
        var prevLength = this.inRange.length;
        this.inRange.length = 0;
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            //console.log(Math.pow(this.x - p.scaledX, 2) + Math.pow(this.y - p.scaledY, 2));
            //console.log(p);
            if (Math.pow(this.x - p.scaledX, 2) + Math.pow(this.y - p.scaledY, 2) < 400)
                this.inRange.push(p);
        }

        if(this.inRange.length > 0 || (this.inRange.length == 0 && prevLength != 0))
            return true;
        
        return false;
    }
}