import type DatasetPidsUrls from "./DatasetPidsUrls";

export default interface DatasetPids {

    preferred: string | null;
    urls: DatasetPidsUrls;
}