export class ContentParser {
  public content(parentElement: Element) {
    const contentEl = Array.from(parentElement.children).find(
      (node) => node.nodeName === "content",
    );
    if (contentEl === undefined) {
      return undefined;
    }
    return (contentEl as Element).textContent || undefined;
  }
}
