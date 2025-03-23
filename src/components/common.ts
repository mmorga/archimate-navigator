import { IEntity } from "../archimate-model";

export type entityClickedFunc = (
  entity: IEntity | undefined,
  event?: React.MouseEvent<Element>,
) => void;
