export class Font {
  // Archi font strings look like this:
  //  "1|Arial            |14.0|0|WINDOWS|1|0  |0|0|0|0  |0 |0|0|1|0|0|0|0 |Arial"
  //  "1|Arial            |8.0 |0|WINDOWS|1|0  |0|0|0|0  |0 |0|0|1|0|0|0|0 |Arial"
  //  "1|Segoe UI Semibold|12.0|2|WINDOWS|1|-16|0|0|0|600|-1|0|0|0|3|2|1|34|Segoe UI Semibold"
  //  "1|Times New Roman  |12.0|3|WINDOWS|1|-16|0|0|0|700|-1|0|0|0|3|2|1|18|Times New Roman"
  // this.todo move this to the archi file reader
  public static archiFontString(str: string | undefined): Font | undefined {
    if (!str) {
      return undefined;
    }
    const fontParts = str.split("|")
    return new Font(
      fontParts[1],
      Number.parseFloat(fontParts[2]),
      Number.parseInt(fontParts[3]),
      str
    );
  }

  public name?: string;
  public size?: number;
  // this.todo make this an enum
  public style?: number;
  public fontData?: string;

  constructor(name?: string, size?: number, style?: number, fontData?: string) {
    if (name) { this.name = name }
    if (size) { this.size = size }
    if (style) { this.style = style }
    if (fontData) { this.fontData = fontData }
  }

  public toString(): string {
    return `Font(name: ${this.name}, size: ${this.size}, style: ${this.style})`
  }

  public toArchiFont(): string {
    return (
      this.fontData ||
      [
        1, this.name, this.size, this.style, "WINDOWS", 1, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0, this.name
      ].map(v => `${v}`).join("|")
    );
  }

  // this.todo this isn't standard
  // Move to file format
  public styleString() {
    switch(this.style) {
    case 1:
      return "italic";
    case 2:
      return "bold";
    case 3:
      return "bold|italic";
    default:
      return "";
    }
  }
}
