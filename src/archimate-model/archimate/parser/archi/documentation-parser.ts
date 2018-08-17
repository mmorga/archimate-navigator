export class DocumentationParser {
  public value(parentElement: Element, docElementName?: string) {
    const docEl = parentElement.querySelector(
      docElementName || "documentation"
    );
    if (docEl === null) {
      return undefined;
    }
    return (docEl as Element).textContent || undefined;
  }
}
