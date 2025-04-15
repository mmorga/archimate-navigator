const Title = ({ name }: { name: string | undefined }) => {
  if (name && name.length > 0) {
    return <title>{name}</title>;
  }
  return undefined;
};

export const enterTitle = (
  name: string | undefined,
): SVGTitleElement | undefined => {
  if (name && name.length > 0) {
    const title = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title",
    );
    title.textContent = name;
    return title;
  }
};

export default Title;
