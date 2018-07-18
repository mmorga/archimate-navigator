import { Point } from "../../archimate-model";

export default class Segment {
  public a: Point;
  public b: Point;

  constructor(a: Point, b: Point) {
    this.a = a;
    this.b = b;
  }

  public length(): number {
    return this.b.subtract(this.a);
  }

  public fromEnd(dist: number): Point {
    const length = this.b.subtract(this.a);
    return this.fromStart(length - dist);
  }

  public fromStart(dist: number): Point {
    const length = this.b.subtract(this.a);
    if (dist < 0) {
      return this.a;
    }
    if (length < dist) {
      return this.b;
    }
    return this.pointAtPercent(dist / length);
  }

  public pointAtPercent(pct: number): Point {
    return new Point(
      this.a.x + ((this.b.x - this.a.x) * pct),
      this.a.y + ((this.b.y - this.a.y) * pct)
    );
  }
}
