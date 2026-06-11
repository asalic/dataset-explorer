import type LoadingError from "./LoadingError";

export default interface LoadingData<T_DATA> {

    data: T_DATA | null;
    loading: boolean;
    error: LoadingError | null;
    statusCode: number | null;
}