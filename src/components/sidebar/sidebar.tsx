import "./sidebar.css";
import {
  Diagram,
  Element,
  ElementType,
  IEntity,
  Layer,
  Model,
  Query,
  ViewpointType,
} from "../../archimate-model";
import { entityClickedFunc } from "../common";
import { Tab, Tabs } from "react-bootstrap";
import InfoTab from "./info/info-tab";
import ModelInfo from "./model-info";
import QueryTab from "./query/query-tab";
import SearchTab from "./search/search-tab";
import ViewsTab from "./views/views-tab";

export enum SidebarTab {
  DiagramTreeTab = 1,
  InfoTab,
  SearchTab,
  GraphTab,
}

export default function Sidebar({
  diagramLinkClicked,
  entityClicked,
  model,
  query,
  onTabSelected,
  selectedDiagram,
  selectedEntity,
  sidebarTabKey,
  onQueryNameChanged,
  onViewpointChanged,
  onPathDepthChanged,
  onLayerFilterChanged,
  onElementTypeFilterChanged,
  onAddElement,
  onRemoveElement,
}: {
  diagramLinkClicked: entityClickedFunc;
  entityClicked: entityClickedFunc;
  model: Model | undefined;
  query: Query | undefined;
  onTabSelected: (eventKey: string | null) => void;
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  sidebarTabKey: SidebarTab;
  onQueryNameChanged: (name: string) => void;
  onViewpointChanged: (viewpointType: ViewpointType) => void;
  onPathDepthChanged: (depth: number) => void;
  onLayerFilterChanged: (layer: Layer, checked: boolean) => void;
  onElementTypeFilterChanged: (elementType: ElementType) => void;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
}) {
  return (
    <div className="archimate-view-nav">
      <ModelInfo
        modelName={model?.name}
        diagramName={selectedDiagram?.name}
        diagramViewpoint={selectedDiagram?.viewpointDescription()}
      />
      <Tabs
        id="archimate-sidebar-tabs"
        defaultActiveKey={SidebarTab.DiagramTreeTab}
        activeKey={sidebarTabKey}
        onSelect={onTabSelected}
      >
        <Tab eventKey={SidebarTab.DiagramTreeTab} title="Views">
          <ViewsTab
            organizations={model ? model.viewOrganization().organizations : []}
            items={model ? model.viewOrganization().itemEntities() : []}
            selectedEntity={selectedDiagram}
            entityClicked={diagramLinkClicked}
          />
        </Tab>
        <Tab eventKey={SidebarTab.InfoTab} title="Info">
          <InfoTab entity={selectedEntity} entityClicked={entityClicked} />
        </Tab>
        <Tab eventKey={SidebarTab.SearchTab} title="Search">
          <SearchTab model={model} resultClicked={entityClicked} />
        </Tab>
        <Tab eventKey={SidebarTab.GraphTab} title="Query">
          <QueryTab
            model={model}
            query={query}
            selectedDiagram={selectedDiagram}
            onQueryNameChanged={onQueryNameChanged}
            onViewpointChanged={onViewpointChanged}
            onPathDepthChanged={onPathDepthChanged}
            onLayerFilterChanged={onLayerFilterChanged}
            onElementTypeFilterChanged={onElementTypeFilterChanged}
            onAddElement={onAddElement}
            onRemoveElement={onRemoveElement}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
