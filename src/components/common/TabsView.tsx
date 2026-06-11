import { Tab, Row, Col, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type SingleItemTab from "../../model/SingleItemTab";

interface TabsViewProps {
  basePath: string;
  tabs: SingleItemTab[];
  defaultTab: string;
  activeTab: string;
}

export default function TabsView(props: TabsViewProps) {
  let navigate = useNavigate();

  return <Container fluid className="w-100 flex-grow-1 d-flex flex-column ps-0 pe-0">
    <Tab.Container defaultActiveKey={props.defaultTab} activeKey={props.activeTab} 
                  onSelect={(k) => {console.log(k); navigate(`${props.basePath}/${k}`)}}>
      <Row className="flex-grow-1">
        <Col sm={2}>
          <Nav variant="pills" className="flex-column mb-5">
            {
              props.tabs.map(s => 
                <Nav.Item key={`singledata-categories-${s.eventKey}`}>
                  <Nav.Link eventKey={s.eventKey}>{s.title}</Nav.Link>
                </Nav.Item>
              )
            }
          </Nav>
        </Col>
        <Col sm={10} className="d-flex flex-column">
          <Tab.Content className="flex-grow-1 d-flex flex-column">
            {
              props.tabs.filter(s => s.eventKey === props.activeTab).map(s => 
                <Tab.Pane className="flex-grow-1 d-flex flex-column" key={`singledata-categories-tab-${s.eventKey}`} eventKey={s.eventKey}>
                    {s.view}
                </Tab.Pane>
              )
            }
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Container>;

}