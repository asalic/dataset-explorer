import QueryParamsType from "../../model/QueryParamsType";
import UserUpdate from "../../model/user/UserUpdate";

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