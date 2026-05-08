import ProjectConfig from "../model/project/ProjectConfig";
import { ProjectFull } from "../model/project/ProjectFull";
import Subproject from "../model/project/Subproject";
import QueryParamsType from "../model/QueryParamsType";
import SingleDataType from "../model/SingleDataType";
import UserUpdate from "../model/user/UserUpdate";

export interface GetIndexOperations {
  token: string  | null |undefined;    
}


export interface GetSingleDataPageT {
  token: string  | null |undefined;
  qParams:  QueryParamsType;
  singleDataType: SingleDataType;
}

export interface GetSingleDataT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}

export interface GetSingleDataAclT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}

export interface DeleteSingleDataAclT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
  username: string;
}

export interface PutSingleDataAclT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
  username: string;
}

export interface PostSingleDataRestartCreationT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}
export interface PostSingleDataReadjustFilePermissionsT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}
export interface PostSingleDataRecollectMetadataT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}
export interface PostSingleDataCheckIntegrityT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}
export interface DeleteSingleDataCreatingT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
  name: string;
}

export interface GetDatasetCreationStatusT {
  token: string  | null |undefined;
  id:  string;

}

export interface PatchSingleDataT {
  token: string | null | undefined;
  id: string;
  property: string;
  value: string | boolean | null;
  singleDataType: SingleDataType;
}

export interface GetUpgradableDatasetsT {
  token: string | null | undefined;
}

export interface GetLicensesT {
  token: string | null | undefined;
}

export interface PutProjectT {
    projectFull: ProjectFull;
    token: string;
}

export interface PutProjectConfigT {
    projectConfig: ProjectConfig;
    token: string;
    code: string;
}

export interface GetProjectsT {
    token: string | null | undefined;
    purpose: string;
}

export interface GetProjectT {
    token: string | null | undefined;
    code: string;
}

export interface GetProjectConfigT {
    token: string | null | undefined;
    code: string;
}

export interface PatchProjectT {
    token: string | null | undefined;
    code: string;
    property: string;
    value: string | boolean | null;
}

export interface GetSubprojectsT {
    token: string | null | undefined;
    code: string;

}

export interface PutSubprojectT {
    partialSubproject: Partial<Subproject>;
    code: string;
    subcode: string;
    token: string;
}


export interface GetUsersPageT {
  token: string  | null | undefined;
  qParams:  QueryParamsType;
}

export interface GetUserT {
  token: string | null | undefined;
  username: string;
}

export interface PutUserT {
  user: UserUpdate;
  token: string;
  username: string;
}

export interface GetUserSitesT {
  token: string | null | undefined;
}

export interface GetUserRolesT {
  token: string | null | undefined;
}

export interface GetUserManagementJobsT {
  token: string | null | undefined;
  username: string;
}

export interface GetUserManagementJobLogsT {
  token: string | null | undefined;
  username: string;
  selectorUid: string;
}