import { TextAlignProperty } from "csstype";
import * as React from "react";
import { Bounds, IEntity, Layer, ViewNode, zeroBounds } from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLabel from "../entity-label";
import SelectedViewNode from "../selected-view-node";

export interface IViewNodeProps {
  viewNode: ViewNode;
  onClicked?: entityClickedFunc;
  selected: boolean;
}

export interface IViewNodeState {
  badge?: string;
  badgeBounds?: Bounds;
  backgroundClass?: string;
  bounds: Bounds,
  entity?: IEntity | undefined;
  textAlign?: TextAlignProperty;
  textBounds: Bounds;
  margin?: number;
}

export default class DefaultViewNode extends React.PureComponent<IViewNodeProps, IViewNodeState> {

  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      backgroundClass: this.defaultBackgroundClass(),
      badge: undefined,
      badgeBounds: undefined,
      bounds: this.props.viewNode.curBounds(),
      entity: this.props.viewNode.entityInstance(),
      margin: 8,
      textAlign: "center",
      textBounds: this.props.viewNode.curBounds().reducedBy(2),
    }
  }

  public render() {
    return (
      <g {...this.groupAttrs()}>
        {this.title()}
        {this.desc()}
        {this.entityShape()}
        {this.entityBadge()}
        {this.entityLabel()}
        {this.selectedHighlight()}
      </g>
    );
  }

  protected groupAttrs(): React.SVGProps<SVGGElement> {
    const attrs: React.SVGProps<SVGGElement> = { id: this.props.viewNode.id,  };
    if (this.props.viewNode.type && this.props.viewNode.type.length > 0) {
      attrs.className = `archimate-${this.elementType()}`;
    }
    if (this.props.onClicked) {
      attrs.onClick = this.props.onClicked.bind(this, this.props.viewNode.entityInstance());
    }
    return attrs;
  }

  protected title() {
    if (this.props.viewNode.name && this.props.viewNode.name.length > 0) {
      return (<title>{this.props.viewNode.name}</title>);
    } else {
      return undefined;
    }
  }

  protected desc() {
    if (this.props.viewNode.documentation) {
      return (<desc>{this.props.viewNode.documentation}</desc>);
    } else {
      return undefined;
    }
  }

  protected entityShape() {
    const bounds = this.props.viewNode.curBounds();
    return (
      <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()}/>
    );
  }

  protected shapeStyle(): React.CSSProperties {
    const style = this.props.viewNode.style;
    if (style === undefined) {
      return {};
    }
    const cssStyle: React.CSSProperties = {};
    if (style.fillColor) { cssStyle.fill = style.fillColor.toRGBA() }
    if (style.lineColor) { cssStyle.stroke = style.lineColor.toRGBA() }
    if (style.lineWidth) { cssStyle.strokeWidth = style.lineWidth }
    return cssStyle;
  }

  protected entityBadge() {
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
  
  protected entityLabel() {
    const optLabel = this.label();
    if (optLabel === undefined) {
      return undefined;
    }
    const label = optLabel as string;
    return (
      <EntityLabel 
          child={this.props.viewNode}
          label={label}
          textBounds={this.state.textBounds || (this.props.viewNode.curBounds()).reducedBy(2)}
          textAlign={this.state.textAlign}
          badgeBounds={this.state.badgeBounds || zeroBounds()}
          />
    );
  }

  protected selectedHighlight(): React.ReactFragment | undefined {
    if (this.props.selected) {
      return <SelectedViewNode bounds={this.props.viewNode.curBounds()} />;
    } else {
      return undefined;
    }
  }

  protected label(): string | undefined {
    if (this.props.viewNode.content && (this.props.viewNode.content.length > 0)) {
      return this.props.viewNode.content;
    }
    if (this.props.viewNode.name && (this.props.viewNode.name.length > 0)) {
      return this.props.viewNode.name;
    }
    const el = this.props.viewNode.entityInstance();
    if (el === undefined) {
      return undefined;
    }
    return el.name;
  }

  protected defaultBackgroundClass(): string {
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

  protected elementType(): string {
    const elInst = this.props.viewNode.entityInstance();
    if (elInst) {
      return elInst.type;
    } else {
      return this.props.viewNode.type;
    }
  }
}