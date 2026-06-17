
export interface GetDatasetCreationStatusT {
  token: string  | null |undefined;
  id:  string;

}

export interface PostDatasetT {
  token: string;
  formData: FormData;
}

export interface GetUpgradableDatasetsT {
  token: string;
  project: string;
}

export interface GetLicensesT {
  token: string | null | undefined;
}