import { ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";

export type IEntityShapeProps = {
  viewNode: ViewNode;
  backgroundClass: string | undefined;
  shapeStyle?: CSSProperties | undefined;
};

export type EntityShapeComponent = React.FC<IEntityShapeProps>;

// const createEntityShapeComponent = (func: () => EntityShapeComponent): EntityShapeComponent => {
//   // const ApplicationComponentShape: EntityShapeComponent = ({ viewNode, backgroundClass, shapeStyle }: IEntityShapeProps) => {
//   return func();
// }

// export default createEntityShapeComponent;
