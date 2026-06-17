import { EndpointBuilder } from "@reduxjs/toolkit/query";
import {api} from "./api";
import { GetIndexOperations } from "./general-api-types";
import { BASE_URL_API, call, generateError } from "./common-api";

export const generalApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<any, any, any>) => ({
          getIndexOperations: build.query<string[], GetIndexOperations>({
              queryFn: async ({ token }: GetIndexOperations) => {
                  try {
                      const data = await call("GET",
                          `${BASE_URL_API}/index`, token ? new Map([["Authorization", "Bearer " + token]]) : null,
                          null, "text", null);
                      return { data };
                  } catch (error) { return { error: generateError(error) }; }
  
              },
              providesTags: ["Model", "Dataset"],
          }),
  }),
});

export const {
    useGetIndexOperationsQuery

} = generalApi;
