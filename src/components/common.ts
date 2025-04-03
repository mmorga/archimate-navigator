import { IEntity } from "../archimate-model";
import { MouseEvent } from "react";

export type entityClickedFunc = (
  entity: IEntity | undefined,
  event?: MouseEvent<Element>,
) => void;
