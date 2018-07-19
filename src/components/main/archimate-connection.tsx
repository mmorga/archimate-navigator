import * as React from "react";
import { Connection, Path, ViewNode } from "../../archimate-model";
import "./archimate-svg.css";

interface IProps {
  connection: Connection;
}

interface IState {
  path: Path;
  sourceEntity: ViewNode | Connection;
  targetEntity: ViewNode | Connection;
}

export default class ArchimateConnection extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      path: new Path(this.props.connection),
      sourceEntity: this.props.connection.sourceViewNode(),
      targetEntity: this.props.connection.targetViewNode()
    };
  }

  public render() {
    // If the target is contained in the source, then don't render this connection
    // return if connection.source.nodes.include?(connection.target)
    if (
      this.state.sourceEntity === undefined ||
      this.state.targetEntity === undefined ||
      this.state.targetEntity.inside(this.state.sourceEntity)
    ) {
      return null;
    }
    return (
      <React.Fragment>
        <path {...this.pathAttrs()}>
          <title>{this.props.connection.documentation}</title>
        </path>
        {this.lineText()}
      </React.Fragment>
    );
  }

  private lineText(): JSX.Element | undefined {
    const relationship = this.props.connection.element();
    const name = relationship ? relationship.name : undefined;
    if (name === undefined || name.length === 0) {
      return undefined;
    }
    const pt = this.state.path.point(this.text_position());
    return (
      <text
        className="archimate-relationship-name"
        x={pt.x}
        y={pt.y}
        textAnchor="middle"
        style={this.textStyle()}
      >
        {name}
      </text>
    );
  }

  private lineStyle(): React.CSSProperties {
    const style = this.props.connection.style;
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
  }

  private textStyle(): React.CSSProperties {
    const style = this.props.connection.style;
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
  }

  private text_position(): number {
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
  }

  private pathAttrs(): React.SVGProps<SVGPathElement> {
    return {
      className: this.path_class(),
      d: this.state.path.d(),
      id: this.id(),
      style: this.lineStyle()
    };
  }

  private id(): string {
    const rel = this.props.connection.element();
    if (rel) {
      return rel.id;
    }
    return this.props.connection.id;
  }

  // Look at the type (if any of the path and set the class appropriately)
  private path_class(): string {
    const rel = this.props.connection.element();
    const type = rel ? rel.type : "default";
    return (
      ["archimate", this.css_classify(type)].join("-") +
      " archimate-relationship"
    );
  }

  private css_classify(str: string): string {
    return str
      .replace(/::/, "/")
      .replace("Relationship", "")
      .replace(/([A-Z]+)([A-Z][a-z])/, "$1-$2")
      .replace(/([a-z\d])([A-Z])/, "$1-$2")
      .toLowerCase();
  }
}
