import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    reducerPath: 'singleDataApi',
    refetchOnMountOrArgChange: false,
    tagTypes: ["Model", "Dataset", "ModelAcl", "DatasetAcl", "Project", "ProjectList", "ProjectConfig"],
    endpoints: () => ({}),
});

