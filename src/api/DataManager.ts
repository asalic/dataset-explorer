import type QueryParamsType from "../model/QueryParamsType";
import WebClient from "./WebClient";

export default class DataManager {

  getDatasets(token:  string | null | undefined, qParams: QueryParamsType): Promise<XMLHttpRequest>  {
    return WebClient.getDatasets(token, qParams );
  }

  getDataset(token: string | null | undefined, datasetId: string): Promise<XMLHttpRequest> {
    return WebClient.getDataset(token, datasetId);
  }

  patchDataset(token: string | null | undefined, dsId: string, property: string, value: string | null): Promise<XMLHttpRequest>  {
    return WebClient.patchDataset(token, dsId, property, value);
  }

  getStudies(token: string | null | undefined, dsId: string, studiesSkip: number | null, studiesLimit: number | null): Promise<XMLHttpRequest>  {
    return WebClient.getStudies(token, dsId, studiesSkip, studiesLimit);
  }

  getTracesDataset(token: string | null | undefined, datasetId: string, skip: number | null,  limit: number | null): Promise<XMLHttpRequest>  {
    return WebClient.getTracesDataset(token, datasetId, skip,  limit);
  }

  getTracesActions(): Promise<XMLHttpRequest>  {
    return WebClient.getTracesActions();
  }

  getDatasetCreationStatus(token: string | null | undefined, datasetId: string): Promise<XMLHttpRequest>  {
    return WebClient.getDatasetCreationStatus(token, datasetId);
  }

  getUpgradableDatasets(token: string | null | undefined): Promise<XMLHttpRequest>  {
    return WebClient.getUpgradableDatasets(token);
  }

  getDatasetAccessHistory(token:  string | null | undefined, datasetId: string, skip: number | null,  limit: number | null): Promise<XMLHttpRequest> {
    return WebClient.getDatasetAccessHistory(token, datasetId, skip, limit);
  }

  getProjects(token:  string | null | undefined): Promise<XMLHttpRequest> {
    return WebClient.getProjects(token);
  }

  getAcl(token:  string, datasetId: string): Promise<XMLHttpRequest> {
    return WebClient.getAcl(token, datasetId);
  }

  putAcl(token:  string, datasetId: string, username: string): Promise<XMLHttpRequest> {
    return WebClient.updateAcl(token, datasetId, username, "PUT");
  }

  deleteAcl(token:  string, datasetId: string, username: string): Promise<XMLHttpRequest> {
    return WebClient.updateAcl(token, datasetId, username, "DELETE");
  }

  getLicenses(token:  string): Promise<XMLHttpRequest> {
    return WebClient.getLicenses(token);
  }

  postCheckIntegrity(token: string, singleDataId: string): Promise<XMLHttpRequest> {
    return WebClient.postCheckIntegrity(token, singleDataId);
  }

  deleteCancelDataset(token: string, singleDataId: string): Promise<XMLHttpRequest> {
    return WebClient.deleteCancelDataset(token, singleDataId);
  }

}
