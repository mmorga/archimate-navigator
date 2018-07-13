import * as React from "react";

export interface IProps {
  svgRefCallback: (svg: SVGSVGElement | undefined) => void;
}

/* tslint:disable:max-line-length whitespace */
export default class ArchimateBlankSvg extends React.PureComponent<IProps> {
  private svg?: SVGSVGElement;

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const archimateCss = `
svg {
    font-family: "Lucida Grande";
    font-size: 11px;
}

p {
    fill: black;
    margin: 0;
    stroke: none;
}

path {
    fill: inherit;
    stroke: inherit;
    stroke-width: 1px;
}

.entity-name {
    text-align: center;
    vertical-align: top;
}

.entity>.properties {
    visibility: hidden;
}

.entity:hover>.properties {
    visibility: visible;
    z-index: 1000;
}

table.properties {
    background-color: whitesmoke;
    border: 2px solid gray;
}

table.properties>caption {
    background-color: gray;
    border: 2px solid gray;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.archimate-decoration {
    fill:rgba(0,0,0,0.1);
    stroke: inherit;
}

.archimate-badge {
    fill: none;
    stroke: black;
    stroke-width: 1px;
}

.archimate-badge-spacer {
    float: right;
    height: 20px;
    width: 20px;
    /*border: 1px solid red;*/
}

.archimate-icon {
    fill: none;
    stroke: black;
}

.archimate-default-element {
    fill: #ddd;
    stroke: #999;
}

.archimate-strategy-background {
    fill: #eddfac;
    stroke: #44423b;
}

.archimate-business-background {
    fill: #fffeb9;
    stroke: #b2b181;
}

.archimate-business-decoration {
    fill: rgb(229, 229, 162);
    stroke: rgb(178, 178, 126);
}

.archimate-application-background {
    fill: #ccfdfe;
    stroke: #80b2b2;
}

.archimate-application-decoration {
    fill: rgb(162, 229, 229);
    stroke: rgb(126, 178, 178);
}

.archimate-technology-background {
    fill: #cae6b9;
    stroke: #8ca081;
}

.archimate-technology-decoration {
    fill: #b4cfa4;
    stroke: #9bb28d;
}

.archimate-physical-background {
    fill: #cdfeb2;
    stoke: #313331;
}

.archimate-motivation-background {
    fill: #fecdfe;
    stroke: #b18fb1;
}

.archimate-motivation2-background {
    fill: #cccdfd;
    stroke: #8e8fb1;
}

.archimate-implementationandmigration-background {
    fill: #fee0e0;
    stroke: #b19c9c;
}

.archimate-implementationandmigration2-background {
    fill: #e0ffe0;
    stroke: #9cb29c;
}

.archimate-implementation2-decoration {
    fill: #c9e5c9;
    stroke: #9cb29c;
}

.archimate-note-background {
    fill: #fff;
    stroke: #b2b2b2;
}

.archimate-group-background {
    fill: #d2d7d7;
    stroke: #939696;
}

.archimate-sticky-background {
    fill: #fffeb9;
    stroke: #b2b181;
}

.archimate-junction-background {
    fill: black;
    stroke: black;
}

.archimate-or-junction-background {
    fill: white;
    stroke: black;
}

.archimate-diagram-model-reference-background {
    fill: #dcebeb;
    stroke: #9aa4a4;
}

.archimate-default-background {
    fill: #ddd;
    stroke: #999;
}

/* Relationships */
.archimate-relationship {
    fill: none;
    stroke: black;
    stroke-width: 1px;
}

.archimate-relationship-name {
    font-size: 9px;
}

.archimate-AssignmentRelationship {
    marker-end: url(#archimate-dot-marker);
    marker-start: url(#archimate-dot-marker);
}

.archimate-CompositionRelationship {
    marker-start: url(#archimate-filled-diamond);
}

.archimate-UsedByRelationship {
    marker-end: url(#archimate-used-by-arrow);
}

.archimate-AggregationRelationship {
    marker-start: url(#archimate-hollow-diamond);
}

.archimate-AccessRelationship {
    marker-end: url(#archimate-open-arrow);
    stroke-dasharray: 2, 3;
}

.archimate-RealisationRelationship {
    marker-end: url(#archimate-hollow-arrow);
    stroke-dasharray: 5, 3;
}

.archimate-SpecialisationRelationship {
    marker-end: url(#archimate-hollow-arrow);
}

/*.archimate-InfluenceRelationship, .archimate-AssociationRelationship {
}
*/
.archimate-TriggeringRelationship {
    marker-end: url(#archimate-filled-arrow);
}

.archimate-FlowRelationship {
    marker-end: url(#archimate-filled-arrow);
    stroke-dasharray: 3, 3;
}

/*.archimate-default-connection {
}
*/
    `;
    return (
      <svg
        ref={svg => {
          this.svg = svg ? svg : undefined;
        }}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="1000"
        height="1000"
        viewBox="0 0 1000 1000"
      >
        <style type="text/css">{archimateCss}</style>
        <defs>
          <symbol
            id="archimate-rect-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="53"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-rounded-rect-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="53"
              rx="5"
              ry="5"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-component-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="10"
              y="1"
              width="108"
              height="53"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <rect
              x="1"
              y="11"
              width="21"
              height="13"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <rect
              x="1"
              y="11"
              width="21"
              height="13"
              className="archimate-decoration"
            />
            <rect
              x="1"
              y="31"
              width="21"
              height="13"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <rect
              x="1"
              y="31"
              width="21"
              height="13"
              className="archimate-decoration"
            />
          </symbol>

          <symbol
            id="archimate-event-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <path
              d="M 1 1 l 18 27 l -18 27 h 102.0 a 17 27 0 0 0 0 -54.0 z"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-product-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="53"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <rect
              x="1"
              y="1"
              width="60"
              height="8"
              className="archimate-decoration"
            />
          </symbol>

          <symbol
            id="archimate-object-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="53"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <rect
              x="1"
              y="1"
              width="118"
              height="8"
              className="archimate-decoration"
            />
          </symbol>

          <symbol
            id="archimate-contract-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="53"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <rect
              x="1"
              y="1"
              width="118"
              height="8"
              className="archimate-decoration"
            />
            <rect
              x="1"
              y="46"
              width="118"
              height="8"
              className="archimate-decoration"
            />
          </symbol>

          <symbol
            id="archimate-service-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="53"
              rx="27"
              ry="27"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-value-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <ellipse
              cx="60"
              cy="27.5"
              rx="59.0"
              ry="26.5"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-representation-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <path
              d="M 1 1 v 47 c 20 7.315 40.32 7.315 60.96 0 c 1.932 -4.279 38.64 -4.279 57.0 0 v -47.0 z"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-meaning-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="53"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-artifact-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <path d="M 1 1 h 100 l 18 18 v 35 h -118 z" />
            <path d="M 102 1 v 18 h 18 z" className="archimate-decoration" />
          </symbol>

          <symbol
            id="archimate-motivation-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <path
              d="M 11 1 h 98 l 10 10 v 33 l -10 10 h -98 l -10 -10 v -33 z"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
          </symbol>

          <symbol
            id="archimate-node-shape"
            className="archimate-shape"
            viewBox="0 0 120 55"
          >
            <path
              d="M 1 54 v -46 l 7 -7 h 111 v 46 l -7 7 z"
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <path
              d="M 1 8 l 7 -7 h 111 v 46 l -7 7 v -46 z M 119 1 l -7 7"
              className="archimate-decoration"
            />
            <path
              d="M 1 8 h 111 l 7 -7 M 112 54 v -46"
              style={{ fill: "none", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-material-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinejoin: "miter",
                strokeWidth: "1"
              }}
              d="M 15.443383,8.5890552 5.0182941,17.265414 -7.7081977,12.575201 -10.0096,-0.7913701 0.41548896,-9.4677289 13.141981,-4.7775163 Z"
              transform="matrix(0.59818877,-0.22354387,0.22387513,0.59808805,7.5647066,7.7263348)"
            />
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
              d="M 4.5472185,10.333586 8.1220759,4.0990346"
            />
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
              d="m 12.154515,4.0418369 3.51766,6.2917491"
            />
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
              d="m 6.5491386,14.223031 7.0925174,-0.0572"
            />
          </symbol>
          <symbol
            id="archimate-distribution-network-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1px"
              }}
              d="M 5.8847321,2.5480283 1.4964611,6.7745197 5.7431749,10.596562"
            />
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
              d="m 3.5995956,4.8129424 12.6592514,0"
            />
            <path
              d="m 3.5995956,8.6754298 13.2861464,0"
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
            />
            <path
              d="m 14.314928,2.7502528 4.388271,4.2264914 -4.246714,3.8220418"
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1px"
              }}
            />
          </symbol>
          <symbol
            id="archimate-facility-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
              d="m 2.1449144,17.940882 0,-15.7007732 2.1735133,0 0,10.2383912 4.5472185,-2.7740891 0,2.8598861 4.4900208,-2.888485 0,2.74549 4.51862,-2.6882923 0,8.2078723 z"
            />
          </symbol>
          <symbol
            id="archimate-equipment-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <g transform="translate(0,-7)">
              <circle
                cx="8"
                cy="18.7"
                r="2.432014"
                style={{ fill: "none", stroke: "inherent", strokeWidth: "0.7" }}
              />
              <circle
                cx="13.7"
                cy="12.6"
                r="2.0318091"
                style={{ fill: "none", stroke: "inherent", strokeWidth: "0.7" }}
              />
              <path
                d="m 10.419829,13.456928 -1.089422,-0.143227 0.049633,-1.333107 1.038029,-0.147302 0.341694,-0.73592 -0.57155,-0.843058 0.841528,-0.8648267 0.957991,0.4937924 0.912018,-0.3836763 0.17842,-0.962147 1.316037,-0.019985 0.101237,0.9711183 0.869824,0.3547524 0.771707,-0.6499933 0.91403,0.8676982 -0.566748,0.882319 0.356276,0.832942 0.930473,0.02346 0.06356,1.262322 -1.035165,0.180358 -0.419167,0.824685 0.690443,0.793236 -0.972585,0.907704 -0.733596,-0.578471 -0.952142,0.360765 -0.169839,0.993647 -1.356163,-0.0029 -0.122641,-0.947842 -0.848419,-0.378029 -0.857761,0.70726 -0.979897,-0.985107 0.737388,-0.77599 z"
                style={{
                  fill: "none",
                  stroke: "inherit",
                  strokeLinejoin: "bevel",
                  strokeWidth: "0.8"
                }}
              />
              <path
                style={{
                  fill: "none",
                  stroke: "inherit",
                  strokeLinejoin: "bevel",
                  strokeWidth: "0.8"
                }}
                d="m 3.5980557,18.939362 -1.3122324,-0.550291 0.5156318,-1.650873 1.3468917,0.16932 0.6772813,-0.804271 -0.4271363,-1.249401 1.3455665,-0.795275 1.0287534,0.944094 1.2699024,-0.169321 0.550291,-1.142912 1.6508729,0.423301 -0.203979,1.2494 0.965921,0.740114 1.185242,-0.550291 0.846601,1.396892 -1.00825,0.91076 0.161649,1.163414 1.154418,0.346312 -0.350147,1.600872 -1.354562,-0.12699 -0.804272,0.888931 0.592621,1.227572 L 9.9052376,23.764991 9.1856262,22.791399 7.8733938,22.918389 7.3231027,24.103632 5.6298996,23.638001 5.7992199,22.410428 4.8679581,21.648487 3.5557257,22.241108 2.666794,20.674895 3.8520362,19.955284 Z"
              />
            </g>
          </symbol>
          <symbol
            id="archimate-resource-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <rect
              style={{ fill: "none", stroke: "inherit", strokeWidth: "0.7" }}
              width="1.6"
              height="3.3"
              x="17"
              y="5"
              ry="0.8"
              rx="0.8"
            />
            <rect
              style={{ fill: "none", stroke: "inherit", strokeWidth: "0.7" }}
              width="14"
              height="9"
              x="3"
              y="2"
              ry="1.2"
            />
            <path
              style={{ fill: "none", stroke: "inherit", strokeWidth: "1" }}
              d="m 6,4 v 4.4 m 3 -4.4 v 4.4 m 3 -4.4 v 4.4"
            />
          </symbol>
          <symbol
            id="archimate-outcome-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <circle
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "0.9"
              }}
              cx="9.0192108"
              cy="11.324571"
              r="1.718908"
            />
            <circle
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "0.9"
              }}
              cx="9.1405458"
              cy="11.304347"
              r="3.5591507"
            />
            <circle
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "0.9"
              }}
              cx="9.0798788"
              cy="11.324571"
              r="5.2982812"
            />
            <path
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "round",
                strokeWidth: "0.6"
              }}
              d="M 8.7563195,11.547017 9.4236603,8.0485339 12.598584,10.940344 Z"
            />
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "miter",
                strokeWidth: "1.4"
              }}
              d="M 16.097068,4.2264914 10.920121,9.6258847"
            />
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "miter",
                strokeWidth: "0.9"
              }}
              d="M 14.742164,2.2244692 13.811931,6.3296259"
            />
            <path
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinecap: "round",
                strokeLinejoin: "miter",
                strokeWidth: "0.9"
              }}
              d="M 18.200202,5.0151668 13.953489,6.5318504"
            />
          </symbol>
          <symbol
            id="archimate-course-of-action-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <circle
              style={{ fill: "inherit", stroke: "inherit", strokeWidth: "1" }}
              cx="14.5"
              cy="6"
              r="1"
            />
            <circle
              style={{ fill: "none", stroke: "inherit", strokeWidth: "1" }}
              cx="14.5"
              cy="6"
              r="2.8"
            />
            <circle
              style={{ fill: "none", stroke: "inherit", strokeWidth: "1" }}
              cx="14.5"
              cy="6"
              r="4.6"
            />
            <path
              style={{
                fill: "inherit",
                stroke: "inherit",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeWidth: "1px"
              }}
              d="M 1.1664063,14.167969 C 2.5664063,12.167969 4.1,10.95 5.6,9.85 L 4.5,9 C 4.3,8.25 4.54,7.9 5.25,7.9 l 4.5,0.6 c -0.5108623,0.013713 1.081001,-0.037861 0.5,1.1 l -3,3.7 c -0.6,0.4 -1,0.25 -1.2,-0.15 L 6.01,11.75 C 4.5,12.5 3.5,14 2.5,15 1.83125,15.09375 1.1875,14.617188 1.1703125,14.171875 Z"
            />
          </symbol>
          <symbol
            id="archimate-capability-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <rect
              x="4"
              y="11.5"
              width="5"
              height="5"
              style={{ fill: "none", stroke: "#423f30" }}
            />
            <rect
              x="9"
              y="11.5"
              width="5"
              height="5"
              style={{ fill: "none", stroke: "#423f30" }}
            />
            <rect
              x="14"
              y="11.5"
              width="5"
              height="5"
              style={{ fill: "none", stroke: "#423f30" }}
            />
            <rect
              x="9"
              y="6.5"
              width="5"
              height="5"
              style={{ fill: "none", stroke: "#423f30" }}
            />
            <rect
              x="14"
              y="6.5"
              width="5"
              height="5"
              style={{ fill: "none", stroke: "#423f30" }}
            />
            <rect
              x="14"
              y="1.5"
              width="5"
              height="5"
              style={{ fill: "none", stroke: "#423f30" }}
            />
          </symbol>
          <symbol
            id="archimate-diagram-model-reference-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <rect
              x="1"
              y="0.5"
              width="7"
              height="7"
              style={{ fill: "none", stroke: "#1c6aa9" }}
            />
            <rect
              x="2"
              y="1.5"
              width="4.5"
              height="4.5"
              style={{ fill: "#c2e8fe", stroke: "#c2e8fe" }}
            />
            <path d="M11 4 h7" style={{ fill: "none", stroke: "#c2e8fe" }} />
            <path d="M11 5 h7" style={{ fill: "none", stroke: "#1c6aa9" }} />

            <rect
              x="12"
              y="8.5"
              width="2"
              height="2"
              style={{ fill: "none", stroke: "#1c6aa9" }}
            />
            <path d="M15 9.5 h3" style={{ fill: "none", stroke: "#1c6aa9" }} />

            <rect
              x="1"
              y="11.7"
              width="7"
              height="7"
              style={{ fill: "none", stroke: "#1c6aa9" }}
            />
            <rect
              x="2"
              y="12.7"
              width="4.5"
              height="4.5"
              style={{ fill: "#c2e8fe", stroke: "#c2e8fe" }}
            />
            <path d="M11 14.7 h7" style={{ fill: "none", stroke: "#c2e8fe" }} />
            <path d="M11 15.7 h7" style={{ fill: "none", stroke: "#1c6aa9" }} />
          </symbol>
          <symbol
            id="archimate-actor-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <path
              d="M 11 18 l 4 -5 l 4 5 m -4 -5 v -3 h -4 h 8 h -4 v -3 a 3 3 0 1 0 0 -6 a 3 3 0 1 0 0 6"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-assessment-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m4.5 13 l 5 -5 a 4 4 0 1 0 8 -8 a 4 4 0 1 0 -8 8"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-collaboration-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
            preserveAspectRatio="xMaxYMin meet"
          >
            <path
              d="m7.5 14 a 6.5 6.5 0 0 1 0 -13 a 6.5 6.5 0 0 1 0 13 m 5 0 a 6.5 6.5 0 0 1 0 -13 a 6.5 6.5 0 0 1 0 13"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-communication-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m7.5 -1 l -6.5 6.5 l 6.5 6.5 m 5 -13 l 6.5 6.5 l -6.5 6.5 m -7 -6.5 h 3 m 3 0 h 3"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-constraint-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m6 -1 h 13 l -5 10 h -13 z m 4 0 l -5 10"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-device-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <rect
              x="2"
              y="1"
              width="16"
              height="10"
              rx="3"
              ry="3"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
            <path
              d="M6 11 l -4.5 4 h 17 l -4.5 -4"
              stroke="black"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-driver-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m17.5 6.5 a 6.5 6.5 0 0 0 -13 0 a 6.5 6.5 0 0 0 13 0 m 2 0 h -17 m 8.5 -8.5 v 17 m -6.01 -2.49 l 12.02 -12.02 m 0 12.02 l -12.02 -12.02"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-function-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
            preserveAspectRatio="xMaxYMin meet"
          >
            <path
              d="m7 15 l 0 -9 l 6 -5 l 6 5 l 0 9 l -6 -6 z"
              style={{ fill: "none", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-gap-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m4.5 5 a 6.5 6.5 0 0 0 13 0 a 6.5 6.5 0 0 0 -13 0 m -2 -1.5 h 17 m -17 3 h 17"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-goal-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <circle
              cx="12"
              cy="6"
              r="7"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
            <circle
              cx="12"
              cy="6"
              r="4.7"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
            <circle
              cx="12"
              cy="6"
              r="2"
              style={{ fill: "black", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-interaction-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
            preserveAspectRatio="xMaxYMin meet"
          >
            <path
              d="M11 14 a 5 6 0 0 1 0 -13 z"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
            <path
              d="M14 14 a 5 6 0 0 0 0 -13 z"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-interface-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
            preserveAspectRatio="xMaxYMin meet"
          >
            <path
              d="m0.5 6 h 8.5 a 5 5 0 0 1 10 0 a 5 5 0 0 1 -10 0"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-location-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m10 6.5 a 5 5, 0, 1, 1, 8 0 l -4 7 z"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-network-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m9 9.5 a 2.5 2.5 0 0 0 -5 0 a 2.5 2.5 0 0 0 5 0 m -2 -2.5 l 1 -3 m 0.5 0 a 2.5 2.5 0 0 0 0 -5 a 2.5 2.5 0 0 0 0 5 m 2 -2.5 h 3.5 a 2.5 2.5 0 0 0 5 0 a 2.5 2.5 0 0 0 -5 0 m 2 2.5 l -1 3 m -0.5 0 a 2.5 2.5 0 0 0 0 5 a 2.5 2.5 0 0 0 0 -5 m -2 2.5 h -3.5"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-node-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <path
              d="M1 19 v -15 l 3 -3 h 15 v 15 l -3 3 z M 16 19 v -15 l 3 -3 m -3 3 h -15"
              style={{
                fill: "none",
                stroke: "inherit",
                strokeLinejoin: "miter"
              }}
            />
          </symbol>
          <symbol
            id="archimate-plateau-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m7 0 h 12 m -12 1 h 12 m -14 3 h 12 m -12 1 h 12 m -14 3 h 12 m -12 1 h 12"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-principle-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m8.5 -1 h 8 a 2 2 0 0 0 2 2 v 9 a 2 2 0 0 0 -2 2 h -8 a 2 2 0 0 0 -2 -2 v -9 a 2 2 0 0 0 2 -2 m 4 1 v7 m 1 -7 v7 m -1 1.5 v2 m 1 -2 v2"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-process-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m1 3 h 11 v -4 l 7 6 l -7 6 v -4 h -11 z"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-requirement-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m6 -1 h 13 l -5 10 h -13 z"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-role-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <path
              d="m15 10.5 h -10 a 4.5 4.5 0 0 1 0 -9 h 10 a 4.5 4.5 0 0 1 0 9 a 4.5 4.5 0 0 1 0 -9"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-service-badge"
            className="archimate-badge"
            viewBox="0 0 20 20"
          >
            <rect
              x="1"
              y="1"
              width="17"
              height="10"
              rx="5"
              ry="5"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>
          <symbol
            id="archimate-system-software-badge"
            className="archimate-badge"
            viewBox="0 0 20 15"
          >
            <path
              d="m9.5 1 a 5.5 5.5 0 0 1 0 11 a 5.5 5.5 0 0 1 0 -11    m -2.8 0.7    a 5.5 5.5 0 1 1 7.6 7.6"
              style={{ fill: "inherit", stroke: "inherit" }}
            />
          </symbol>

          <marker
            id="archimate-dot-marker"
            viewBox="0 0 10 10"
            refX="4"
            refY="4"
            markerUnits="strokeWidth"
            markerWidth="8"
            markerHeight="8"
          >
            <circle cx="4" cy="4" r="3" fill="black" stroke="black" />
          </marker>
          <marker
            id="archimate-used-by-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path
              d="M 1 1 L 9 5 L 1 9"
              fill="none"
              stroke="black"
              style={{ fill: "none", stroke: "black" }}
            />
          </marker>
          <marker
            id="archimate-open-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="black" />
          </marker>
          <marker
            id="archimate-filled-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="12"
            markerHeight="12"
            orient="auto"
          >
            <polygon points="1,1 9,5 1,9" fill="black" stroke="black" />
          </marker>
          <marker
            id="archimate-hollow-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="12"
            markerHeight="12"
            orient="auto"
          >
            <polygon points="1,1 9,5 1,9" fill="white" stroke="black" />
          </marker>
          <marker
            id="archimate-filled-diamond"
            viewBox="0 0 10 10"
            refX="1"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="12"
            markerHeight="12"
            orient="auto"
          >
            <polygon points="5,2.5 9,5 5,7.5 1,5" fill="black" stroke="black" />
          </marker>
          <marker
            id="archimate-hollow-diamond"
            viewBox="0 0 10 10"
            refX="1"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="13"
            markerHeight="13"
            orient="auto"
          >
            <polygon points="5,2.5 9,5 5,7.5 1,5" fill="white" stroke="black" />
          </marker>
        </defs>
      </svg>
    );
  }

  public componentDidMount() {
    if (this.props.svgRefCallback) {
      this.props.svgRefCallback(this.svg);
    }
  }

  public componentWillUnmount() {
    this.svg = undefined;
    if (this.props.svgRefCallback) {
      this.props.svgRefCallback(this.svg);
    }
  }
}
