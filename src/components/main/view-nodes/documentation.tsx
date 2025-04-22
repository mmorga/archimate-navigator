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

export default Documentation;
