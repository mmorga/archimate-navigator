import { IBounds } from "./interfaces";

export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public equals(other: Point): boolean {
    return ((this.x === other.x) && (this.y === other.y))
  }

  public subtract(other: Point): number {
    return Math.sqrt(
      ((other.x - this.x)**2) +
      ((other.y - this.y)**2)
    );
  }

  public toString(): string {
    return [this.x, this.y].map(v => v.toString()).join(" ");
  }

  // Returns true if this location is inside the bounds argument
  // @param bounds [Bounds]
  public inside(bounds: IBounds): boolean {
    if (bounds === undefined) {
      return false;
    }
    return bounds.xRange().cover(this.x) &&
      bounds.yRange().cover(this.y);
  }
}
