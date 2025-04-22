import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const ContractShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const margin = 8;
  return (
    <g className={backgroundClass}>
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
      <rect
        x={bounds.left}
        y={bounds.top + bounds.height - margin}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
    </g>
  );
};

export default ContractShape;
