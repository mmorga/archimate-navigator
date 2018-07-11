import { INode, ParentGroupType, SelectionType } from "./graph-visualization";

export default class GraphNodes {
    private svg: ParentGroupType;
    private nodeHeight: number;
    private nodeWidth: number;

    constructor(svg: ParentGroupType, nodeWidth: number, nodeHeight: number) {
        this.svg = svg;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
    }

    public transformSelection(sel: ParentGroupType): void {
        this.svg = sel;
    }

    /**
     * Updates the nodes for each tick of the D3 Force simulation
     */
    public updateNodes(nodes: INode[]): void {
        // tslint:disable-next-line:variable-name
        const nodesFunc = function(this: SVGGElement, _datum: undefined, _index: number, _groups: SVGGElement[] | ArrayLike<SVGGElement>) {
            return nodes;
        }
        
        // tslint:disable-next-line:variable-name
        const idFunc = function(this: SVGGElement, datum: INode, _index: number, _groups: SVGGElement[] | ArrayLike<SVGGElement>) {
            return datum.id;
        }
        // Update…
        const g = this.svg.selectAll<SVGGElement, INode>("g")
            .data<INode>(nodesFunc, idFunc)
            .attr("transform", this.translate);

        // Enter…
        g.enter().append<SVGGElement>("g")
            .attr("id", (d: INode) => d.nodeId)
            .attr("class", (d: INode) => `node archimate-${d.nodeType}`)
            .attr("transform", this.translate)
            .call(this.title)
            .call(this.nodeRect)
            .call(this.nodeBadge)
            .call(this.nodeLabel);

        // Exit…
        g.exit().remove();
    }

    private translate = (d: INode): string => {
        return `translate(${(d.x || 0) - (this.nodeWidth / 2)},${(d.y || 0) - (this.nodeHeight / 2)})`;
    }

    /**
     * Appends an SVG title element to a node
     */
    private title = (selection: SelectionType): void => {
        selection
            .append("title")
            .text((d: INode) => d.name);
    }

    /**
     * Used to put together the SVG representation of a node
     */
    private nodeRect = (selection: SelectionType): void => {
        selection.append("svg:use")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.nodeWidth)
            .attr("height", this.nodeHeight)
            .attr("xlink:href", this.nodeShapeUri)
            .attr("class", this.nodeClass);
    }

    /**
     * Returns the URI (refering to an SVG symbol) for the node's shape
     * based on the type of the node.
     *
     * The symbols are defined in the base SVG '_layouts/archimate-blank.svg'
     */
    private nodeShapeUri = (d: INode): string => {
        switch (d.nodeType) {
        case "BusinessActor":
        case "BusinessRole":
        case "BusinessCollaboration":
        case "BusinessInterface":
        case "ApplicationCollaboration":
        case "ApplicationInterface":
        case "Location":
        case "SystemSoftware":
        case "Network":
        case "CommunicationPath":
            return "#archimate-rect-shape";
        case "BusinessProcess":
        case "BusinessFunction":
        case "BusinessInteraction":
        case "ApplicationFunction":
        case "ApplicationInteraction":
        case "ApplicationProcess":
        case "InfrastructureFunction":
        case "TechnologyFunction":
        case "WorkPackage":
            return "#archimate-rounded-rect-shape";
        case "ApplicationComponent":
            return "#archimate-component-shape";
        case "BusinessEvent":
        case "ApplicationEvent":
        case "TechnologyEvent":
            return "#archimate-event-shape";
        case "BusinessObject":
        case "DataObject":
        case "TechnologyObject":
            return "#archimate-object-shape";
        case "Contract":
            return "#archimate-contract-shape";
        case "Product":
            return "#archimate-product-shape";
        case "BusinessService":
        case "ApplicationService":
        case "TechnologyService":
        case "InfrastructureService":
            return "#archimate-service-shape";
        case "Value":
            return "#archimate-value-shape";
        case "Representation":
        case "Deliverable":
        case "Gap":
            return "#archimate-representation-shape";
        case "Meaning":
            return "#archimate-meaning-shape";
        case "Artifact":
            return "#archimate-artifact-shape";
        case "Stakeholder":
        case "Driver":
        case "Assessment":
        case "Goal":
        case "Principle":
        case "Requirement":
        case "Constraint":
            return "#archimate-motivation-shape";
        case "Plateau":
        case "Device":
        case "INode":
            return "#archimate-node-shape";
        default:
            // console.log(`No shape for type ${d.nodeType}`);
            return "#archimate-rect-shape";
        }
    }

    /**
     * Returns the class for the shape of a node based on the node's type
     */
    private nodeClass = (d: INode) => {
        switch (d.nodeType) {
        case "Principle":
        case "Requirement":
        case "Constraint":
            return "archimate-motivation2-background";
        case "Plateau":
        case "Gap":
            return "archimate-implementationandmigration2-background";
        default:
            return `archimate-${d.layer.toLowerCase()}-background`;
        }
    }

    /**
     * Adds the badge for an ArchiMate element to the given selection (as part of building the SVG representation)
     *
     * @param {SelectionType} selection D3 selection object to add the badge to.
     */
    private nodeBadge = (selection: SelectionType): void => {
        selection.append("svg:use")
            .attr("x", this.badgeX)
            .attr("y", this.badgeY)
            .attr("width", 20)
            .attr("height", 20)
            .attr("xlink:href", (d: INode) => this.badgeUri(d.nodeType));
    }

    /**
     * Returns the x position of the badge in the SVG
     *
     * @param {INode} d ArchiMate INode D3 data object
     * @return {number} Numeric x-offset for the badge
     */
    private badgeX = (d: INode): number => {
        switch (d.nodeType) {
        case "Plateau":
        case "Device":
            return 90;
        default:
            return 95;
        }
    }

    /**
     * Returns the y position of the badge in the SVG
     *
     * @param {INode} d ArchiMate INode D3 data object
     * @return {number} Numeric y-offset for the badge
     */
    private badgeY = (d: INode): number => {
        switch (d.nodeType) {
        case "Plateau":
        case "Device":
            return 10;
        default:
            return 5;
        }
    }

    /**
     * Returns the relative badge URI for a given INode Type
     *
     * @param {string} nodeType ArchiMate type of the node, ex: 'BusinessActor'
     * @return {string} relative URI. These are contained in the blank SVG in '_layouts/archimate-blank.svg'
     */
    private badgeUri = (nodeType: string): string => {
        switch (nodeType) {
        case "ApplicationComponent":
            return "#archimate-component-badge";
        case "Material":
            return "#archimate-material-badge";
        case "DistributionNetwork":
            return "#archimate-distribution-network-badge";
        case "Facility":
            return "#archimate-facility-badge";
        case "Equipment":
            return "#archimate-equipment-badge";
        case "Resource":
            return "#archimate-resource-badge";
        case "Outcome":
            return "#archimate-outcome-badge";
        case "CourseOfAction":
            return "#archimate-course-of-action-badge";
        case "Capability":
            return "#archimate-capability-badge";
        case "DiagramModelReference":
            return "#archimate-diagram-model-reference-badge";
        case "BusinessActor":
            return "#archimate-actor-badge";
        case "Assessment":
            return "#archimate-assessment-badge";
        case "ApplicationCollaboration":
        case "BusinessCollaboration":
        case "TechnologyCollaboration":
            return "#archimate-collaboration-badge";
        case "CommunicationNetwork":
            return "#archimate-communication-badge";
        case "Constraint":
            return "#archimate-constraint-badge";
        case "Device":
            return "#archimate-device-badge";
        case "Driver":
            return "#archimate-driver-badge";
        case "BusinessFunction":
        case "ApplicationFunction":
        case "TechnologyFunction":
            return "#archimate-function-badge";
        case "Gap":
            return "#archimate-gap-badge";
        case "Goal":
            return "#archimate-goal-badge";
        case "BusinessInteraction":
        case "ApplicationInteraction":
        case "TechnologyInteraction":
            return "#archimate-interaction-badge";
        case "BusinessInterface":
        case "ApplicationInterface":
        case "TechnologyInterface":
            return "#archimate-interface-badge";
        case "Location":
            return "#archimate-location-badge";
        case "DistributionNetwork":
        case "Network":
            return "#archimate-network-badge";
            // case 'INode':
            //     return '#archimate-node-badge';
        case "Plateau":
            return "#archimate-plateau-badge";
        case "Principle":
            return "#archimate-principle-badge";
        case "BusinessProcess":
        case "ApplicationProcess":
        case "TechnologyProcess":
            return "#archimate-process-badge";
        case "Requirement":
            return "#archimate-requirement-badge";
        case "BusinessRole":
            return "#archimate-role-badge";
            // case 'BusinessService':
            // case 'ApplicationService':
            // case 'TechnologyService':
            //     return '#archimate-service-badge';
        case "SystemSoftware":
            return "#archimate-system-software-badge";
        default:
            // console.log(`No badge for type ${nodeType}`)
            return "#archimate-no-badge";
        }
    }

    /**
     * Adds the label for a node to the SVG item identified by the selection.
     */
    private nodeLabel = (selection: SelectionType): void => {
        selection
            .append("text")
            .attr("class", "unflowed-text")
            .attr("x", "63")
            .attr("y", "35")
            .attr("text-anchor", "middle")
            .text((d: INode): string => d.name);
    }
}
