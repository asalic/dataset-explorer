import { EndpointBuilder } from "@reduxjs/toolkit/query";
import {api} from "./api";
import DatasetCreated from "../../model/singledata/dataset/DatasetCreated";
import { GetDatasetCreationStatusT, GetLicensesT, GetUpgradableDatasetsT, PostDatasetT } from "./datasets-api-types";
import { BASE_URL_API, call, generateError } from "./common-api";
import UpgradableDataset from "../../model/UpgradableDataset";
import DatasetCreationStatus from "../../model/DatasetCreationStatus";
import License from "../../model/License";

export const datasetsApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<any, any, any>) => ({
          
  
          postDataset: build.mutation<DatasetCreated, PostDatasetT>({
              queryFn: async (args: PostDatasetT) => {
                  try {
                      const headers = new Map();
                      headers.set("Authorization", "Bearer " + args.token);
                      console.log("Is FormData?", args.formData instanceof FormData);
  
                      const data = await call("POST", `${BASE_URL_API}/datasets`, headers,
                          args.formData, "text", null);
                      return { data };
                  } catch (error) { return { error: generateError(error) }; }
  
              },
              invalidatesTags: ["Dataset"],
          }),
  
          getUpgradableDatasets: build.query<UpgradableDataset[], GetUpgradableDatasetsT>({
              keepUnusedDataFor: 0,
              queryFn: async ({ token, project }: GetUpgradableDatasetsT) => {
                  try {
                      const headers = new Map();
                      headers.set("Authorization", "Bearer " + token);
                      return {
                          data: await call("GET",
                              `${BASE_URL_API}/upgradableDatasets`, headers,
                              null, "text", { project }) as UpgradableDataset[]
                      };
                  } catch (error) { return { error: generateError(error) }; }
  
              },
          }),
  
          getDatasetCreationStatus: build.query<DatasetCreationStatus, GetDatasetCreationStatusT>({
              keepUnusedDataFor: 0,
              queryFn: async ({ token, id }: GetDatasetCreationStatusT) => {
                  try {
                      const headers = new Map();
                      if (token) {
                          headers.set("Authorization", "Bearer " + token);
                      } else {
                          return { error: generateError("Invalid token.") }
                      }
                      return {
                          data: await call("GET",
                              `${BASE_URL_API}/datasets/${id}/creationStatus`, headers,
                              null, "text", null) as DatasetCreationStatus
                      };
                  } catch (error) { return { error: generateError(error) }; }
  
              },
          }),
  
          getLicenses: build.query<Array<License>, GetLicensesT>({
              queryFn: async ({ token }: GetLicensesT) => {
                  try {
                      const headers = new Map();
                      if (token) {
                          headers.set("Authorization", "Bearer " + token);
                      } else {
                          return { error: generateError("Invalid token.") }
                      }
                      return {
                          data: await call("GET",
                              `${BASE_URL_API}/licenses`, headers,
                              null, "text", null) as Array<License>
                      };
                  } catch (error) { return { error: generateError(error) }; }
  
              },
          }),
  
  }),
});

export const {
    usePostDatasetMutation,
    useGetDatasetCreationStatusQuery,
    useGetUpgradableDatasetsQuery,
    useLazyGetUpgradableDatasetsQuery,
    useGetLicensesQuery
} = datasetsApi;

