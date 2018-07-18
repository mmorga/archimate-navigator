import { IBounds, IPoint } from "./interfaces";
import { Point } from "./point";
import Range from "./range";

export class Bounds implements IBounds {
  public static fromPoint(location: IPoint): Bounds {
    return new Bounds(location.x, location.y, 0, 0);
  }

  public static zeroBounds(): Bounds {
    return new Bounds(0, 0, 0, 0);
  }

  public x?: number;
  public y?: number;
  public width: number;
  public height: number;

  constructor(x: number | undefined, y: number | undefined, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public offset(os: Bounds): Bounds {
    return new Bounds(this.left() + os.left(), this.top() + os.top(), this.width, this.height);
  }

  public toString() {
    return `Bounds(x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height})`;
  }

  public xRange() {
    return new Range(this.left(), this.right());
  }

  public yRange() {
    return new Range(this.top(), this.bottom())
  }

  public top() {
    return this.y || 0;
  }

  public bottom() {
    return this.top() + this.height;
  }

  public right() {
    return this.left() + this.width;
  }

  public left() {
    return this.x || 0;
  }

  public center(): Point {
    // return new Bounds(this.left() + this.width / 2.0, this.top() + this.height / 2.0, 0, 0);
    return new Point(this.left() + this.width / 2.0, this.top() + this.height / 2.0);
  }

  public above(other: Bounds) {
    return this.bottom() < other.top();
  }

  public below(other: Bounds) {
    return this.top() > other.bottom();
  }

  public rightOf(other: Bounds) {
    return this.left() > other.right();
  }

  public leftOf(other: Bounds) {
    return this.right() < other.left();
  }

  public reducedBy(val: number) {
    return new Bounds(this.left() + val, this.top() + val, this.width - val * 2, this.height - val * 2);
  }

  // Tests if this bounds is inside the argument Bounds
  public inside(other: Bounds) {
    return this.left() > other.left() &&
      this.right() < other.right() &&
      this.top() > other.top() &&
      this.bottom() < other.bottom();
  }

  public empty() {
    return (this.width === 0.0) && (this.height === 0.0);
  }
}

export function zeroBounds() {
  return new Bounds(0, 0, 0, 0);
}
