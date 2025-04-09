const Title = ({ name }: { name: string | undefined }) => {
  if (name && name.length > 0) {
    return <title>{name}</title>;
  }
  return undefined;
};

export default Title;
