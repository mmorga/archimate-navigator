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

const KEBAB_REGEX = /\p{Lu}/gu;

const kebabCase = (str: string, keepLeadingDash = true) => {
  const result = str.replace(KEBAB_REGEX, (match) => `-${match.toLowerCase()}`);

  if (keepLeadingDash) {
    return result;
  }

  if (result.startsWith("-")) {
    return result.slice(1);
  }

  return result;
};
