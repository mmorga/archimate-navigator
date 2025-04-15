import kebabCase from "kebab-case";

export const cssPropertiesToString = (style: React.CSSProperties): string => {
  return Object.entries(style).reduce((accumulator, [key, val]) => {
    // transform the key from camelCase to kebab-case
    const cssKey = kebabCase(key);
    // remove ' in value
    let cssValue = val;
    if (typeof val === "string") {
      cssValue = (val as string).replace("'", "");
    }
    // build the result
    // you can break the line, add indent for it if you need
    return `${accumulator}${cssKey}:${cssValue};`;
  }, "");
};
