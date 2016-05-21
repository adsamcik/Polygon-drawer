
class Bounds {
    miX:number;
    miY:number;
    maX:number;
    maY:number;
    
    constructor(minX:number, minY:number, maxX:number, maxY:number) {
        this.miX = minX;
        this.miY = minY;
        this.maX = maxX;
        this.maY = maxY;
    }
    
    UpdateB(bounds:Bounds) {
        this.Update(bounds.miX, bounds.miY, bounds.maX, bounds.maY);
    }
    
    Update(minX:number, minY:number, maxX:number, maxY:number) {
        if(this.miX > minX)
            this.miX = minX;
        if(this.miY > minY)
            this.miY = minY;
            
        if(this.maX < maxX)
            this.maX = maxX;
        if(this.maY < maxY)
            this.maY = maxY;
    }
    
    //returns special bounds where min value is max and max value is min
    static GetEmpty():Bounds {
        return new Bounds(Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
    }
}