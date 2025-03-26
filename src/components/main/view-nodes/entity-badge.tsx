import { Bounds } from "../../../archimate-model";

function EntityBadge({
  bounds,
  badge,
}: {
  bounds: Bounds | undefined;
  badge: string | undefined;
}) {
  if (badge === undefined || bounds === undefined) {
    return undefined;
  }
  return <use href={badge} {...bounds} />;
}

export default EntityBadge;
