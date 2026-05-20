import { Container, Navbar, Nav, Badge, Dropdown, NavDropdown } from "react-bootstrap";
import React, { useMemo, useId } from "react";
import { GridFill } from 'react-bootstrap-icons';

import UserInfo from "./UserInfo";
import config from "../../service/config";
import Util from "../../Util";
import { useKeycloak } from "@react-keycloak/web";
import { useGetIndexOperationsQuery } from "../../service/singledata-api";
import ErrorView from "./ErrorView";
import INDEX_OPERATIONS from "../../model/IndexOperations";
import UrlFactory from "../../service/UrlFactory";
import SingleDataType from "../../model/SingleDataType";
import { Link } from "react-router-dom";



function getReleaseConf() {
    const release = Util.getReleaseType(config);
    switch (release) {
        case Util.RELEASE_DEV: return { t: "Development", bg: "bg-dark", tc: "text-white" };
        case Util.RELEASE_PROD_TEST:
        case Util.RELEASE_PROD_TEST_EUCAIM: return { t: "Test", bg: "bg-warning", tc: "text-dark" };
        case Util.RELEASE_MINI_NODE:
        case Util.RELEASE_PROD:
        case Util.RELEASE_PROD_EUCAIM: return { t: "Production", bg: "bg-transparent", tc: "text-dark" };
        default: console.error(`Unkwnon release type ${release}`); return { t: "", bg: "bg-transparent", tc: "" };
    }

}

function NavbarView() {


    const { keycloak } = useKeycloak();
    const { data, isError, error } = useGetIndexOperationsQuery({ token: keycloak.token });

    const rc = useMemo(() => getReleaseConf(), []);
    const nbCollapseId = useId();
    return <div className="w-100">
        { isError ? <ErrorView message={`Cannot load navigation bar items: ${Util.getError(error).message}`}/> : <></> }
        <Navbar bg="light" expand="lg" sticky="top">
            <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id={nbCollapseId}>
                    <Nav className="me-auto">
                        <Navbar.Brand as={Link} className={`p-1 ${rc.bg} ${rc.tc}`} to="/">
                            <div className="d-flex flex-row">
                                <b className="fs-4">Dataset Explorer</b>
                                <div className="d-flex flex-column ms-2">
                                    <Badge style={{ "fontSize": "50%" }} className={`p-1 ${rc.bg} ${rc.tc}`}>{rc.t}</Badge>
                                    <span className="app-version ms-1">{config.appVersion}</span>
                                </div>
                            </div>
                        </Navbar.Brand>
                        <Nav.Link as={Link} title="List of datasets" to={UrlFactory.singleData(SingleDataType.DATASET)}>Datasets</Nav.Link>
                        <Nav.Link as={Link} title="List of models" to={UrlFactory.singleData(SingleDataType.MODEL)}>Models</Nav.Link>
                        { data?.includes(INDEX_OPERATIONS.PROJECTS) ? <Nav.Link as={Link} title="Manage the projects" to={UrlFactory.projects()}>Projects</Nav.Link> : <></>}
                        { data?.includes(INDEX_OPERATIONS.SITES) ? <Nav.Link as={Link} title="Manage the sites" to={UrlFactory.sites()}>Sites</Nav.Link> : <></> }
                        { data?.includes(INDEX_OPERATIONS.USERS) ? <Nav.Link as={Link} title="Manage the users" to={UrlFactory.users()}>Users</Nav.Link> : <></> }
                        <NavDropdown title="Documentation" id="documentation-dropdown">
                            <NavDropdown.Item key="Workstation_Usage_Guide" title="Workstation Usage Guide" href={config.externalLinks.workstationUsageGuide} target="_blank">Workstation Usage</NavDropdown.Item>
                            <NavDropdown.Item key="Dataset_Usage_Guide" title="Dataset Usage Guide" href={config.externalLinks.datasetUsageGuide} target="_blank">Dataset Usage</NavDropdown.Item>
                            {config.externalLinks.applicationCatalogue
                                ? <NavDropdown.Item key="Application_Catalogue" title="Application Catalogue" href={config.externalLinks.applicationCatalogue} target="_blank">Application Catalogue</NavDropdown.Item>
                                : <></>
                            }
                            <NavDropdown title="Developer" id="developer-dropdown" drop="end" className="w-100 ps-2">
                                <NavDropdown.Item key="How to integrate your application on the platform" title="How to integrate your application on the platform" href={config.externalLinks.appIntegration} target="_blank">App Integration</NavDropdown.Item>
                                <NavDropdown.Item key="Dataset Service API Specs" title="Dataset Service API Specs" href="https://github.com/chaimeleon-eu/dataset-service#api-usage" target="_blank">API Specs</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} key="Fair Principles" title="Fair Principles" to={UrlFactory.fair()}>Fair Principles</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} target="_blank" title="Support" to={UrlFactory.support()}>Support</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                {/* keycloak.authenticated ? <Button className="me-1" variant="warning" onClick={() => window.open("https://forms.gle/bDmJC3cHog2CixMB8", '_blank').focus()}>Internal Validation</Button> : <Fragment/> */}
                <Dropdown title="Launch CHAIMELEON Applications" className="float-end me-1" drop="start" >
                    <Dropdown.Toggle size="sm" variant="success" id="dropdown-basic">
                        <GridFill />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            config.externalServices?.map(e => {
                                return <Dropdown.Item key={e.title} title={e.title} onClick={() => window?.open(e.link, '_blank')?.focus()}>
                                    <img title="e.title" className="apps-logo me-2" src={config.publicURL + e.icon} />{e.name}
                                </Dropdown.Item>
                            })
                        }

                        {/* <Dropdown.Item title="Launch the applications' dashboard (Kubeapps)" onClick={() => window?.open("https://chaimeleon-eu.i3m.upv.es/apps/", '_blank')?.focus()}>

              <img className="apps-logo me-2" src={config.publicURL + "/icons/kubeapps.png"}/>Apps Dashboard
            </Dropdown.Item>
            <Dropdown.Item title="Launch the case explorer (Quibim Precision)" onClick={() => window?.open(Config.caseExplorerService, '_blank')?.focus()}>
              <img className="apps-logo me-2" src={config.publicURL + "/icons/quibim.png"}/>Case Explorer
            </Dropdown.Item>
            <Dropdown.Item title="Access your desktop cluster applications (Apache Guacamole)" onClick={() => window?.open(Config.desktopAppAccess, '_blank')?.focus()}>
              <img className="apps-logo me-2" src={config.publicURL + "/icons/guacamole.png"}/>Desktop Apps Access
            </Dropdown.Item> */}
                    </Dropdown.Menu>
                </Dropdown>
                <div className="float-end">
                    <UserInfo />
                </div>
            </Container>
        </Navbar>
    </div>;
}

export default NavbarView;
