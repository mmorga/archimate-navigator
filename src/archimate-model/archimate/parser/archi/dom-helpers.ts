export function getStringAttribute(node: Element, name: string) {
  const attr = node.attributes.getNamedItem(name);
  if (attr === null) {
    return undefined;
  }
  return (attr as Attr).value;
}

export function getNSStringAttribute(node: Element, name: string, ns?: string) {
  const attr = node.attributes.getNamedItemNS(ns || null, name);
  if (attr === null) {
    return undefined;
  }
  return (attr as Attr).value;
}

export function getIntAttribute(node: Element, name: string): number | undefined {
  const strVal = getStringAttribute(node, name);
  if (strVal === undefined) {
    return undefined;
  }

  return Number.parseInt(strVal as string, 10);
}
