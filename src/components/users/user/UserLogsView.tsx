import { type ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";
import {  Alert, Button, Form } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import LoadingView from "../../common/LoadingView";
import ErrorView from "../../common/ErrorView";
import { useGetUserManagementJobsQuery, useLazyGetUserManagementJobLogsQuery } from "../../../service/api/users-api";
import Util from "../../../Util";
import type ManagementJob from "../../../model/ManagementJob";

interface UserDetailsViewProps {
  showDialog: Function;
  keycloakReady: boolean;
  username: string;
}

export default function UserLogsView(props: UserDetailsViewProps) {
  const { keycloak } = useKeycloak();

  const {data: jobs, isLoading: isLoadingJobs, error: errorJobs, isError: isErrorJobs} = 
    useGetUserManagementJobsQuery({ token: keycloak.token,
                                    username: props.username },
                                  { skip: !keycloak.token });

  let [jobSelected, setJobSelected] = useState<string>("");
  
  const [fetchLog, { data: jobLog, isLoading, error, isError }] = useLazyGetUserManagementJobLogsQuery();

  const fetchJobLogs = useCallback(() => {
    console.log(jobSelected);
    if( jobSelected != "" )
      fetchLog({ token: keycloak.token,
                 username: props.username,
                 selectorUid: jobSelected})
  }, [keycloak.token, props.username, jobSelected]);

  useEffect(() => { 
    fetchJobLogs()
  }, [jobSelected]);

  useEffect(() => {
    console.log("##setJobSelected"); 
    setJobSelected(jobs && jobs[0] ? jobs[0].uid : "")
  }, [jobs]);

  
  if (!props.username) return <ErrorView message="Unable to get the username, can't obtain user's data." />;
  else if (!keycloak.token) return <ErrorView message="You must authenticate before accessing this section." />;
  else if (isLoadingJobs) return <LoadingView fullMessage="Loading logs list, please wait..."/>
  else if (isErrorJobs) return <ErrorView message={Util.getError(errorJobs).message} />
  else if (!jobs) return <Alert variant="info">Logs list not available</Alert>
  else if (jobs.length == 0) return <Alert variant="info">There is not any management job currently for this user. </Alert>
  else {
    return <Fragment>
      <Form className="ms-2 me-2 flex-grow-1 d-flex flex-column">
        
        <Form.Group className="mb-3" title="">
            <Form.Label>Select management job</Form.Label>
            <Form.Select 
              name="jobSelected"
              value={jobSelected} onChange={(e: ChangeEvent<HTMLSelectElement>) => { console.log("##setJobSelected"); setJobSelected(e.currentTarget.value); }} >
              {
                jobs.map((j: ManagementJob) => 
                  <option key={j.uid} value={j.uid}> 
                    { Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' }).format(Date.parse(j.creationDate)) 
                      + " - " + j.name + " [" + j.status + "]" } 
                  </option>)
              }
            </Form.Select>
        </Form.Group>

        {
          jobSelected == "" ? <></>
            : <Fragment>
                <div><Button variant="primary" size="sm" onClick={fetchJobLogs}> Refresh </Button></div>
                {
                  isLoading ? 
                    <LoadingView fullMessage="Loading log, please wait..."/> 
                  : isError ? 
                      <ErrorView message={Util.getError(error).message} /> 
                    : <textarea className="w-100 flex-grow-1 bg-dark text-light lh-sm font-monospace" readOnly value={jobLog} />
                }
              </Fragment>
        }
      </Form>
    </Fragment>
  } 
}
