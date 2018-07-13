export class Property {
  public key: string;
  public value?: string;

  constructor(key: string, value?: string) {
    this.key = key;
    this.value = value;
  }

  public toString() {
    return `Property<${this.key} = "${this.value}">`;
  }
}
