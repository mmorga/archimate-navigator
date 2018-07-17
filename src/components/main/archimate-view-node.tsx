import * as React from "react";
import { Bounds, IEntity, Layer, ViewNode, zeroBounds } from "../../archimate-model";
import EntityLabel from "./entity-label";

interface IProps {
  viewNode: ViewNode;
}

interface IState {
  badge?: string;
  badgeBounds?: Bounds;
  backgroundClass?: string;

  entity?: IEntity | undefined;
  entityLabelFunc?: () => string | undefined;
  entityShapeFunc?: () => React.ReactFragment;
  textAlign?: string;
  textBounds?: Bounds;
  margin?: number;
}

class MergedState implements IState {
  public badge?: string;
  public badgeBounds?: Bounds;
  public backgroundClass?: string;
  public entity?: IEntity | undefined;
  public entityLabelFunc?: () => string | undefined;
  public entityShapeFunc?: () => React.ReactFragment;
  public textAlign?: string;
  public textBounds?: Bounds;
  public margin?: number;

  constructor(s: IState) {
    this.backgroundClass = s.backgroundClass;
    this.badge = s.badge;
    this.badgeBounds = s.badgeBounds;
    this.entity = s.entity;
    this.entityLabelFunc = s.entityLabelFunc;
    this.entityShapeFunc = s.entityShapeFunc;
    this.margin = s.margin;
    this.textAlign = s.textAlign;
    this.textBounds = s.textBounds;
  }

  public with(s: IState): MergedState {
    return new MergedState({
      backgroundClass: s.backgroundClass || this.backgroundClass,
      badge: s.badge || this.badge,
      badgeBounds: s.badgeBounds || this.badgeBounds,
      entity: s.entity || this.entity,
      entityLabelFunc: s.entityLabelFunc || this.entityLabelFunc,
      entityShapeFunc: s.entityShapeFunc || this.entityShapeFunc,
      margin: s.margin || this.margin,
      textAlign: s.textAlign || this.textAlign,
      textBounds: s.textBounds || this.textBounds,
    });
  }
}

interface IGAttrs {
  id: string;
  className?: string;
}

// tslint:disable-next-line:max-classes-per-file
export default class ArchimateViewNode extends React.PureComponent<IProps, IState> {
  private groupHeaderHeight = 21;

  constructor(props: IProps) {
    super(props);
    this.state = this.stateForViewNode();
  }

  public render() {
    return (
      <g{...this.groupAttrs()}>
        {this.title()}
        {this.desc()}
        {this.entityShape()}
        {this.entityBadge()}
        {this.entityLabel()}
      </g>
    );
  }

  public defaultBackgroundClass(): string {
    switch(this.elementType()) {
    case "BusinessActor":
    case "BusinessCollaboration":
    case "BusinessEvent":
    case "BusinessFunction":
    case "BusinessInteraction":
    case "BusinessInterface":
    case "BusinessObject":
    case "BusinessProcess":
    case "BusinessRole":
    case "BusinessService":
    case "Contract":
    case "Location":
    case "Product":
    case "Representation":
      return Layer.Business;
    case "ApplicationCollaboration":
    case "ApplicationComponent":
    case "ApplicationEvent":
    case "ApplicationFunction":
    case "ApplicationInteraction":
    case "ApplicationInterface":
    case "ApplicationProcess":
    case "ApplicationService":
    case "DataObject":
      return Layer.Application;
    case "Artifact":
    case "CommunicationNetwork":
    case "CommunicationPath":
    case "Device":
    case "InfrastructureFunction":
    case "InfrastructureInterface":
    case "InfrastructureService":
    case "Network":
    case "Node":
    case "Path":
    case "SystemSoftware":
    case "TechnologyCollaboration":
    case "TechnologyEvent":
    case "TechnologyFunction":
    case "TechnologyInteraction":
    case "TechnologyInterface":
    case "TechnologyObject":
    case "TechnologyProcess":
    case "TechnologyService":
      return Layer.Technology;
    case "DistributionNetwork":
    case "Equipment":
    case "Facility":
    case "Material":
      return Layer.Physical;
    case "Assessment":
    case "Constraint":
    case "Driver":
    case "Goal":
    case "Meaning":
    case "Outcome":
    case "Principle":
    case "Requirement":
    case "Stakeholder":
    case "Value":
      return Layer.Motivation;
    case "Deliverable":
    case "Gap":
    case "ImplementationEvent":
    case "Plateau":
    case "WorkPackage":
      return Layer.ImplementationAndMigration;
    case "AndJunction":
    case "Junction":
    case "OrJunction":
      return Layer.Connectors;
    case "Capability":
    case "CourseOfAction":
    case "Resource":
      return Layer.Strategy;
    case "Grouping":
    case "Group":
    default:
      return Layer.Other;
    }
  }

  public stateForViewNode(): IState {
    const defaultState = new MergedState({
      backgroundClass: this.defaultBackgroundClass(),
      entity: this.props.viewNode.elementInstance(),
      entityLabelFunc: this.label,
      entityShapeFunc: this.rectPath,
      textBounds: this.defaultTextBounds(),
    });

    const badgedRect = defaultState.with({
      badgeBounds: this.rectBadgeBounds(),
      entityShapeFunc: this.rectPath,
    });

    const badgedRoundedRect = defaultState.with({
      badgeBounds: this.roundedRectBadgeBounds(),
      entityShapeFunc: this.roundedRectPath,
    });

    const badgedMotivation = defaultState.with({
      badgeBounds: this.motivationBadgeBounds(),
      entityShapeFunc: this.motivationPath,
    });

    const badgedNode = defaultState.with({
      badgeBounds: this.nodeBadgeBounds(),
      entityShapeFunc: this.nodePath,
      margin: 14,
    });

    const noteState = defaultState.with({
      backgroundClass: "archimate-note-background",
      entityShapeFunc: this.notePath,
      textAlign: "left",
      textBounds: this.props.viewNode.bounds.reducedBy(3),
    });

    switch(this.elementType()) {
      case "AndJunction": 
        return defaultState.with({
          backgroundClass: "archimate-junction-background", 
          entityLabelFunc: () => undefined,
        });
      case "ApplicationCollaboration":
      case "TechnologyCollaboration":
        return badgedRect.with({ badge: "#archimate-collaboration-badge" });
      case "ApplicationComponent":
        if (this.props.viewNode.childType === "1") {
          return badgedRect.with({ badge: "#archimate-app-component-badge" });
        } else {
          return defaultState.with({
            entityShapeFunc: this.componentPath,
            textBounds: this.componentTextBounds(),
          });
        }
      case "ApplicationEvent":
      case "BusinessEvent":
      case "TechnologyEvent":
        if (this.props.viewNode.childType === "1") {
          return badgedRoundedRect.with({ badge: "#archimate-event-badge" });
        } else {
          return defaultState.with({ entityShapeFunc: this.eventPath });
        }
      case "ApplicationFunction":
      case "BusinessFunction":
      case "TechnologyFunction":
        return badgedRoundedRect.with({ badge: "#archimate-function-badge" });
      case "ApplicationInteraction":
      case "BusinessInteraction":
      case "TechnologyInteraction":
        return badgedRoundedRect.with({ badge: "#archimate-interaction-badge" });
      case "ApplicationInterface":
      case "BusinessInterface":
      case "TechnologyInterface":
        if (this.props.viewNode.childType === "1") {
          return defaultState.with({ entityShapeFunc: this.elipsePath });
        } else {
          return badgedRect.with({ badge: "#archimate-interface-badge" });
        }
      case "ApplicationProcess":
      case "BusinessProcess":
      case "TechnologyProcess":
        if (this.props.viewNode.childType === "1") {
          return defaultState.with({ entityShapeFunc: this.processPath });
        } else {
          return badgedRoundedRect.with({ badge: "#archimate-process-badge" });
        }
      case "ApplicationService":
      case "BusinessService":
      case "TechnologyService":
        if (this.props.viewNode.childType === "1") {
          return defaultState.with({
            entityShapeFunc: this.servicePath,
            textBounds: this.serviceBounds(),
          });
        } else {
          return badgedRoundedRect.with({ badge: "#archimate-service-badge" });
        }
      case "Artifact":
        return defaultState.with({
          badge: "archimate-artifact-badge",
          entityShapeFunc: this.artifactPath,
        });
      case "Assessment":
        return badgedMotivation.with({ badge: "#archimate-assessment-badge" });
      case "BusinessActor":
        return badgedRect.with({ badge: "#archimate-actor-badge" });
      case "BusinessCollaboration":
        return badgedRect.with({ badge: "#archimate-collaboration-badge" });
      case "BusinessObject":
      case "DataObject":
        return defaultState.with({
          entityShapeFunc: this.dataPath,
          margin: 8,
          textBounds: this.dataTextBounds(),
        });
      case "Deliverable":
        return defaultState.with({ entityShapeFunc: this.representationPath });
      case "Device":
        if (this.props.viewNode.childType === "1") {
          return badgedNode.with({ badge: "#archimate-device-badge" });
        } else {
          return defaultState.with({ entityShapeFunc: this.devicePath });
        }
      case "DiagramModelReference":
        return defaultState.with({
          backgroundClass: "archimate-diagram-model-reference-background",
          badge: "#archimate-diagram-model-reference-badge",
          // optionalLinkFunc: this.diagramOptionalLink,
        });
      case "DistributionNetwork":
        return badgedRect.with({ badge: "#archimate-distribution-network-badge" });
      case "Driver":
        return badgedMotivation.with({ badge: "#archimate-driver-badge" });
      case "Group":
      case "Grouping":
        const bounds = this.props.viewNode.bounds;
        return defaultState.with({
          backgroundClass: "archimate-group-background",
          entityShapeFunc: this.groupingPath,
          textAlign: "left",      
          textBounds: new Bounds(bounds.left() + 3, bounds.top(), (bounds.width / 2.0) - 6, this.groupHeaderHeight),
        });
      case "Location":
        return badgedRect.with({ 
          backgroundClass: "archimate-location-background",
          badge: "#archimate-location-badge",
        });
      case "Network":
        return badgedRect.with({ badge: "#archimate-network-badge" });
      case "Node":
        if (this.props.viewNode.childType === "1") {
          return badgedNode.with({ badge: "#archimate-node-badge" });
        } else {
          return defaultState.with({ entityShapeFunc: this.devicePath });
        }
      case "DiagramObject":
      case "Note":
        return noteState;
      case "OrJunction":
        return defaultState.with({
          backgroundClass: "archimate-or-junction-background",
          entityLabelFunc: () => undefined,
        });
      case "Outcome":
        return badgedMotivation.with({ badge: "#archimate-outcome-badge" });
      case "Path":
        return badgedRect.with({ badge: "#archimate-communication-path-badge" });
      case "Plateau":
        if (this.props.viewNode.childType === "1") {
          return badgedNode.with({
            backgroundClass: "archimate-implementation2-background",
            badge: "#archimate-plateau-badge",
          });
        } else {
          return defaultState.with({
            backgroundClass: "archimate-implementation2-background",
            entityShapeFunc: this.devicePath,
          });
        }
      case "Principal":
        return badgedMotivation.with({ badge: "#archimate-principal-badge" });
      case "Product":
        return defaultState.with({ entityShapeFunc: this.productPath });
      case "Requirement":
        return badgedMotivation.with({ badge: "#archimate-requirement-badge" });
      case "Resource":
        return badgedRect.with({ badge: "#archimate-resource-badge" });
      case "SketchModelSticky":
        return defaultState.with({
          backgroundClass: "archimate-sticky-background",
          entityShapeFunc: this.rectPath,
        });
      case "Stakeholder":
        return badgedMotivation.with({ badge: "#archimate-role-badge" });
      case "SystemSoftware":
        return badgedRect.with({ badge: "#archimate-system-software-badge" });
      case "Value":
        return defaultState.with({
          entityShapeFunc: this.valuePath,
          textBounds: this.valueTextBounds(),
        });
      default:
        return defaultState;
    }
  }

  public groupAttrs(): IGAttrs {
    const attrs: IGAttrs = { id: this.props.viewNode.id,  };
    if (this.props.viewNode.type && this.props.viewNode.type.length > 0) {
      attrs.className = `archimate-${this.elementType()}`;
    }
    return attrs;
  }

  public elementType(): string {
    const elInst = this.props.viewNode.elementInstance();
    if (elInst) {
      return elInst.type;
    } else {
      return this.props.viewNode.type;
    }
  }

  public title() {
    if (this.props.viewNode.name && this.props.viewNode.name.length > 0) {
      return (<title>{this.props.viewNode.name}</title>);
    } else {
      return undefined;
    }
  }

  public desc() {
    if (this.props.viewNode.documentation) {
      return (<desc>{this.props.viewNode.documentation}</desc>);
    } else {
      return undefined;
    }
  }

  public entityShape() {
    if (this.state.entityShapeFunc) {
      return this.state.entityShapeFunc.bind(this)();
    }
    return this.rectPath();
  }

  public backgroundClass() {
    return this.state.backgroundClass || "archimate-none-background";
  }

  public shapeStyle() {
    return {};
  }

  public entityBadge() {
    if (this.state.badge === undefined) {
      return undefined;
    }
    return (
      <use 
        href={this.state.badge}
        {...this.state.badgeBounds}
        />
    );
  }
  
  public entityLabel() {
    const badgeBounds = zeroBounds(); // this.props.viewNode.badge ? DataModel::Bounds.new(x: 0, y: 0, width: 20, height: 20) : DataModel::Bounds.zero
    const optLabel = this.label();
    if (optLabel === undefined) {
      return undefined;
    }
    const label = optLabel as string;
    return (
      <EntityLabel 
          child={this.props.viewNode}
          label={label}
          textBounds={this.state.textBounds || (this.props.viewNode.bounds).reducedBy(2)}
          textAlign={this.state.textAlign}
          badgeBounds={badgeBounds}
          />
    );
  }

  public label() {
    if (this.props.viewNode.content && (this.props.viewNode.content.length > 0)) {
      return this.props.viewNode.content;
    }
    if (this.props.viewNode.name && (this.props.viewNode.name.length > 0)) {
      return this.props.viewNode.name;
    }
    const el = this.props.viewNode.elementInstance();
    if (el === undefined) {
      return undefined;
    }
    return el.name;
  }

  private motivationBadgeBounds(): Bounds {
    const bounds = this.props.viewNode.bounds;
    return new Bounds(bounds.right() - 25, bounds.top() + 5, 20, 20);
  }

  private nodeBadgeBounds(): Bounds {
    const bounds = this.props.viewNode.bounds;
    const margin = 14;
    return new Bounds(
      bounds.right() - margin - 25,
      bounds.top() + margin + 5,
      20,
      20
    );
  }

  private rectBadgeBounds() {
    const bounds = this.props.viewNode.bounds;
    return new Bounds(bounds.right() - 25, bounds.top() + 5, 20, 20);
  }

  private roundedRectBadgeBounds() {
    const bounds = this.props.viewNode.bounds;
    return new Bounds(
      bounds.right() - 25,
      bounds.top() + 5,
      20,
      20
    );
  }

  private rectPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} className={this.backgroundClass()} style={this.shapeStyle()}/>
    );
  }

  private componentDecoration(left: number, top: number) {
    return (
      <React.Fragment>
        <rect x={left} y={top} width="21" height="13" className={this.state.backgroundClass} style={this.shapeStyle()} />
        <rect x={left} y={top} width="21" height="13" className="archimate-decoration" />
      </React.Fragment>
    );
  }

  private componentTextBounds(): Bounds {
    const bounds = this.props.viewNode.bounds;
    const mainBoxX = bounds.left() + 21.0 / 2;
    return new Bounds(mainBoxX + 21 / 2, bounds.top() + 1, bounds.width - 22, bounds.height - 2);
  }

  private componentPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const mainBoxX = bounds.left() + 21.0 / 2;
    const mainBoxWidth = bounds.width - 21 / 2;
    // this.setState({textBounds: new Bounds(mainBoxX + 21 / 2, bounds.top() + 1, bounds.width - 22, bounds.height - 2)});
    return (
      <React.Fragment>
        <rect x={mainBoxX} y={bounds.top()} width={mainBoxWidth} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()} />
        {this.componentDecoration(bounds.left(), bounds.top() + 10)}
        {this.componentDecoration(bounds.left(), bounds.top() + 30)}
      </React.Fragment>
    );
  }

  private eventPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const notchX = 18;
    const notchHeight = bounds.height / 2.0;
    const eventWidth = bounds.width * 0.85;
    const rx = 17;
    const textBounds = this.defaultTextBounds();
    this.setState({textBounds: new Bounds(textBounds.left() + notchX * 0.8, textBounds.top(), textBounds.width - notchX, textBounds.height)});
    const d = [
        "M", bounds.left, bounds.top,
        "l", notchX, notchHeight,
        "l", -notchX, notchHeight,
        "h", eventWidth,
        "a", rx, notchHeight, 0, 0, 0, 0, -bounds.height,
        "z"
      ].join(" ");
    return (
      <path d={ d } className={this.state.backgroundClass} style={this.shapeStyle()} />
    );
  }

  private defaultTextBounds() {
    return this.props.viewNode.bounds.reducedBy(2);
  }

  private roundedRectPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <rect x={bounds.left()} y={bounds.top()} width={bounds.width} height={bounds.height} rx={"5"} ry={"5"} className={this.state.backgroundClass} />
    );
  }

  private elipsePath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <ellipse
        cx={bounds.left() + bounds.width / 2.0}
        cy={bounds.top() + bounds.height / 2.0}
        rx={bounds.width / 2.0}
        ry={bounds.height / 2.0}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }

  private processPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const top = bounds.top();
    const shaftTop = bounds.top() + bounds.height * 0.15;
    const middle = bounds.top() + bounds.height * 0.5;
    const shaftBottom = bounds.bottom() - bounds.height * 0.15;
    const bottom = bounds.bottom();

    const left = bounds.left();
    const arrowBack = bounds.right() - bounds.height * 0.5;
    const right = bounds.right();

    const textBounds = new Bounds(left, shaftTop, bounds.width - bounds.height * 0.25, shaftBottom - shaftTop);
    this.setState({textBounds: textBounds.reducedBy(2)});

    return (
      <path
        d={[
          "M", left, shaftTop,
          "L", arrowBack, shaftTop,
          "L", arrowBack, top,
          "L", right, middle,
          "L", arrowBack, bottom,
          "L", arrowBack, shaftBottom,
          "L", left, shaftBottom,
          "z"
        ].join(" ")}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
        />
    );
  }

  private serviceBounds(): Bounds {
    const bounds = this.props.viewNode.bounds;
    return new Bounds(
      bounds.left() + 7,
      bounds.top() + 5,
      bounds.width - 14,
      bounds.height - 10
    );
  }

  private servicePath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <rect
        x={bounds.left()}
        y={bounds.top()}
        width={bounds.width}
        height={bounds.height}
        rx={bounds.height / 2.0}
        ry={bounds.height / 2.0}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }

  private artifactPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const margin = 18;
    return (
      <g className={this.state.backgroundClass} style={this.shapeStyle()}>
        <path 
          d={[
              "M", bounds.left(), bounds.top(),
              "h", bounds.width - margin,
              "l", margin, margin,
              "v", bounds.height - margin,
              "h", -bounds.width,
              "z"
            ].join(" ")}
        />
        <path 
          d={[
              "M", bounds.right() - margin, bounds.top(),
              "v", margin,
              "h", margin,
              "z"
            ].join(" ")}
          className="archimate-decoration"
        />
      </g>
    );
  }

  private motivationPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const margin = 10;
    const width = bounds.width - margin * 2;
    const height = bounds.height - margin * 2;
    return (
      <path
        d={[
            "M", bounds.left() + margin, bounds.top(),
            "h", width,
            "l", margin, margin,
            "v", height,
            "l", -margin, margin,
            "h", -width,
            "l", -margin, -margin,
            "v", -height,
            "z"
          ].join(" ")}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }

  private dataTextBounds() {
    const textBounds = this.defaultTextBounds();
    const margin: number = 8;
    return new Bounds(textBounds.left(), textBounds.top() + margin, textBounds.width, textBounds.height - margin);
  }

  private dataPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <g className={this.state.backgroundClass}>
        <rect key="data-background" x={bounds.left()} y={bounds.top()} width={bounds.width} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()} />
        <rect key="data-decoration" x={bounds.left()} y={bounds.top()} width={bounds.width} height={this.state.margin} className="archimate-decoration" />
      </g>
    );
  }

  private representationPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <path
          d={[
              "M", bounds.left, bounds.top,
              "v", bounds.height - 8,
              "c", 0.167 * bounds.width, 0.133 * bounds.height,
              0.336 * bounds.width, 0.133 * bounds.height,
              bounds.width * 0.508, 0,
              "c", 0.0161 * bounds.width, -0.0778 * bounds.height,
              0.322 * bounds.width, -0.0778 * bounds.height,
              bounds.width * 0.475, 0,
              "v", -(bounds.height - 8),
              "z"
            ].join(" ")}
          className={this.state.backgroundClass}
          style={this.shapeStyle()}
      />
    );
  }

  private devicePath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const margin = 10;
    const decorationPath = [
      "M", bounds.left() + margin, bounds.bottom() - margin,
      "l", -margin, margin,
      "h", bounds.width,
      "l", -margin, -margin,
      "z"
    ].join(" ");
  
    return (
      <React.Fragment>
        <rect
          x={bounds.left()}
          y={bounds.top()}
          width={bounds.width}
          height={bounds.height - margin}
          rx={"6"}
          ry={"6"}
          className={this.state.backgroundClass}
          style={this.shapeStyle()}
        />
        <path d={decorationPath} className={this.state.backgroundClass} style={this.shapeStyle()} />
        <path d={decorationPath} className="archimate-decoration" style={this.shapeStyle()} />
      </React.Fragment> 
    );
  }

  private nodePath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const margin = this.state.margin || 14;
    const nodeBoxHeight = bounds.height - margin;
    const nodeBoxWidth = bounds.width - margin;
    this.setState({
      textBounds: new Bounds(bounds.left() + 1, bounds.top() + margin + 1, nodeBoxWidth - 2, nodeBoxHeight - 2),
    });
    return (
      <g className={this.state.backgroundClass} style={this.shapeStyle()}>
        <path 
          d={[
              "M", bounds.left, bounds.bottom,
              "v", -nodeBoxHeight,
              "l", margin, -margin,
              "h", nodeBoxWidth,
              "v", nodeBoxHeight,
              "l", -margin, margin,
              "z"
            ].join(" ")}
        />
        <path 
          d={[
              "M", bounds.left(), bounds.top() + margin,
              "l", margin, -margin,
              "h", nodeBoxWidth,
              "v", nodeBoxHeight,
              "l", -margin, margin,
              "v", -nodeBoxHeight,
              "z",
              "M", bounds.right(), bounds.top(),
              "l", -margin, margin
            ].join(" ")}
          className="archimate-decoration"
        />
        <path 
          d={[
              "M", bounds.left, bounds.top() + margin,
              "h", nodeBoxWidth,
              "l", margin, -margin,
              "M", bounds.left() + nodeBoxWidth, bounds.bottom(),
              "v", -nodeBoxHeight
            ].join(" ")}
          style={{fill:"none",stroke:"inherit"}}
        />
      </g>
    );
  }

  // private diagramOptionalLink(): 
  //   xml.a(href: "#{@entity.id}.svg") do
  //     block.call
  //   end
  // }

  private notePath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <path
        d={[
            "m", bounds.left(), bounds.top(),
            "h", bounds.width,
            "v", bounds.height - 8,
            "l", -8, 8,
            "h", -(bounds.width - 8),
            "z"
          ].join(" ")}
        className={this.state.backgroundClass} 
        style={this.shapeStyle()}
      />
    );
  }

  private productPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <g className={this.state.backgroundClass}>
        <rect x={bounds.left()} y={bounds.top()} width={bounds.width} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()} />
        <rect x={bounds.left()} y={bounds.top()} width={bounds.width / 2.0} height="8" className="archimate-decoration" />
      </g>
    );
  }

  private valueTextBounds(): Bounds {
    const textBounds = this.defaultTextBounds();
    return new Bounds(
      textBounds.left() + 10,
      textBounds.top() + 10,
      textBounds.width - 20,
      textBounds.height - 20
    );
  }

  private valuePath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    const cx = bounds.left() + bounds.width / 2.0;
    const rx = bounds.width / 2.0 - 1;
    const cy = bounds.top() + bounds.height / 2.0;
    const ry = bounds.height / 2.0 - 1;
    return (
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className={this.state.backgroundClass} style={this.shapeStyle()} />
    );
  }

  private groupingPath(): React.ReactFragment {
    const bounds = this.props.viewNode.bounds;
    return (
      <React.Fragment>
        <rect
            x={bounds.left()}
            y={bounds.top() + this.groupHeaderHeight}
            width={bounds.width}
            height={bounds.height - this.groupHeaderHeight}
            className={this.state.backgroundClass}
            style={this.shapeStyle()}
        />
        <rect 
            x={bounds.left()}
            y={bounds.top()}
            width={bounds.width / 2.0}
            height={this.groupHeaderHeight}
            className={this.state.backgroundClass}
            style={this.shapeStyle()}
        />
        <rect 
            x={bounds.left()}
            y={bounds.top()}
            width={bounds.width / 2.0}
            height={this.groupHeaderHeight}
            className={"archimate-decoration"}
        />)
      </React.Fragment>
    );
  }
}
