import * as d3request from "d3-request";
import * as GV from "./graph-visualization";

// const appsThatUseCore =
// MATCH p = (a:ApplicationComponent) <-[r*1..5]- (core:ApplicationComponent {name: "Core"})
// WHERE all(x IN rels(p) WHERE x.weight >= 6)
// AND size(filter(n in nodes(p) where n:ApplicationComponent)) < 3
// return a, r, core
// const usesCoreOrCoreInterface =
// MATCH (core:ApplicationComponent {name: "Core"})
// MATCH (core)-[r:CompositionRelationship]->(interface:ApplicationInterface)
// MATCH p=(interface)-[r2:UsedByRelationship]->()
// return core, r, p;
// const usesCoreOrCoreInterfaces2 =
// MATCH p = (core:ApplicationComponent {name: "Core"})-[r:CompositionRelationship]->
// (interface:ApplicationInterface)-[r2:UsedByRelationship]->()
// RETURN p
// UNION MATCH p=(core:ApplicationComponent {name: "Core"})-[r2:UsedByRelationship]->()
// return p;

interface INeoNode {
  id: string;
  labels: string[];
  properties: {
    name: string;
    layer: string;
    nodeId: string;
  };
}

interface INeoRelationship {
  id: string;
  startNode: string;
  endNode: string;
  type: string;
  properties: {
    name: string;
    weight: number;
    relationshipID: string;
  };
}

interface INeoGraph {
  nodes: INeoNode[];
  relationships: INeoRelationship[];
}

interface INeoMeta {
  deleted: boolean;
  id: number;
  type: string;
}

interface INeoData {
  graph: INeoGraph;
  meta: INeoMeta[] | INeoMeta[][];
  row: Array<{}> | Array<Array<{}>>;
}

interface INeoResult {
  columns: string[];
  data: INeoData[];
}

interface INeoQueryResponse {
  results: INeoResult[];
  errors: Array<{}>;
}

export default class GraphModelStore {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = "http://localhost:7474/db/data/transaction/commit";
  }

  public runQuery(
    queryStatement: string,
    callback: (ID3Graph: GV.ID3Graph) => void
  ): void {
    const query = {
      statements: [
        {
          resultDataContents: ["row", "graph"],
          statement: queryStatement
        }
      ]
    };

    d3request
      .request(this.endpoint)
      .header("Accept", "application/json; charset=UTF-8")
      .header("Content-Type", "application/json")
      .mimeType("application/json")
      .on("error", error => {
        alert(error);
      })
      .on(
        "load",
        (xhr: XMLHttpRequest): void => {
          const data = JSON.parse(xhr.response) as INeoQueryResponse;
          const graph = this.toGraph(data);
          if (callback) {
            callback(graph);
          }
        }
      )
      .post(JSON.stringify(query));
  }

  public toGraph(data: INeoQueryResponse): GV.ID3Graph {
    const graph: GV.ID3Graph = {
      links: [],
      nodes: []
    };
    for (const result of data.results) {
      for (const datum of result.data) {
        for (const node of datum.graph.nodes) {
          const d3node: GV.INode = {
            id: node.id,
            labels: node.labels,
            layer: node.properties.layer,
            name: node.properties.name,
            nodeId: node.properties.nodeId,
            nodeType: node.labels[0]
          };
          const dupes: GV.INode[] = graph.nodes.filter(
            (n: GV.INode) => n.id === d3node.id
          );
          if (dupes.length === 0) {
            graph.nodes.push(d3node);
          }
        }
        for (const link of datum.graph.relationships) {
          const d3link: GV.ILink = {
            id: link.id,
            linkType: link.type,
            relationshipId: link.properties.relationshipID,
            source: link.startNode,
            target: link.endNode,
            weight: link.properties.weight
          };
          const dupes: GV.ILink[] = graph.links.filter(
            (l: GV.ILink) => l.id === d3link.id
          );
          if (dupes.length === 0) {
            graph.links.push(d3link);
          }
        }
      }
    }
    return graph;
  }
}
