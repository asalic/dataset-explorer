import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {  Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import LoadingView from "../../common/LoadingView";
import ErrorView from "../../common/ErrorView";
import { useGetUserQuery, usePutUserMutation, useGetUserSitesQuery, useGetUserRolesQuery, useGetProjectsQuery } 
  from "../../../service/singledata-api";
import Util from "../../../Util";
import UrlFactory from "../../../service/UrlFactory";
import MultiSelect from "../../common/MultiSelect";
import { UserAttributeGroup, UserAttribute } from "../../../model/user/User";

interface UserDetailsViewProps {
  showDialog: Function;
  keycloakReady: boolean;
  username: string;
}

export default function UserDetailsView(props: UserDetailsViewProps) {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const {data: siteCodes, isLoading: isLoadingSiteCodes, error: errorSiteCodes, isError: isErrorSiteCodes} = 
    useGetUserSitesQuery({token: keycloak.token}, {skip: !keycloak.token});

  const {data: allRoles, isLoading: isLoadingRoles, error: errorRoles, isError: isErrorRoles} = 
    useGetUserRolesQuery({token: keycloak.token}, {skip: !keycloak.token});

  const {data: allProjects, isLoading: isLoadingProjects, error: errorProjects, isError: isErrorProjects} = 
    useGetProjectsQuery({ token: keycloak.token,
                          purpose: "userManagement" },
                        { skip: !keycloak.token });

  // const [localUser, setLocalUser] = useState<UserUpdate>({});


  const { data: user, isLoading, error, isError } = useGetUserQuery({
      token: keycloak.token,
      username: props.username
    },{
      skip: !(props.keycloakReady && props.username)
    }
  )

  let [siteCode, setSiteCode] = useState<string>(user?.siteCode ?? "");
  let [roles, setRoles] = useState<string[]>(user?.roles ?? []);
  let [projects, setProjects] = useState<string[]>(user?.projects ?? []);
  // const updRoles = (newVal: string[]) => {setRoles(newVal); console.log("===setroles"); console.log(newVal); console.log(roles);};
  //useEffect(() => setRoles(user?.roles ?? []), [user.roles]);

  const isCustomSite = siteCode == ""; // siteCodes ? (siteCodes.find(e => e === siteCode) === undefined) : true;

  const [submitError, setSubmitError] = useState<string>("");

  const [putUser, {isError: isErrorPutUser, isLoading: isLoadingPutUser, error: errorPutUser, 
        data: dataPutUser } ] = usePutUserMutation();

  const submit = useCallback((e: any) => {
      e.preventDefault();
      const form = e.target;
      if (keycloak.token === undefined) {
          setSubmitError("Please authenticate to submit."); return; }
      if (props.username === undefined) {
          setSubmitError("Unable to obtain the username from the URL."); return; }
      const data = {
        siteCode: form.siteCode.value != "" ? form.siteCode.value : form.customSiteCode.value,
        projects: projects,
        roles: roles
      };
      console.log(data);
      putUser({
          user: data,
          token: keycloak.token,
          username: props.username
      });
  }, [putUser, keycloak.token, setSubmitError, projects, roles, siteCodes, siteCode]);

  useEffect(() => {
      if (props.username && dataPutUser) {
          navigate(UrlFactory.userLogs(props.username))
      }
  }, [isErrorPutUser, setSubmitError, errorPutUser, navigate, dataPutUser, props.username]);

  
  if (!props.username) { return <ErrorView message="Unable to get the username, can't obtain user's data." />; }
  else if (!keycloak.token) { return <ErrorView message="You must authenticate before accessing this section." />; }
  else if (isLoading) { return <LoadingView fullMessage="Loading user details, please wait..."/> }
  else if (isLoadingSiteCodes) { return <LoadingView fullMessage="Loading site codes, please wait..."/> }
  else if (isLoadingRoles) { return <LoadingView fullMessage="Loading roles, please wait..."/> }
  else if (isLoadingProjects) { return <LoadingView fullMessage="Loading projects, please wait..."/> }
  else if (isError) { return <ErrorView message={Util.getError(error).message} /> }
  else if (isErrorSiteCodes) { return <ErrorView message={Util.getError(errorSiteCodes).message} /> }
  else if (isErrorRoles) { return <ErrorView message={Util.getError(errorRoles).message} /> }
  else if (isErrorProjects) { return <ErrorView message={Util.getError(errorProjects).message} /> } 
  else if (user && siteCodes && allRoles && allProjects) {
    return <>
      { isLoadingPutUser ? <LoadingView fullMessage="Submitting user data, please wait..." /> :<></> }
      { submitError ? <ErrorView  message={`Error submitting the new user data: ${submitError}`} /> :<></> }
      { isErrorPutUser ? 
        <ErrorView  message={`Error submitting the new project configuration: ${Util.getError(errorPutUser).message}`} /> :<></> 
      }
      <Form className="ms-2 me-2" onSubmit={submit}>
        <Container fluid>
          <Row>
            <Col md={6}>              
              <Form.Group className="mb-3" title="The unique ID of the user. Usually it is the ID from the auth service.">
                <Form.Label>Uid</Form.Label>
                <Form.Control placeholder=""
                    value={user.uid ?? ""}
                    name="uid" />
              </Form.Group>

              <Form.Group className="mb-3" title="The unique GID of the user.">
                <Form.Label>GID</Form.Label>
                <Form.Control placeholder="" 
                    value={user.gid ?? ""}
                    name="gid" />
              </Form.Group>

              <Form.Group className="mb-3" title="The complete name.">
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="" 
                    value={user.name ?? ""}
                    name="name" />
              </Form.Group>

              <Form.Group className="mb-3" title="The email of the user.">
                <Form.Label>Email</Form.Label>
                <Form.Control placeholder="" 
                    value={user.email ?? ""}
                    name="email" />
              </Form.Group>

              {/* <Form.Group className="mb-3" title="Set the site code of the user.">
                <Form.Label>Site code</Form.Label>
                <Form.Control placeholder="Enter the site code" 
                    value={localUser.siteCode ?? ""}
                    name="siteCode" 
                    onInput={(e: FormEvent<HTMLInputElement>) => setLocalUser({...localUser, ["siteCode"]: e.currentTarget.value})}/>
              </Form.Group> */}

              <Form.Group className="mb-3" title="The site code of the user. 
                                It is usually used when creating the user account in the Case Explorer (QP-Insights),
                                so it should correspond to one of the sites created there.
                                It is important when the user has the role of data uploader, 
                                because that user will be able to manage the data uploaded by any other user but from same site.">
                  <Form.Label>Site code</Form.Label>
                  <Form.Select //aria-label="License selector" 
                      name="siteCode"
                      value={siteCode} onChange={(e: ChangeEvent<HTMLSelectElement>) => { setSiteCode(e.currentTarget.value); }} >
                      {
                          siteCodes.map((s: string) => 
                            <option key={s} value={s}> {s} </option>)
                      } 
                      <option key="new-site" value=""> {"<New>"} </option>
                  </Form.Select>
                  {
                      siteCode === "" || isCustomSite
                          ? <div className="ms-4 bg-light mt-2 pt-2 pb-2">
                              <Form.Group className="ms-2 mb-3">
                                  <Form.Label>New site</Form.Label>
                                  <Form.Control placeholder="Enter the code" 
                                      name="customSiteCode"
                                      defaultValue={siteCode} />
                              </Form.Group>
                          </div>
                          : <></>
                  }
              </Form.Group>

              <Form.Group className="mb-3" title="Roles assigned to the user.">
                <Form.Label>Roles</Form.Label>
                <MultiSelect allValues={allRoles} initialSelection={user.roles} updSelection={setRoles} />
              </Form.Group>

              <Form.Group className="mb-3" title="Projects assigned to the user.">
                <Form.Label>Projects</Form.Label>
                <MultiSelect allValues={allProjects as string[]} initialSelection={user.projects} updSelection={setProjects} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <h4>Attributes from the auth service</h4>
              {
                user.attributesFromAuthService.map((attrGroup: UserAttributeGroup) => 
                  <div>
                    <b>{attrGroup.displayName}</b>
                    <div className="ms-3 bg-light mt-2 pt-2 pb-1">
                      {
                        attrGroup.attributes.map((attr: UserAttribute) =>
                          <Form.Group className="ms-2 mb-3" title="">
                            <Form.Label>{attr.displayName}</Form.Label>
                            <Form.Control placeholder=""
                                value={attr.values.toString()}
                                name="" />
                          </Form.Group>)
                      }
                    </div>
                  </div>)
              }
            </Col>
          </Row>
        </Container>

        <Button variant="primary" type="submit" className="ms-4 mt-4 me-2">
            Submit
        </Button>
      </Form>
    </>
  } 
  else { 
    return <Alert variant="info">User data or sites codes or roles or projects not available</Alert> 
  }
}
