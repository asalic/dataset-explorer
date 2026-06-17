import QueryParamsType from "../../model/QueryParamsType";
import SingleDataType from "../../model/SingleDataType";

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

export interface PatchSingleDataT {
  token: string | null | undefined;
  id: string;
  property: string;
  value: string | boolean | null;
  singleDataType: SingleDataType;
}