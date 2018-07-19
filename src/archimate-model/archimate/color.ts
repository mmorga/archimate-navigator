// RGBColorType in the XSD
// RGB Color type.
// The r, g, b attributes range from 0 - 255.
// The a (alpha) transparency attribute is optional. 0 = full transparency, 100 = opaque.
export class Color {
  // Parses a CSS style color string into a color object
  // this.param str [String] CSS color string
  // this.return [Color]
  public static rgba(str: string | undefined): Color | undefined {
    if (!str) {
      return undefined;
    }
    const md = str.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?/);
    if (!md) {
      return undefined;
    }
    return new Color(
      Number.parseInt(md[1], 16),
      Number.parseInt(md[2], 16),
      Number.parseInt(md[3], 16),
      md[4] ? (Number.parseInt(md[4], 16) / 256.0) * 100.0 : 100
    );
  }

  // Results in a Color instance for the color black
  // this.return [Color]
  public static black() {
    return new Color(0, 0, 0, 100);
  }

  public r: number;
  public g: number;
  public b: number;
  public a?: number;

  constructor(r: number, g: number, b: number, a?: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public toString(): string {
    return `Color(r: ${this.r}, g: ${this.g}, b: ${this.b}, a: ${this.a})`;
  }

  public toRGBA(): string {
    const vals: number[] = [this.r, this.g, this.b];
    if (this.a) {
      vals.push(this.scaledAlpha());
    }
    const vs = vals
        .filter(v => v !== undefined)
        .map<number>(v => v as number)
        .map(v => v.toString(16))
        .map(s => s.trim())
        .map(s => s.length === 1 ? `0${s}` : s)
        .join('');

    return `#${vs}`;
    // return `#${vs[0]}${vs[1]}${vs[2]}${vs[3]}`;
        // if ((this.a === undefined) || (this.a === 100)) {
    //   return ``
    //   return format("#%02x%02x%02x", this.r, this.g, this.b);
    // } else {
    //   return format("#%02x%02x%02x%02x", this.r, this.g, this.b, this.scaledAlpha())
    // }
  }

  private scaledAlpha(max: number = 255) {
    if (!this.a) {
      return max;
    }
    return Math.round(max * (this.a / 100.0));
  }
}
