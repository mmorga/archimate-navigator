import * as React from "react";
import "./archimate-navigator.css";

interface IProps {
  id: string;
  initialX: number;
  onChange: (position: number) => void;
}

interface IState {
  clientX: number;
  color: string;
  dragCount: number;
  dragState: string;
}

export default class DragSizer extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      clientX: this.props.initialX,
      color: "gray",
      dragCount: 0,
      dragState: "",
    }
  }

  public render() {
    return (
      <div 
        className="archimate-sidebar-sizer" 
        draggable={true}
        style={
          {
            backgroundColor: this.state.color,
            cursor: "grab",
            flex: "0 0 3px", 
          }}
        onDrag={this.onDrag}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragExit={this.onDragExit}
      />
    );
  }

  private onDrag: React.DragEventHandler<HTMLDivElement> = (ev: React.DragEvent<HTMLDivElement>) => {
    this.setState({
      clientX: ev.clientX,
      dragCount: this.state.dragCount + 1,
      dragState: "Drag",
    });
    this.props.onChange(ev.clientX);
  }

  private onDragStart: React.DragEventHandler<HTMLDivElement> = (ev: React.DragEvent<HTMLDivElement>) => {
    // this.setState({
    //   clientX: ev.clientX,
    //   color: "blue",
    //   dragState: "Start",
    // });
    // ev.dataTransfer.setData('text/plain', ev.clientX.toString());
  }

  private onDragEnd: React.DragEventHandler<HTMLDivElement> = (ev) => {
    this.setState({
      clientX: ev.clientX,
      color: "gray",
      dragState: "End",
    });
    this.props.onChange(ev.clientX);
  }
    
  private onDragExit: React.DragEventHandler<HTMLDivElement> = (ev) => {
    this.setState({
      color: "gray",
      dragState: "Exit",
    });
    // this.props.onChange(this.props.initialX);
  }
}
