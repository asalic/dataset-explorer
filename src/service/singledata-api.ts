import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from "@reduxjs/toolkit/query";
//import QueryParamsType from '../model/QueryParamsType';
import ItemPage from '../model/ItemPage';
import { call, BASE_URL_API, generateError } from "./common-api";
import SingleData from '../model/SingleData';
import Util from '../Util';
import DatasetCreationStatus from '../model/DatasetCreationStatus';
import License from '../model/License';
import UpgradableDataset from '../model/UpgradableDataset';
import CheckIntegrity from '../model/CheckIntegrity';
import AclUser from '../model/AclUser';
import DeletedSingleData from '../model/DeletedSingleData';
import SingleDataFactory from '../api/SingleDataFactory';
import Project from '../model/project/Project';
import ProjectConfig from '../model/project/ProjectConfig';
import ProjectList from '../model/project/ProjectList';
import User from '../model/user/User';
import ManagementJob from '../model/ManagementJob';
import UserListItem from '../model/user/UserListItem';
import SubprojectList from '../model/project/SubprojectList';
import SingleDataPageItem from '../model/SingleDataPageItem';
import INDEX_OPERATIONS from '../model/IndexOperations';
import type { DeleteSingleDataAclT, DeleteSingleDataCreatingT, GetDatasetCreationStatusT, GetIndexOperations, GetLicensesT, GetProjectConfigT, GetProjectsT, GetProjectT, GetSingleDataAclT, GetSingleDataPageT, GetSingleDataT, GetSubprojectsT, GetUpgradableDatasetsT, GetUserManagementJobLogsT, GetUserManagementJobsT, GetUserRolesT, GetUserSitesT, GetUsersPageT, GetUserT, PatchProjectT, PatchSingleDataT, PostSingleDataCheckIntegrityT, PostSingleDataReadjustFilePermissionsT, PostSingleDataRecollectMetadataT, PostSingleDataRestartCreationT, PutProjectConfigT, PutProjectLogoT, PutProjectT, PutSingleDataAclT, PutSubprojectT, PutUserT } from './singledata-api-types';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'singleDataApi',
  refetchOnMountOrArgChange: false,
  tagTypes: ["Model", "Dataset", "ModelAcl", "DatasetAcl", "Project", "ProjectList", "ProjectConfig"],
  endpoints: (build:  EndpointBuilder<any, any, any>) => ({
    getIndexOperations: build.query<INDEX_OPERATIONS, GetIndexOperations>({
      queryFn: async ({token}: GetIndexOperations)  => 
        {
          try {
            const data = await call("GET", 
                `${BASE_URL_API}/index`, token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null);
              return { data };
          } catch(error) { return { error: generateError(error) }; }

        },
      providesTags: ["Model", "Dataset"],
    }),
    getSingleDataPage: build.query<ItemPage<SingleDataPageItem>, GetSingleDataPageT>({
      queryFn: async ({token, qParams, singleDataType}: GetSingleDataPageT
        /*, queryApi, extraOptions, baseQuery*/)  => 
        {
            try {
              const dt: any = await call("GET", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", qParams);
                if (dt.list) {
                  dt.list.forEach((d: any) => {
                    d["typeApi"] = d.type;
                    d.type = singleDataType;
                    
                });
                }
                return { data: dt as ItemPage<SingleDataPageItem> };
            } catch(error) { return { error: generateError(error) }; }
        },
        providesTags: ["Model", "Dataset"],
        // (result: ItemPage<SingleData> |undefined, error, arg) => {
        //   const type: string = Util.singleDataClass(arg.singleDataType).constructor.name;
        //   return result && result.list
        //     ? [...result.list.map(({ id }) => ({ type, id })), type]
        //     : [type];
        // }
    }),
    getSingleData: build.query<SingleData, GetSingleDataT>({
      queryFn: async ({token, id, singleDataType}: GetSingleDataT)  => 
        {
          try {
            const data = SingleDataFactory.fromObj(await call("GET", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null), singleDataType);
              return { data };
          } catch(error) { return { error: generateError(error) }; }

        },
      providesTags: ["Model", "Dataset"],
    }),
    patchSingleData: build.mutation<boolean, PatchSingleDataT>({
      queryFn: async ({ token, id, property, value, singleDataType }: PatchSingleDataT)  => 
        {
          try {
              if (!token) {
                  return { error: generateError("Invalid token.") } 
              }
              await call("PATCH", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
                token ? new  Map([["Authorization", "Bearer " + token], ["Content-Type", "application/json"]]) : null,
                JSON.stringify({ property, value}), "text", null)
              return { data: true };
          } catch(error) { return { error: generateError(error) }; }

        },
      invalidatesTags: ["Model", "Dataset"],
    }),
    getSingleDataAcl: build.query<AclUser[], GetSingleDataAclT>({
      queryFn: async ({token, id, singleDataType}: GetSingleDataAclT)  => 
        {
          try {
            const data: AclUser[] =  await call("GET", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) as AclUser[];
              return { data};
          } catch(error) { return { error: generateError(error) }; }

        },
      providesTags: ["ModelAcl", "DatasetAcl"],
    }),
    deleteSingleDataAcl: build.mutation<null, DeleteSingleDataAclT>({
      queryFn: async ({token, id, singleDataType, username}: DeleteSingleDataAclT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              await call("DELETE", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl/${username}`, 
                headers,
                null, "text", null);
              return { data: null };
          } catch(error) { return { error: generateError(error) }; }

        },
        invalidatesTags: ["ModelAcl", "DatasetAcl"],
    }),
    putSingleDataAcl: build.mutation<boolean, PutSingleDataAclT>({
      queryFn: async ({token, id, singleDataType, username}: PutSingleDataAclT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              await call("PUT", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl/${username}`, 
                headers,
                null, "text", null);
              return { data: true };
          } catch(error) { return { error: generateError(error) }; }

        },
        invalidatesTags: ["ModelAcl", "DatasetAcl"],
    }),
    postSingleDataRestartCreation: build.mutation<boolean, PostSingleDataRestartCreationT>({
      queryFn: async ({token, id, singleDataType }: PostSingleDataCheckIntegrityT)  => {
        try {
            const headers = new Map();
            if (token) { headers.set("Authorization", "Bearer " + token); }
            else { return { error: generateError("Invalid token.") } }
            await call("POST", 
              `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/restartCreation`, 
              headers, null, "text", null)
            return { data: true };
          } catch(error) { return { error: generateError(error) }; }
        },
        invalidatesTags: ["Model", "Dataset"],
    }),
    postSingleDataReadjustFilePermissions: build.mutation<boolean, PostSingleDataReadjustFilePermissionsT>({
      queryFn: async ({token, id, singleDataType}: PostSingleDataReadjustFilePermissionsT)  => {
        try {
          const headers = new Map();
          if (token) { headers.set("Authorization", "Bearer " + token); }
          else { return { error: generateError("Invalid token.") } }
          await call("POST", 
            `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/readjustFilePermissions`, 
            headers, null, "text", null)
          return { data: true };
        } catch(error) { return { error: generateError(error) }; }
      },
      invalidatesTags: ["Model", "Dataset"],
    }),
    postSingleDataRecollectMetadata: build.mutation<boolean, PostSingleDataRecollectMetadataT>({
      queryFn: async ({token, id, singleDataType}: PostSingleDataRecollectMetadataT)  => {
        try {
          const headers = new Map();
          if (token) { headers.set("Authorization", "Bearer " + token); }
          else { return { error: generateError("Invalid token.") } }
          await call("POST", 
            `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/recollectMetadata`, 
            headers, null, "text", null)
          return { data: true };
        } catch(error) { return { error: generateError(error) }; }
      },
      invalidatesTags: ["Model", "Dataset"],
    }),
    postSingleDataCheckIntegrity: build.mutation<CheckIntegrity, PostSingleDataCheckIntegrityT>({
      queryFn: async ({token, id, singleDataType }: PostSingleDataCheckIntegrityT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              return { data: await call("POST", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/checkIntegrity`, 
                headers,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }
        },
        invalidatesTags: ["Model", "Dataset"],
    }),
    deleteSingleDataCreating: build.mutation<DeletedSingleData, DeleteSingleDataCreatingT>({
      queryFn: async ({token, id, singleDataType, name }: DeleteSingleDataCreatingT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
            await call("DELETE", 
              `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
              headers,
              null, "text", null)
              return { data: { name, id, type: singleDataType} as DeletedSingleData };
          } catch(error) { return { error: generateError(error) }; }
        },
        invalidatesTags: ["Model", "Dataset"],
    }),



    getUpgradableDatasets: build.query<UpgradableDataset[], GetUpgradableDatasetsT>({
      keepUnusedDataFor: 0,
      queryFn: async ({token}: GetDatasetCreationStatusT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              return { data: await call("GET", 
                `${BASE_URL_API}/upgradableDatasets`, headers,
                null, "text", null) as UpgradableDataset[] };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),
    
    getDatasetCreationStatus: build.query<DatasetCreationStatus, GetDatasetCreationStatusT>({
      keepUnusedDataFor: 0,
      queryFn: async ({token, id}: GetDatasetCreationStatusT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
            }
            return { data: await call("GET", 
            `${BASE_URL_API}/datasets/${id}/creationStatus`, headers,
            null, "text", null) as DatasetCreationStatus };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),

    getLicenses: build.query<Array<License>, GetLicensesT>({
      queryFn: async ({token}: GetLicensesT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                return { error: generateError("Invalid token.") } 
            }
              return { data: await call("GET", 
                `${BASE_URL_API}/licenses`, headers,
                null, "text", null) as Array<License> };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),


    putProject: build.mutation<boolean, PutProjectT>({
        queryFn: async ({projectFull, token}: PutProjectT)  => 
          {
            try {
                const headers = new Map([["Content-Type",  "application/json"]]);
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                } else {
                    return { error: generateError("Invalid token.") } 
                }
                await call("PUT", 
                  `${BASE_URL_API}/projects/${projectFull.code}`, headers,
                  JSON.stringify(projectFull), "text", null);
                  return {data: true};
            } catch(error) { return { error: generateError(error) }; }
  
          },
          invalidatesTags: ["ProjectList"],
      }),

    putProjectConfig: build.mutation<boolean, PutProjectConfigT>({
        queryFn: async ({projectConfig, token,  code}: PutProjectConfigT)  => 
            {
            try {
                const headers = new Map([["Content-Type",  "application/json"]]);
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                } else {
                    return { error: generateError("Invalid token.") } 
                }
                await call("PUT", 
                    `${BASE_URL_API}/projects/${code}/config`, headers,
                    JSON.stringify(projectConfig), "text", null);
                    return {data: true};
            } catch(error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["ProjectConfig"],
        }),


    getProjects: build.query<ProjectList | Array<string>, GetProjectsT>({
        queryFn: async ({token, purpose}: GetProjectsT)  => 
          {
            try {
                let headers = new Map();
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                }
                return { data: await call("GET", 
                  `${BASE_URL_API}/projects?purpose=${purpose}`, headers,
                  null, "text", null) };
            } catch(error) { return { error: generateError(error) }; }
  
          },
          providesTags: ["ProjectList"],
      }),

      getProject: build.query<Project, GetProjectT>({
        queryFn: async ({token, code}: GetProjectT)  => 
          {
            try {
                let headers = new Map();
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                }
                return { data: await call("GET", 
                  `${BASE_URL_API}/projects/${code}`, headers,
                  null, "text", null) };
            } catch(error) { return { error: generateError(error) }; }
  
          },
          providesTags: ["Project"],
      }),

      getProjectConfig: build.query<ProjectConfig, GetProjectConfigT>({
        queryFn: async ({token, code}: GetProjectConfigT)  => 
          {
            try {
                let headers = new Map();
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                }
                return { data: await call("GET", 
                  `${BASE_URL_API}/projects/${code}/config`, headers,
                  null, "text", null) };
            } catch(error) { return { error: generateError(error) }; }
  
          },
          providesTags: ["ProjectConfig"],
      }),

    patchProject: build.mutation<boolean, PatchProjectT>({
        queryFn: async ({ token, code, property, value }: PatchProjectT)  => 
          {
            try {
                if (!token) {
                    return { error: generateError("Invalid token.") } 
                }
                await call("PATCH", 
                  `${BASE_URL_API}/projects/${code}`, 
                  token ? new  Map([["Authorization", "Bearer " + token], ["Content-Type", "application/json"]]) : null,
                  JSON.stringify({ property, value}), "text", null)
                return { data: true };
            } catch(error) { return { error: generateError(error) }; }
  
          },
        invalidatesTags: ["Project", "ProjectList"],
    }),

    getSubprojects: build.query<SubprojectList, GetSubprojectsT>({
        queryFn: async ({token, code}: GetSubprojectsT)  => 
          {
            try {
                let headers = new Map();
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                }
                return { data: await call("GET", 
                  `${BASE_URL_API}/projects/${code}/subprojects`, headers,
                  null, "text", null) };
            } catch(error) { return { error: generateError(error) }; }
  
          },
          providesTags: ["SubprojectList"],
      }),

    putSubproject: build.mutation<boolean, PutSubprojectT>({
        queryFn: async ({partialSubproject, code, subcode, token}: PutSubprojectT)  => 
          {
            try {
                const headers = new Map([["Content-Type",  "application/json"]]);
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                } else {
                    return { error: generateError("Invalid token.") } 
                }
                await call("PUT", 
                  `${BASE_URL_API}/projects/${code}/subprojects/${subcode}`, headers,
                  JSON.stringify(partialSubproject), "text", null);
                  return {data: true};
            } catch(error) { return { error: generateError(error) }; }
  
          },
          invalidatesTags: ["SubprojectList"],
      }),


    getUsersPage: build.query<ItemPage<UserListItem>, GetUsersPageT>({
      queryFn: async ({token, qParams}: GetUsersPageT)  => {
          try {
            return { data: await call("GET", 
              `${BASE_URL_API}/users`, 
              token ? new  Map([["Authorization", "Bearer " + token]]) : null,
              null, "text", qParams) };
          } catch(error) { return { error: generateError(error) }; }
        },
      providesTags: ["UserList"],
    }),

    getUser: build.query<User, GetUserT>({
      queryFn: async ({token, username}: GetUserT)  => {
          try {
              return { data: await call("GET", 
                `${BASE_URL_API}/users/${username}?scope=all`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }
        },
      providesTags: ["User"],
    }),

    putUser: build.mutation<boolean, PutUserT>({
      queryFn: async ({user, token,  username}: PutUserT)  => {
          try {
              const headers = new Map([["Content-Type",  "application/json"]]);
              if (token) { headers.set("Authorization", "Bearer " + token); } 
              else { return { error: generateError("Invalid token.") } }
              await call("PUT", 
                  `${BASE_URL_API}/users/${username}`, headers,
                  JSON.stringify(user), "text", null);
                  return {data: true};
          } catch(error) { return { error: generateError(error) }; }
        },
      invalidatesTags: ["User"],
    }),

    getUserSites: build.query<Array<string>, GetUserSitesT>({
      queryFn: async ({token}: GetUserSitesT)  => {
          try {
              return { data: await call("GET", 
                `${BASE_URL_API}/userSites`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }
        },
    }),

    getUserRoles: build.query<Array<string>, GetUserRolesT>({
      queryFn: async ({token}: GetUserRolesT)  => {
          try {
              return { data: await call("GET", 
                `${BASE_URL_API}/userRoles`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }
        },
    }),

    getUserManagementJobs: build.query<Array<ManagementJob>, GetUserManagementJobsT>({
      queryFn: async ({token, username}: GetUserManagementJobsT)  => {
          try {
              return { data: await call("GET", 
                `${BASE_URL_API}/users/${username}/managementJobs`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }
        },
    }),

    getUserManagementJobLogs: build.query<string, GetUserManagementJobLogsT>({
      queryFn: async ({token, username, selectorUid}: GetUserManagementJobLogsT)  => {
          try {
              return { data: await call("GET", 
                `${BASE_URL_API}/users/${username}/managementJobs/${selectorUid}`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }
        },
    }),

  }),
})


export const { 
  useGetIndexOperationsQuery,
  useGetSingleDataPageQuery, 
  useGetSingleDataQuery, 
  useGetSingleDataAclQuery,
  useDeleteSingleDataAclMutation,
  usePutSingleDataAclMutation,
  usePostSingleDataRestartCreationMutation,
  usePostSingleDataReadjustFilePermissionsMutation,
  usePostSingleDataRecollectMetadataMutation,
  usePostSingleDataCheckIntegrityMutation,
  useDeleteSingleDataCreatingMutation,
  usePatchSingleDataMutation,
  useGetDatasetCreationStatusQuery,
  useGetUpgradableDatasetsQuery,
  useGetLicensesQuery,
  usePutProjectMutation,
  usePutProjectConfigMutation,
  useGetProjectsQuery,
  useGetSubprojectsQuery,
  usePutSubprojectMutation,
  useGetProjectQuery,
    useGetProjectConfigQuery,
    usePatchProjectMutation,
  useGetUsersPageQuery,
  useGetUserQuery,
  usePutUserMutation,
  useGetUserSitesQuery,
  useGetUserRolesQuery,
  useGetUserManagementJobsQuery,
  useGetUserManagementJobLogsQuery,
  useLazyGetUserManagementJobLogsQuery
} = api
