import { Bounds, zeroBounds } from "./bounds";
import { Connection } from "./connection";
import { Point } from "./point";
import { Segment } from "./segment";

const LINE_CURVE_RADIUS = 5;

export class Path {
  public connection: Connection;
  public points: Point[];
  public segments: Segment[];
  public sourceBounds: Bounds;
  public targetBounds: Bounds;
  private dCmds?: any[];
  private pathLength?: number;

  constructor(connection: Connection) {
    this.connection = connection;
    this.sourceBounds = this.connection.sourceBounds() || zeroBounds();
    this.targetBounds = this.connection.targetBounds() || zeroBounds();
    this.points = this.calcPoints();
    this.segments = this.calcSegments();
  }

  // New implementation of SVG d method for a set of points
  // making smooth curves at each bendpoint
  //
  // Given three points: a, b, c
  // The result should be:
  // (a is already part of the path -> first point is a move_to command)
  // line_to(segment(a-b) - curve_radius (from end))
  // q_curve(b, segment(b-c) - curve_radius (from start))
  //
  // For cases with more bendpoints (with values d, e, ...)
  // repeat the above section with c as the new a value (so then [c, d, e], [d, e, f], etc.)
  // [move_to(points.first)]
  // .concat(
  //   points
  //     .each_cons(3)
  //     .flat_map { |a, b, c| curve_segment(a, b, c) }
  // )
  // .concat([line_to(points.last)])
  // .join(" ")
  // So given a set of points [a, b] -> moveto a, lineto b
  // and [a, b, c] -> moveto a, curvesegment a, b, c, lineto c
  // and [a, b, c, d] -> moveto a, curvesegment a, b, c, curvesegment b, c, d, lineto d
  public d(): string {
    if (this.dCmds) {
      return this.dCmds.join(" ");
    }
    const dCmds: string[] = ([] as string[]).concat(      
      this.move_to(this.points[0]), // Starting point (Source)
      ...this.eachCons(this.points, 3).map(pts => this.curve_segment(pts[0], pts[1], pts[2])),
      this.line_to(this.points[this.points.length - 1]) // Ending point (Target)
    );
    this.dCmds = dCmds;

    return (dCmds.join(" "));
  }

  // this.param fraction Float 0.0-1.0
  // this.return Point at the given percent along line between start and end
  public point(fraction: number): Point {
    let lengthFromStart = this.length() * fraction;
    const pt = this.segments.reduce((acc: Point | undefined, segment: Segment) => {
      if ((acc === undefined) && (segment.length() >= lengthFromStart)) {
        return segment.fromStart(lengthFromStart);
      }
      lengthFromStart -= segment.length()
      return acc;
    }, undefined);
    return pt ? (pt as Point) : new Point(0.0, 0.0);
  }

  // this.return Point mid-point on Path
  public midpoint(): Point {
    return this.point(0.5);
  }
    
  // Takes the bounds of two objects and returns the optimal points
  // between from the edge of `a` to the edge of `b`
  // if left/right range of both overlap, use centerpoint of overlap range as x val
  // if top/bottom range of both overlap, use centerpoint of overlap range as y val
  // this.param a [Bounds]
  // this.param b [Bounds]
  private boundsToPoints(a: Bounds, b: Bounds): Point[] {
    const axRange = a.xRange();
    const bxRange = b.xRange();
    const overlapXCenter = axRange.overlapMidpoint(bxRange);

    let ax: number;
    let bx: number;
    if (overlapXCenter) {
      ax = bx = overlapXCenter;
    } else if (b.rightOf(a)) {
      ax = a.right;
      bx = b.left;
    } else {
      ax = a.left;
      bx = b.right;
    }

    const ayRange = a.yRange();
    const byRange = b.yRange();

    const overlapYCenter = ayRange.overlapMidpoint(byRange);

    let ay: number;
    let by: number;
    if (overlapYCenter) {
      ay = by = overlapYCenter;
    } else if (b.above(a)) {
      ay = a.top;
      by = b.bottom;
    } else {
      ay = a.bottom;
      by = b.top;
    }

    return [new Point(ax, ay), new Point(bx, by)];
  }

  private normalizedBendPoints(): Bounds[] {
    return (
      this.connection
        .bendpoints
        // TODO: Remove bendpoints that are inside of the bounds of the source or target element
        // .filter(bendpoint => {
        //   return ![this.sourceBounds, this.targetBounds].some(bounds => bendpoint.inside(bounds));
        // })
        .map(bendpoint => Bounds.fromPoint(bendpoint))
    );
  }

  private calcSegments(): Segment[] {
    const segAryLen = this.points.length - 1;
    const segs = new Array(segAryLen);
    for (let idx = 0; idx < segs.length; ++idx) {
      segs[idx] = new Segment(this.points[idx], this.points[idx + 1]);
    }
    return segs;
  }

  private calcPoints(): Point[] {
    const boundsAry = new Array<Bounds>().concat(
      this.sourceBounds,
      this.normalizedBendPoints(),
      this.targetBounds,
    ).filter(b => b !== undefined);

    // const points = this.boundsToPoints(bounds[0], bounds[1]);
    let points: Point[] = [];
    let a = boundsAry.shift() as Bounds;
    while (boundsAry.length > 0) {
      const b = boundsAry.shift() as Bounds;
      points = points.concat(this.boundsToPoints(a, b))
      a = b;
    }
    // JS doesn't do objects justice!!!
    // This section just uses a Map to make sure the list of points is unique
    const ptHash = new Map<string, Point>();
    points.forEach(pt => ptHash.set(pt.toString(), pt));
    return Array.from(ptHash.values());
  }

  // Returns the lengths of each segment of the line
  private segmentLengths(): number[] {
    return this.segments.map(s => s.length());
  }

  // this.return Float length of this path
  private length(): number {
    if (this.pathLength) {
      return this.pathLength;
    }
    this.pathLength = this.segmentLengths().reduce((total, length) => total + length, 0);
    return this.pathLength;
  }

  private move_to(point: Point): string {
    return `M ${point}`;
  }

  private line_to(point: Point): string {
    return `L ${point}`;
  }

  private q_curve(cp: Point, pt: Point): string {
    return `Q ${cp} ${pt}`;
  }

  private curve_segment(a: Point, b: Point, c: Point): string[] {
    const pt1 = new Segment(a, b).fromEnd(LINE_CURVE_RADIUS);
    const pt2 = new Segment(b, c).fromStart(LINE_CURVE_RADIUS);
    return [
      this.line_to(pt1),
      this.q_curve(b, pt2)
    ]
  }

  private eachCons(ary: Point[], cons: number): Point[][] {
    const len = ary.length - cons + 1;
    if (len < 1) {
      return [];
    }
    const mappedAry = new Array(len);
    for (let i = 0; i < len; ++i) {
      mappedAry[i] = i;
    }
    return mappedAry.map(i => [ary[i], ary[i+1], ary[i+2]]);
  }
}
