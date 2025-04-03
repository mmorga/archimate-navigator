import { memo } from "react";
import { Accordion } from "react-bootstrap";
import { IEntity, Organization } from "../../../archimate-model";
import "../../archimate-navigator.css";
import { entityClickedFunc } from "../../common";
import OrganizationContent from "./organization-content";

type IProps = {
  organizations: Organization[];
  items: IEntity[];
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
};

const ViewsTab = memo(
  ({ organizations, items, entityClicked, selectedEntity }: IProps) => {
    return (
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Body>
            {organizations ? (
              <OrganizationContent
                organizations={organizations}
                items={items}
                entityClicked={entityClicked}
                selectedEntity={selectedEntity}
              />
            ) : null}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  },
);

export default ViewsTab;
