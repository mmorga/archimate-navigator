/*
// Custom Events
// loadDiagram
// showDiagramView
// showEntity
// showGraphView
// showRelationship
// showTable
// zoomAll
// zoomIn
// zoomOut
*/

/*
  Component Structure

body
  nav
  div.container-fluid
    nav.archimate-view-nav
      ul.archimate-nav-tabs
      div.tab-content
        div.archimate-views-tab-content
        div.archimate-info-tab-content
        div.archimate-search-tab-content 
        div.archimate-graph-tab-content

    article.archimate-diagram-view
      nav.archimate-diagram-navbar
      div.archimate-current-diagram
      div.archimate-current-graph

[-----------------------------------------------------------------------------------]
|ArchimateNavigator                                                                 |
|[-----------------------] [-------------------------------------------------------]|
|| ArchimateSidebar      | | ArchimateView                                         ||
||[---------------------]| |[-----------------------------------------------------]||
|||ArchimateDiagramTree ]| || ArchimateViewNav                                    |||
|||  Fires Events:      || ||       Fires Events:                                 |||
|||     loadDiagram     || ||         showDiagramView                             |||
||[---------------------]| ||         showGraphView                               |||
||[---------------------]| ||         showTable                                   |||
||| ArchimateInfo       || ||         zoomIn                                      |||
|||   Fires Events:     || ||         zoomOut                                     |||
|||     loadDiagram     || ||         zoomAll                                     |||
|||     showEntity      || |[-----------------------------------------------------]||
|||     showRelationship|| |[-----------------------------------------------------]||
||[---------------------]| || ArchimateDiagramView                                |||
||[---------------------]| ||      Fires Events:                                  |||
||| ArchimateSearch     || ||         showEntity                                  |||
|||   Fires Events:     || ||         showRelationship                            |||
|||     loadDiagram     || |[-----------------------------------------------------]||
|||     showEntity      || |[-----------------------------------------------------]||
|||     showRelationship|| || ArchimateGraphView                                  |||
||[---------------------]| ||      Fires Events:                                  |||
||[---------------------]| ||         showEntity                                  |||
||| ArchimateGraph      || ||         showRelationship                            |||
|||   Fires Events:     || |[-----------------------------------------------------]||
|||     loadDiagram     || |[-----------------------------------------------------]||
|||     showEntity      || || ArchimateTableView                                  |||
|||     showRelationship|| ||      Fires Events:                                  |||
||[---------------------]| ||          showEntity                                 |||
|[-----------------------] ||          showRelationship                           |||
|                          |[-----------------------------------------------------]||
|                          [-------------------------------------------------------]|
[-----------------------------------------------------------------------------------]

a.archimate-diagram-link click -> loadDiagramEvent -> diagramLoadedEvent

loadDiagramEvent:
  select the diagram tab in the diagram nav
  start loading indicator (in top nav - TODO)
  kick off load diagram request
  on complete:
    stop loading indicator
    on load -> diagramLoadedEvent
    on error -> pop up an error dialog (TODO)

DiagramLoadedEvent:
  select the diagram tab in the diagram nav
  TODO: if viewpoint is null, don't display null

#archimate-graph-tab-content click -> GraphTabClicked
#archimate-view-graph click -> GraphTabClicked
GraphTabClicked:
  show graph tab
  show graph diagram tab

*/

