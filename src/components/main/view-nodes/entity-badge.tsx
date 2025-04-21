import { Bounds, ViewNode } from "../../../archimate-model";

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

export const enterEntityBadge = (
  g: SVGGElement,
  bounds: Bounds | undefined,
  badge: string | undefined,
): SVGUseElement | undefined => {
  if (badge === undefined || bounds === undefined) {
    return undefined;
  }
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", badge);
  use.setAttribute("x", (bounds.x || 0).toString());
  use.setAttribute("y", (bounds.y || 0).toString());
  use.setAttribute("width", bounds.width.toString());
  use.setAttribute("height", bounds.height.toString());
  g.appendChild(use);
  return use;
};

export const updateEntityBadge = (
  selection: d3.Selection<SVGUseElement, ViewNode, SVGGElement, undefined>,
) => {
  selection
    .attr("x", (d) => {
      const b = d.badgeBounds(d);
      return b ? b.x : 0;
    })
    .attr("y", (d) => {
      const b = d.badgeBounds(d);
      return b ? b.y : 0;
    });
  return this;
};

export default EntityBadge;
