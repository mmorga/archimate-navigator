import { IRange } from "./interfaces";

export default class Range implements IRange {
  public begin: number;
  public end: number;

  constructor(begin: number, end: number) {
    this.begin = begin;
    this.end = end;
  }

  public overlapMidpoint(r: Range): number | undefined {
    const beginMax = Math.max(this.begin, r.begin);
    const endMin = Math.min(this.end, r.end);
    if (beginMax > endMin) {
      return undefined;
    }
    return (beginMax + endMin) / 2.0;
  }

  public cover(n: number): boolean {
    return this.begin <= n && n <= this.end;
  }
}
