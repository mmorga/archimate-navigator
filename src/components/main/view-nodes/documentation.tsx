const Documentation = ({
  documentation,
}: {
  documentation: string | undefined;
}) => {
  if (documentation) {
    return <desc>{documentation}</desc>;
  }
  return undefined;
};

export const enterDocumentation = (
  g: SVGGElement,
  documentation: string | undefined,
): SVGDescElement | undefined => {
  if (documentation) {
    const desc = document.createElementNS("http://www.w3.org/2000/svg", "desc");
    desc.textContent = documentation;
    g.appendChild(desc);
    return desc;
  }
};

export default Documentation;
