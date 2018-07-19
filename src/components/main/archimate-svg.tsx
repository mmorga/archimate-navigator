import createPanZoom from "panzoom";
import * as React from "react";
import { Diagram } from "../../archimate-model";
import "./archimate-svg.css";

export interface IViewBox {
  x: number, 
  y: number, 
  width: number, 
  height: number,
}

interface IProps {
  diagram: Diagram;
}

interface IState {
  viewBox?: IViewBox;
}

export default class ArchimateSvg extends React.PureComponent<IProps, IState> {
  private svgTopGroup: React.RefObject<SVGGElement>;
  private panzoom: object | undefined = undefined;

  constructor(props: IProps) {
    super(props);
    this.state = {
      viewBox: this.props.diagram.calculateMaxExtents(),
    }
    this.svgLoaded = this.svgLoaded.bind(this);
    this.svgResized = this.svgResized.bind(this);
    this.svgTopGroup = React.createRef();
  }

  public render() {
    const style2: React.CSSProperties = {fill:"none",stroke:"inherit",strokeWidth:1,strokeLinecap:"butt",strokeLinejoin:"miter"};
    const style3: React.CSSProperties = {fill:"none",stroke:"inherit",strokeWidth:1,strokeLinecap:"round",strokeLinejoin:"round"};
    const style4: React.CSSProperties = {fill:"none",stroke:"inherent",strokeWidth:0.7};
    const vb: SVGRect = this.state.viewBox || {x: 0, y: 0, width: 800, height: 800};
    return (
      <svg 
        className="archimate-svg"
        version="1.1"
        viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
        onLoad={this.svgLoaded}
        zoomAndPan="magnify"
        // onresize={this.svgResized}
        >
        <title>{ this.props.diagram.name }</title>
        <desc>{ this.props.diagram.documentation }</desc>
        <defs>
          <symbol id="archimate-material-badge" className="archimate-badge" viewBox="0 0 20 20">
            <path style={{fill:"none",stroke:"inherit",strokeWidth:1,strokeLinejoin:"miter"}} d="M 15.443383,8.5890552 5.0182941,17.265414 -7.7081977,12.575201 -10.0096,-0.7913701 0.41548896,-9.4677289 13.141981,-4.7775163 Z" transform="matrix(0.59818877,-0.22354387,0.22387513,0.59808805,7.5647066,7.7263348)" />
            <path style={style2} d="M 4.5472185,10.333586 8.1220759,4.0990346"/>
            <path style={style2} d="m 12.154515,4.0418369 3.51766,6.2917491"/>
            <path style={style2} d="m 6.5491386,14.223031 7.0925174,-0.0572"/>
          </symbol>
          <symbol id="archimate-distribution-network-badge" className="archimate-badge" viewBox="0 0 20 20">
            <path style={style3} d="M 5.8847321,2.5480283 1.4964611,6.7745197 5.7431749,10.596562"/>
            <path style={style2} d="m 3.5995956,4.8129424 12.6592514,0"/>
            <path d="m 3.5995956,8.6754298 13.2861464,0" style={style2}/>
            <path d="m 14.314928,2.7502528 4.388271,4.2264914 -4.246714,3.8220418" style={style3} />
          </symbol>
          <symbol id="archimate-facility-badge" className="archimate-badge" viewBox="0 0 20 20">
            <path style={{fill:"none",stroke:"inherit",strokeWidth:1,strokeLinejoin:"miter"}} d="m 2.1449144,17.940882 0,-15.7007732 2.1735133,0 0,10.2383912 4.5472185,-2.7740891 0,2.8598861 4.4900208,-2.888485 0,2.74549 4.51862,-2.6882923 0,8.2078723 z"/>
          </symbol>
          <symbol id="archimate-equipment-badge" className="archimate-badge" viewBox="0 0 20 20">
            <g transform="translate(0,-7)">
              <circle cx="8" cy="18.7" r="2.432014" style={style4}/>
              <circle cx="13.7" cy="12.6" r="2.0318091" style={style4}/>
              <path d="m 10.419829,13.456928 -1.089422,-0.143227 0.049633,-1.333107 1.038029,-0.147302 0.341694,-0.73592 -0.57155,-0.843058 0.841528,-0.8648267 0.957991,0.4937924 0.912018,-0.3836763 0.17842,-0.962147 1.316037,-0.019985 0.101237,0.9711183 0.869824,0.3547524 0.771707,-0.6499933 0.91403,0.8676982 -0.566748,0.882319 0.356276,0.832942 0.930473,0.02346 0.06356,1.262322 -1.035165,0.180358 -0.419167,0.824685 0.690443,0.793236 -0.972585,0.907704 -0.733596,-0.578471 -0.952142,0.360765 -0.169839,0.993647 -1.356163,-0.0029 -0.122641,-0.947842 -0.848419,-0.378029 -0.857761,0.70726 -0.979897,-0.985107 0.737388,-0.77599 z" style={{fill:"none",stroke:"inherit",strokeWidth:0.8,strokeLinejoin:"bevel"}}/>
              <path style={{fill:"none",stroke:"inherit",strokeWidth:0.8,strokeLinejoin:"bevel"}} d="m 3.5980557,18.939362 -1.3122324,-0.550291 0.5156318,-1.650873 1.3468917,0.16932 0.6772813,-0.804271 -0.4271363,-1.249401 1.3455665,-0.795275 1.0287534,0.944094 1.2699024,-0.169321 0.550291,-1.142912 1.6508729,0.423301 -0.203979,1.2494 0.965921,0.740114 1.185242,-0.550291 0.846601,1.396892 -1.00825,0.91076 0.161649,1.163414 1.154418,0.346312 -0.350147,1.600872 -1.354562,-0.12699 -0.804272,0.888931 0.592621,1.227572 L 9.9052376,23.764991 9.1856262,22.791399 7.8733938,22.918389 7.3231027,24.103632 5.6298996,23.638001 5.7992199,22.410428 4.8679581,21.648487 3.5557257,22.241108 2.666794,20.674895 3.8520362,19.955284 Z"/>
            </g>
          </symbol>
          <symbol id="archimate-resource-badge" className="archimate-badge"  viewBox="0 0 20 20">
            <rect style={{fill:"none",stroke:"inherit",strokeWidth:0.7}} width="1.6" height="3.3" x="17" y="5" ry="0.8" rx="0.8"/>
            <rect style={{fill:"none",stroke:"inherit",strokeWidth:0.7}} width="14" height="9" x="3" y="2" ry="1.2" />
            <path style={{fill:"none",stroke:"inherit",strokeWidth:1}} d="m 6,4 v 4.4 m 3 -4.4 v 4.4 m 3 -4.4 v 4.4"/>
          </symbol>
          <symbol id="archimate-outcome-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <circle style={{fill:"none",stroke:"inherit",strokeWidth:0.9,strokeLinecap:"round",strokeLinejoin:"round"}} cx="9.0192108" cy="11.324571" r="1.718908" />
            <circle style={{fill:"none",stroke:"inherit",strokeWidth:0.9,strokeLinecap:"round",strokeLinejoin:"round"}} cx="9.1405458" cy="11.304347" r="3.5591507" />
            <circle style={{fill:"none",stroke:"inherit",strokeWidth:0.9,strokeLinecap:"round",strokeLinejoin:"round"}} cx="9.0798788" cy="11.324571" r="5.2982812" />
            <path style={{fill:"inherit",stroke:"inherit",strokeWidth:0.6,strokeLinecap:"butt",strokeLinejoin:"round"}} d="M 8.7563195,11.547017 9.4236603,8.0485339 12.598584,10.940344 Z"/>
            <path style={{fill:"none",stroke:"inherit",strokeWidth:1.4,strokeLinecap:"round",strokeLinejoin:"miter"}} d="M 16.097068,4.2264914 10.920121,9.6258847"/>
            <path style={{fill:"none",stroke:"inherit",strokeWidth:0.9,strokeLinecap:"round",strokeLinejoin:"miter"}} d="M 14.742164,2.2244692 13.811931,6.3296259"/>
            <path style={{fill:"none",stroke:"inherit",strokeWidth:0.9,strokeLinecap:"round",strokeLinejoin:"miter"}} d="M 18.200202,5.0151668 13.953489,6.5318504"/>
          </symbol>
          <symbol id="archimate-course-of-action-badge" className="archimate-badge" viewBox="0 0 20 20">
            <circle style={{fill:"inherit",stroke:"inherit",strokeWidth:1}} cx="14.5" cy="6" r="1" />
            <circle style={{fill:"none",stroke:"inherit",strokeWidth:1}} cx="14.5" cy="6" r="2.8" />
            <circle style={{fill:"none",stroke:"inherit",strokeWidth:1}} cx="14.5" cy="6" r="4.6" />
            <path style={{fill:"inherit",stroke:"inherit",strokeWidth:1,strokeLinecap:"butt",strokeLinejoin:"miter"}} d="M 1.1664063,14.167969 C 2.5664063,12.167969 4.1,10.95 5.6,9.85 L 4.5,9 C 4.3,8.25 4.54,7.9 5.25,7.9 l 4.5,0.6 c -0.5108623,0.013713 1.081001,-0.037861 0.5,1.1 l -3,3.7 c -0.6,0.4 -1,0.25 -1.2,-0.15 L 6.01,11.75 C 4.5,12.5 3.5,14 2.5,15 1.83125,15.09375 1.1875,14.617188 1.1703125,14.171875 Z"/>
          </symbol>
          <symbol id="archimate-capability-badge" className="archimate-badge" viewBox="0 0 20 20">
            <rect x="4" y="11.5" width="5" height="5" style={{fill:"none",stroke:"#423f30"}}/>
            <rect x="9" y="11.5" width="5" height="5" style={{fill:"none",stroke:"#423f30"}}/>
            <rect x="14" y="11.5" width="5" height="5" style={{fill:"none",stroke:"#423f30"}}/>
            <rect x="9" y="6.5" width="5" height="5" style={{fill:"none",stroke:"#423f30"}}/>
            <rect x="14" y="6.5" width="5" height="5" style={{fill:"none",stroke:"#423f30"}}/>
            <rect x="14" y="1.5" width="5" height="5" style={{fill:"none",stroke:"#423f30"}}/>
          </symbol>
          <symbol id="archimate-diagram-model-reference-badge" className="archimate-badge" viewBox="0 0 20 20">
            <rect x="1" y="0.5" width="7" height="7" style={{fill:"none",stroke:"#1c6aa9"}}/>
            <rect x="2" y="1.5" width="4.5" height="4.5" style={{fill:"#c2e8fe",stroke:"#c2e8fe"}}/>
            <path d="M11 4 h7" style={{fill:"none",stroke:"#c2e8fe"}}/>
            <path d="M11 5 h7" style={{fill:"none",stroke:"#1c6aa9"}}/>
            <rect x="12" y="8.5" width="2" height="2" style={{fill:"none",stroke:"#1c6aa9"}}/>
            <path d="M15 9.5 h3" style={{fill:"none",stroke:"#1c6aa9"}}/>
            <rect x="1" y="11.7" width="7" height="7" style={{fill:"none",stroke:"#1c6aa9"}}/>
            <rect x="2" y="12.7" width="4.5" height="4.5" style={{fill:"#c2e8fe",stroke:"#c2e8fe"}}/>
            <path d="M11 14.7 h7" style={{fill:"none",stroke:"#c2e8fe"}}/>
            <path d="M11 15.7 h7" style={{fill:"none",stroke:"#1c6aa9"}}/>
          </symbol>
          <symbol id="archimate-actor-badge" className="archimate-badge" viewBox="0 0 20 20">
            <path d="M 11 18 l 4 -5 l 4 5 m -4 -5 v -3 h -4 h 8 h -4 v -3 a 3 3 0 1 0 0 -6 a 3 3 0 1 0 0 6" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-assessment-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m4.5 13 l 5 -5 a 4 4 0 1 0 8 -8 a 4 4 0 1 0 -8 8" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-collaboration-badge" className="archimate-badge"  viewBox="0 0 20 15" preserveAspectRatio="xMaxYMin meet">
            <path d="m7.5 14 a 6.5 6.5 0 0 1 0 -13 a 6.5 6.5 0 0 1 0 13 m 5 0 a 6.5 6.5 0 0 1 0 -13 a 6.5 6.5 0 0 1 0 13" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-communication-path-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m7.5 -1 l -6.5 6.5 l 6.5 6.5 m 5 -13 l 6.5 6.5 l -6.5 6.5 m -7 -6.5 h 2 m 1.5 0 h 2 m 1.5 0 h 2" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-constraint-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m6 -1 h 13 l -5 10 h -13 z m 4 0 l -5 10" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-device-badge" className="archimate-badge" viewBox="0 0 20 20">
            <rect x="2" y="1" width="16" height="10" rx="3" ry="3" style={{fill:"inherit",stroke:"inherit"}}/>
            <path d="M6 11 l -4.5 4 h 17 l -4.5 -4" stroke="black" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-driver-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m17.5 6.5 a 6.5 6.5 0 0 0 -13 0 a 6.5 6.5 0 0 0 13 0 m 2 0 h -17 m 8.5 -8.5 v 17 m -6.01 -2.49 l 12.02 -12.02 m 0 12.02 l -12.02 -12.02" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-event-badge" className="archimate-badge"  viewBox="0 0 20 20">
            <path d="m1 1 a 8 6.5 0 0 1 0 12 h 12 a 6 5.5 0 0 0 0 -12 z" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-function-badge" className="archimate-badge"  viewBox="0 0 20 20" preserveAspectRatio="xMaxYMin meet">
            <path d="m7 15 l 0 -9 l 6 -5 l 6 5 l 0 9 l -6 -6 z" style={{fill:"none",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-gap-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m4.5 5 a 6.5 6.5 0 0 0 13 0 a 6.5 6.5 0 0 0 -13 0 m -2 -1.5 h 17 m -17 3 h 17" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-goal-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <circle cx="12" cy="6" r="7" style={{fill:"inherit",stroke:"inherit"}}/>
            <circle cx="12" cy="6" r="4.7" style={{fill:"inherit",stroke:"inherit"}}/>
            <circle cx="12" cy="6" r="2" style={{fill:"black",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-interaction-badge" className="archimate-badge"  viewBox="0 0 20 15" preserveAspectRatio="xMaxYMin meet">
            <path d="M11 14 a 5 6 0 0 1 0 -13 z" style={{fill:"inherit",stroke:"inherit"}}/>
            <path d="M14 14 a 5 6 0 0 0 0 -13 z" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-interface-badge" className="archimate-badge"  viewBox="0 0 20 15" preserveAspectRatio="xMaxYMin meet">
            <path d="m0.5 6 h 8.5 a 5 5 0 0 1 10 0 a 5 5 0 0 1 -10 0" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-location-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m10 6.5 a 5 5, 0, 1, 1, 8 0 l -4 7 z" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-network-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m9 9.5 a 2.5 2.5 0 0 0 -5 0 a 2.5 2.5 0 0 0 5 0 m -2 -2.5 l 1 -3 m 0.5 0 a 2.5 2.5 0 0 0 0 -5 a 2.5 2.5 0 0 0 0 5 m 2 -2.5 h 3.5 a 2.5 2.5 0 0 0 5 0 a 2.5 2.5 0 0 0 -5 0 m 2 2.5 l -1 3 m -0.5 0 a 2.5 2.5 0 0 0 0 5 a 2.5 2.5 0 0 0 0 -5 m -2 2.5 h -3.5" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-app-component-badge" className="archimate-badge" viewBox="0 0 20 20">
            <path d="m6 4 v -3 h 12 v 17 h -12 v -3 m 0 -4 v -3" style={{fill:"inherit",stroke:"inherit"}}/>
            <rect x="1" y="4" width="9" height="4" style={{fill:"inherit",stroke:"inherit"}}/>
            <rect x="1" y="11" width="9" height="4" style={{fill:"inherit",stroke:"inherit"}} />
          </symbol>
          <symbol id="archimate-node-badge" className="archimate-badge" viewBox="0 0 20 20">
            <path d="M1 19 v -15 l 3 -3 h 15 v 15 l -3 3 z M 16 19 v -15 l 3 -3 m -3 3 h -15" style={{fill:"none",stroke:"inherit",strokeLinejoin:"miter"}} />
          </symbol>
          <symbol id="archimate-plateau-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m7 0 h 12 m -12 1 h 12 m -14 3 h 12 m -12 1 h 12 m -14 3 h 12 m -12 1 h 12" style={{fill:"inherit",stroke:"inherit"}} />
          </symbol>
          <symbol id="archimate-principle-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m8.5 -1 h 8 a 2 2 0 0 0 2 2 v 9 a 2 2 0 0 0 -2 2 h -8 a 2 2 0 0 0 -2 -2 v -9 a 2 2 0 0 0 2 -2 m 4 1 v7 m 1 -7 v7 m -1 1.5 v2 m 1 -2 v2" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-process-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m1 3 h 11 v -4 l 7 6 l -7 6 v -4 h -11 z" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-requirement-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m6 -1 h 13 l -5 10 h -13 z" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-role-badge" className="archimate-badge"  viewBox="0 0 20 20">
            <path d="m15 10.5 h -10 a 4.5 4.5 0 0 1 0 -9 h 10 a 4.5 4.5 0 0 1 0 9 a 4.5 4.5 0 0 1 0 -9" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <symbol id="archimate-service-badge" className="archimate-badge" viewBox="0 0 20 20">
            <rect x="1" y="1" width="17" height="10" rx="5" ry="5" style={{fill:"inherit",stroke:"inherit"}} />
          </symbol>
          <symbol id="archimate-system-software-badge" className="archimate-badge"  viewBox="0 0 20 15">
            <path d="m9.5 1 a 5.5 5.5 0 0 1 0 11 a 5.5 5.5 0 0 1 0 -11    m -2.8 0.7    a 5.5 5.5 0 1 1 7.6 7.6" style={{fill:"inherit",stroke:"inherit"}}/>
          </symbol>
          <marker id="archimate-dot-marker" viewBox="0 0 10 10" refX="4" refY="4" markerUnits="strokeWidth" markerWidth="10" markerHeight="10">
            <circle cx="4" cy="4" r="3" fill="black" stroke="black" />
          </marker>
          <marker id="archimate-used-by-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="black" style={{fill:"none",stroke:"black"}}/>
          </marker>
          <marker id="archimate-open-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="8" orient="auto" stroke="black" fill="none">
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="black"/>
          </marker>
          <marker id="archimate-filled-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" orient="auto">
            <polygon points="1,1 9,5 1,9" fill="black" stroke="black"/>
          </marker>
          <marker id="archimate-hollow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" orient="auto">
            <polygon points="1,1 9,5 1,9" fill="white" stroke="black"/>
          </marker>
          <marker id="archimate-filled-diamond" viewBox="0 0 10 10" refX="1" refY="5" markerUnits="strokeWidth" markerWidth="24" markerHeight="24" orient="auto">
            <polygon points="5,2.5 9,5 5,7.5 1,5" fill="black" stroke="black"/>
          </marker>
          <marker id="archimate-hollow-diamond" viewBox="0 0 25 25" refX="1" refY="12" markerUnits="strokeWidth" markerWidth="24" markerHeight="24" orient="auto">
            <polygon points="12.5,6.25 22.5,12.5 12.5,18.75 2.5,12.5" fill="white" stroke="black"/>
          </marker>
        </defs>
        <g ref={this.svgTopGroup}>
          { this.props.children }
        </g>
      </svg>
    );
  }

  public componentDidMount() {
    const svgTopGroup = this.svgTopGroup.current;
    if (svgTopGroup) {
      // this.panzoom = 
      createPanZoom(svgTopGroup, {});
    }
  }

  public componentWillUnmount() {
    if (this.panzoom) {
      // this.panzoom.dispose();
      this.panzoom = undefined;
    }
  }

  public svgLoaded(evt: React.SyntheticEvent<SVGSVGElement>) {
    const svg = evt.currentTarget;
    const bbox = svg.getBBox();
    this.setState({viewBox: bbox})
  }
  
  public svgResized(evt: React.SyntheticEvent<SVGSVGElement>) {
    this.svgLoaded(evt);
  }
}
