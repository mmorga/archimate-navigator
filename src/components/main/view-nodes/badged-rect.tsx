import { JSX } from "react";
import { Bounds, ViewNode } from "../../../archimate-model";

// export default class BadgedRectViewNode extends DefaultViewNode {
//   public static path(
//     bounds: Bounds,
//     backgroundClass: string | undefined,
//     style: React.CSSProperties | undefined
//   ): JSX.Element {
//     return (
//       <rect
//         x={bounds.x}
//         y={bounds.y}
//         width={bounds.width}
//         height={bounds.height}
//         className={backgroundClass}
//         style={style}
//       />
//     );
//   }

//   constructor(props: IViewNodeProps) {
//     super(props);
//     this.state = {
//       ...this.state,
//       badgeBounds: this.badgeBounds()
//     };
//   }

//   protected badgeBounds(): Bounds | undefined {
//     return new Bounds(
//       this.props.viewNode.absolutePosition().right - 25,
//       this.props.viewNode.absolutePosition().top + 5,
//       20,
//       20
//     );
//   }

//   protected entityShape() {
//     const bounds = this.props.viewNode.absolutePosition();
//     return (
//       <rect
//         x={bounds.x}
//         y={bounds.y}
//         width={bounds.width}
//         height={bounds.height}
//         className={this.state.backgroundClass}
//         style={this.shapeStyle()}
//       />
//     );
//   }
// }

export function path(
    bounds: Bounds,
    backgroundClass: string | undefined,
    style: React.CSSProperties | undefined
  ): JSX.Element {
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={style}
    />
  );
}

export function badgeBounds(viewNode: ViewNode): Bounds | undefined {
  return new Bounds(
    viewNode.absolutePosition().right - 25,
    viewNode.absolutePosition().top + 5,
    20,
    20
  );
}

export function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}
