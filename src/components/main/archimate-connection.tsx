import * as React from "react";
import { JSX } from "react";
import { Connection, Path } from "../../archimate-model";
import { entityClickedFunc } from "../common";
import "./archimate-svg.css";

export default function ArchimateConnection({
  connection,
  onClicked,
  selected,
  autoLayout,
  fromX,
  fromY,
  toX,
  toY,
}: {
  connection: Connection;
  onClicked?: entityClickedFunc;
  selected: boolean;
  autoLayout?: boolean;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}) {
  const [path, setPath] = React.useState(
    () => new Path(connection, autoLayout),
  );
  const sourceEntity = connection.sourceViewNode();
  const targetEntity = connection.targetViewNode();

  React.useEffect(() => {
    setPath(new Path(connection, autoLayout));
  }, [connection, autoLayout, fromX, fromY, toX, toY]);

  // If the target is contained in the source, then don't render this connection
  if (
    sourceEntity === undefined ||
    targetEntity === undefined ||
    targetEntity.inside(sourceEntity)
  ) {
    return null;
  }

  const selectedHighlight = () => {
    if (!selected) {
      return undefined;
    }
    const attrs = pathAttrs();
    attrs.className = "archimate-selected-element-highlight";
    return <path {...attrs} />;
  };

  const groupAttrs = (): React.SVGProps<SVGGElement> => {
    const attrs: React.SVGProps<SVGGElement> = { id: connection.id };
    if (onClicked) {
      attrs.onClick = onClicked.bind(null, connection.entityInstance());
    }
    return attrs;
  };

  const lineText = (): JSX.Element | undefined => {
    const relationship = connection.entityInstance();
    const name = relationship ? relationship.name : undefined;
    if (name === undefined || name.length === 0) {
      return undefined;
    }
    const pt = path.point(text_position());
    return (
      <text
        className="archimate-relationship-name"
        x={pt.x}
        y={pt.y}
        textAnchor="middle"
        style={textStyle()}
      >
        {name}
      </text>
    );
  };

  const lineStyle = (): React.CSSProperties => {
    const style = connection.style;
    if (style === undefined) {
      return {};
    }
    const cssStyle: React.CSSProperties = {};
    if (style.lineColor) {
      cssStyle.stroke = style.lineColor.toRGBA();
    }
    if (style.lineWidth) {
      cssStyle.strokeWidth = style.lineWidth;
    }
    return cssStyle;
  };

  const textStyle = (): React.CSSProperties => {
    const style = connection.style;
    if (style === undefined) {
      return {};
    }
    const cssStyle: React.CSSProperties = {};
    if (style.fontColor) {
      cssStyle.fill = style.fontColor.toRGBA();
      cssStyle.color = style.fontColor.toRGBA();
    }
    if (style.font) {
      if (style.font.name) {
        cssStyle.fontFamily = style.font.name;
      }
      if (style.font.size) {
        cssStyle.fontSize = style.font.size;
      }
    }
    if (style.textAlignment) {
      cssStyle.textAlign = style.textAlignment;
    }
    return cssStyle;
  };

  const text_position = (): number => {
    const optTp: number | undefined = undefined;
    if (optTp === undefined) {
      return 0.5;
    }
    const tp = optTp as number;
    switch (tp) {
      case 0:
        return 0.1; // "10%"
      case 1:
        return 0.9; // "90%"
      default:
        return 0.5; // "50%"
    }
  };

  const pathAttrs = (): React.SVGProps<SVGPathElement> => {
    return {
      className: pathClass(),
      d: path.d(),
      id: getId(),
      style: lineStyle(),
    };
  };

  const getId = (): string => {
    const rel = connection.entityInstance();
    if (rel) {
      return rel.id;
    }
    return connection.id;
  };

  const pathClass = (): string => {
    const rel = connection.entityInstance();
    const type = rel ? rel.type : "default";
    return (
      ["archimate", cssClassify(type)].join("-") + " archimate-relationship"
    );
  };

  const cssClassify = (str: string): string => {
    return str
      .replace(/::/, "/")
      .replace("Relationship", "")
      .replace(/([A-Z]+)([A-Z][a-z])/, "$1-$2")
      .replace(/([a-z\d])([A-Z])/, "$1-$2")
      .toLowerCase();
  };

  return (
    <g {...groupAttrs()}>
      <path {...pathAttrs()}>
        <title>{connection.documentation}</title>
      </path>
      {selectedHighlight()}
      {lineText()}
    </g>
  );
}
