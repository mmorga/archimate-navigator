import * as React from "react";
import { useState, useEffect } from "react";

interface IProps {
  header?: React.ReactNode;
  initiallyCollapsed?: boolean;
  children?: React.ReactNode;
}

const Panel: React.FC<IProps> = React.memo(({ header, initiallyCollapsed, children }) => {
  const [collapse, setCollapse] = useState<boolean>(initiallyCollapsed ?? false);

  useEffect(() => {
    if (initiallyCollapsed !== undefined) {
      setCollapse(initiallyCollapsed);
    }
  }, [initiallyCollapsed]);

  const handleCollapseExpand = () => {
    setCollapse(!collapse);
  };

  const renderHeader = () => {
    if (header) {
      const iconClsName = collapse
        ? "glyphicon glyphicon-collapse-up"
        : "glyphicon glyphicon-collapse-down";
      return (
        <div className="panel-heading">
          <h3 className="panel-title">
            {header}
            <button
              className="btn btn-primary btn-xs pull-right"
              type="button"
              aria-expanded={!collapse}
              onClick={handleCollapseExpand}
            >
              <span className={iconClsName} aria-hidden="true" />
            </button>
          </h3>
        </div>
      );
    }
    return null;
  };

  const panelClsName = collapse
    ? "panel-body collapse"
    : "panel-body collapse in";

  return (
    <div className="panel panel-default">
      {renderHeader()}
      <div id="archimate-view-props" className={panelClsName}>
        {children}
      </div>
    </div>
  );
});

export default Panel;
