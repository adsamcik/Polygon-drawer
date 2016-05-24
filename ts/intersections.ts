class Intersection {
    static CircleCircle(c1: Circle, c2: Circle): Coord[] {
        var e = c2.x - c1.x;
        var f = c2.y - c1.y;
        var p = Math.sqrt(e * e + f * f);
        var k = (p * p + c1.radius * c1.radius - c2.radius * c2.radius) / (2 * p);

        return [
            new Coord(c1.x + e * k / p + (f / p) * Math.sqrt(c1.radius * c1.radius - k * k), c1.y + f * k / p - (e / p) * Math.sqrt(c1.radius * c1.radius - k * k)),
            new Coord(c1.x + e * k / p - (f / p) * Math.sqrt(c1.radius * c1.radius - k * k), c1.y + f * k / p + (e / p) * Math.sqrt(c1.radius * c1.radius - k * k))
        ];
    }

    static CirclePolygon(c: Circle, p: Polygon): Coord[] {
        var result: Coord[] = [];
        for (var i = 1; i < p.points.length; i++)
            result = result.concat(this.CircleLine(c, p.points[i - 1], p.points[i]));
        return result;
    }

    static PolygonPolygon(p1: Polygon, p2: Polygon): Coord[] {
        var result: Coord[] = [];
        for (var i = 1; i < p1.points.length; i++)
            for (var y = 1; y < p2.points.length; y++)
                result = result.concat(this.LineLine(p1.points[i - 1], p1.points[i], p2.points[y - 1], p2.points[y]));
        return result;
    }

    static CircleLine(circle: Circle, pointA: Coord, pointB: Coord): Coord[] {
        var baX = pointB.x - pointA.x;
        var baY = pointB.y - pointA.y;
        var caX = circle.center.x - pointA.x;
        var caY = circle.center.y - pointA.y;

        var a = baX * baX + baY * baY;
        var bBy2 = baX * caX + baY * caY;
        var c = caX * caX + caY * caY - circle.radius * circle.radius;

        var pBy2 = bBy2 / a;
        var q = c / a;

        var disc = pBy2 * pBy2 - q;
        if (disc < 0)
            return [];
        // if disc == 0 ... dealt with later
        var tmpSqrt = Math.sqrt(disc);
        var abScalingFactor1 = -pBy2 + tmpSqrt;
        var abScalingFactor2 = -pBy2 - tmpSqrt;

        var p1 = new Coord(pointA.x - baX * abScalingFactor1, pointA.y - baY * abScalingFactor1);
        var onLine1 = this.IsOnSegment(pointA, pointB, p1);
        if (disc == 0) { // abScalingFactor1 == abScalingFactor2
            if (onLine1)
                return [p1];
            else
                return [];
        }
        var p2 = new Coord(pointA.x - baX * abScalingFactor2, pointA.y - baY * abScalingFactor2);
        var onLine2 = this.IsOnSegment(pointA, pointB, p2);
        if (onLine1) {
            if (onLine2)
                return [p1, p2];
            else
                return [p1];
        }
        else if (onLine2)
            return [p2];
        else
            return [];

    }

    static LineLine(start1: Coord, end1: Coord, start2: Coord, end2: Coord): Coord[] {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2;
        denominator = ((end2.y - start2.y) * (end1.x - start1.x)) - ((end2.x - start2.x) * (end1.y - start1.y));
        if (denominator == 0) {
            return [];
        }
        a = start1.y - start2.y;
        b = start1.x - start2.x;
        numerator1 = ((end2.x - start2.x) * a) - ((end2.y - start2.y) * b);
        numerator2 = ((end1.x - start1.x) * a) - ((end1.y - start1.y) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        var result = new Coord(start1.x + (a * (end1.x - start1.x)), start1.y + (a * (end1.y - start1.y)));
        /*
                // it is worth noting that this should be the same as:
                x = start2.x + (b * (end2.x - start2.x));
                y = start2.x + (b * (end2.y - start2.y));
                */
        if (a > 0 && a < 1 && b > 0 && b < 1) {
            return [result];
        }
        return [];
    };


    private static IsOnSegment(a: Coord, b: Coord, c: Coord): boolean {
        // Compute the dot product of vectors
        var ab = a.Minus(b);
        var ac = a.Minus(c);
        var KAC = ab.Dot(ac);
        if (KAC < 0) return false;
        if (KAC == 0) return false;

        // Compute the square of the segment lenght
        var KAB = ab.Dot(ab);
        if (KAC > KAB) return false;
        if (KAC == KAB) return false;
        return true;
    }
}