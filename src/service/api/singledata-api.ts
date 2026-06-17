import { type EndpointBuilder } from "@reduxjs/toolkit/query";
import SingleDataFactory from "../../api/SingleDataFactory";
import AclUser from "../../model/AclUser";
import DeletedSingleData from "../../model/DeletedSingleData";
import SingleData from "../../model/SingleData";
import ItemPageSingleData from "../../model/singledata/ItemPageSingleData";
import SingleDataPageItem from "../../model/SingleDataPageItem";
import Util from "../../Util";
import {api} from "./api";
import { BASE_URL_API, call, generateError } from "./common-api";
import {
    PatchSingleDataT, DeleteSingleDataAclT, DeleteSingleDataCreatingT, GetSingleDataAclT,
    GetSingleDataPageT, GetSingleDataT, PostSingleDataCheckIntegrityT, PostSingleDataReadjustFilePermissionsT,
    PostSingleDataRecollectMetadataT, PostSingleDataRestartCreationT, PutSingleDataAclT
} from "./singledata-api-types";
import CheckIntegrity from "../../model/CheckIntegrity";

export const singledataApi = api.injectEndpoints({
    endpoints: (build: EndpointBuilder<any, any, any>) => ({

        getSingleDataPage: build.query<ItemPageSingleData<SingleDataPageItem>, GetSingleDataPageT>({
            queryFn: async ({ token, qParams, singleDataType }: GetSingleDataPageT
            /*, queryApi, extraOptions, baseQuery*/) => {
                try {
                    const dt: any = await call("GET",
                        `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}`,
                        token ? new Map([["Authorization", "Bearer " + token]]) : null,
                        null, "text", qParams);
                    if (dt.list) {
                        dt.list.forEach((d: any) => {
                            d["typeApi"] = d.type;
                            d.type = singleDataType;

                        });
                    }
                    return { data: dt as ItemPageSingleData<SingleDataPageItem> };
                } catch (error) { return { error: generateError(error) }; }
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
            queryFn: async ({ token, id, singleDataType }: GetSingleDataT) => {
                try {
                    const data = SingleDataFactory.fromObj(await call("GET",
                        `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`,
                        token ? new Map([["Authorization", "Bearer " + token]]) : null,
                        null, "text", null), singleDataType);
                    return { data };
                } catch (error) { return { error: generateError(error) }; }

            },
            providesTags: ["Model", "Dataset"],
        }),
        patchSingleData: build.mutation<boolean, PatchSingleDataT>({
            queryFn: async ({ token, id, property, value, singleDataType }: PatchSingleDataT) => {
                try {
                    if (!token) {
                        return { error: generateError("Invalid token.") }
                    }
                    await call("PATCH",
                        `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`,
                        token ? new Map([["Authorization", "Bearer " + token], ["Content-Type", "application/json"]]) : null,
                        JSON.stringify({ property, value }), "text", null)
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["Model", "Dataset"],
        }),
        getSingleDataAcl: build.query<AclUser[], GetSingleDataAclT>({
            queryFn: async ({ token, id, singleDataType }: GetSingleDataAclT) => {
                try {
                    const data: AclUser[] = await call("GET",
                        `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl`,
                        token ? new Map([["Authorization", "Bearer " + token]]) : null,
                        null, "text", null) as AclUser[];
                    return { data };
                } catch (error) { return { error: generateError(error) }; }

            },
            providesTags: ["ModelAcl", "DatasetAcl"],
        }),
        deleteSingleDataAcl: build.mutation<null, DeleteSingleDataAclT>({
            queryFn: async ({ token, id, singleDataType, username }: DeleteSingleDataAclT) => {
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
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["ModelAcl", "DatasetAcl"],
        }),
        putSingleDataAcl: build.mutation<boolean, PutSingleDataAclT>({
            queryFn: async ({ token, id, singleDataType, username }: PutSingleDataAclT) => {
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
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["ModelAcl", "DatasetAcl"],
        }),
        postSingleDataRestartCreation: build.mutation<boolean, PostSingleDataRestartCreationT>({
            queryFn: async ({ token, id, singleDataType }: PostSingleDataRestartCreationT) => {
                try {
                    const headers = new Map();
                    if (token) { headers.set("Authorization", "Bearer " + token); }
                    else { return { error: generateError("Invalid token.") } }
                    await call("POST",
                        `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/restartCreation`,
                        headers, null, "text", null)
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }
            },
            invalidatesTags: ["Model", "Dataset"],
        }),
        postSingleDataReadjustFilePermissions: build.mutation<boolean, PostSingleDataReadjustFilePermissionsT>({
            queryFn: async ({ token, id, singleDataType }: PostSingleDataReadjustFilePermissionsT) => {
                try {
                    const headers = new Map();
                    if (token) { headers.set("Authorization", "Bearer " + token); }
                    else { return { error: generateError("Invalid token.") } }
                    await call("POST",
                        `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/readjustFilePermissions`,
                        headers, null, "text", null)
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }
            },
            invalidatesTags: ["Model", "Dataset"],
        }),
        postSingleDataRecollectMetadata: build.mutation<boolean, PostSingleDataRecollectMetadataT>({
            queryFn: async ({ token, id, singleDataType }: PostSingleDataRecollectMetadataT) => {
                try {
                    const headers = new Map();
                    if (token) { headers.set("Authorization", "Bearer " + token); }
                    else { return { error: generateError("Invalid token.") } }
                    await call("POST",
                        `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/recollectMetadata`,
                        headers, null, "text", null)
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }
            },
            invalidatesTags: ["Model", "Dataset"],
        }),
        postSingleDataCheckIntegrity: build.mutation<CheckIntegrity, PostSingleDataCheckIntegrityT>({
            queryFn: async ({ token, id, singleDataType }: PostSingleDataCheckIntegrityT) => {
                try {
                    const headers = new Map();
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    } else {
                        return { error: generateError("Invalid token.") }
                    }
                    return {
                        data: await call("POST",
                            `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/checkIntegrity`,
                            headers,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }
            },
            invalidatesTags: ["Model", "Dataset"],
        }),
        deleteSingleDataCreating: build.mutation<DeletedSingleData, DeleteSingleDataCreatingT>({
            queryFn: async ({ token, id, singleDataType, name }: DeleteSingleDataCreatingT) => {
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
                    return { data: { name, id, type: singleDataType } as DeletedSingleData };
                } catch (error) { return { error: generateError(error) }; }
            },
            invalidatesTags: ["Model", "Dataset"],
        }),



    }),
});

export const {
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
    usePatchSingleDataMutation
} = singledataApi;
