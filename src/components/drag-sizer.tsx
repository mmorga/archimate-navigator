import * as React from "react";
import { useState } from "react";
import "./archimate-navigator.css";

interface IProps {
  initialX: number;
  onChange: (position: number) => void;
}

const DragSizer: React.FC<IProps> = React.memo(({ initialX, onChange }) => {
  const [state, setState] = useState({
    clientX: initialX,
    color: "gray",
    dragCount: 0,
    dragState: "",
  });

  const onDrag: React.DragEventHandler<HTMLDivElement> = (ev) => {
    setState((prev) => ({
      ...prev,
      clientX: ev.clientX,
      dragCount: prev.dragCount + 1,
      dragState: "Drag",
    }));
    onChange(ev.clientX);
  };

  const onDragStart: React.DragEventHandler<HTMLDivElement> = () => {
    // Commented out as in original
    // setState(prev => ({
    //   ...prev,
    //   clientX: ev.clientX,
    //   color: "blue",
    //   dragState: "Start"
    // }));
    // ev.dataTransfer.setData('text/plain', ev.clientX.toString());
  };

  const onDragEnd: React.DragEventHandler<HTMLDivElement> = (ev) => {
    setState((prev) => ({
      ...prev,
      clientX: ev.clientX,
      color: "gray",
      dragState: "End",
    }));
    onChange(ev.clientX);
  };

  const onDragExit: React.DragEventHandler<HTMLDivElement> = () => {
    setState((prev) => ({
      ...prev,
      color: "gray",
      dragState: "Exit",
    }));
    // Commented out as in original
    // onChange(initialX);
  };

  return (
    <div
      className="archimate-sidebar-sizer"
      draggable={true}
      style={{
        backgroundColor: state.color,
        cursor: "grab",
        flex: "0 0 3px",
      }}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragExit={onDragExit}
    />
  );
});

export default DragSizer;
