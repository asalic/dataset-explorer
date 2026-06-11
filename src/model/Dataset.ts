import type ItemPage from "./ItemPage";
import type Study from "./Study";
import type SingleData from "./SingleData";

export default interface Dataset extends SingleData {
    diagnosis: string[];
    diagnosisCount: number[];
    provenance: string;
    studies: ItemPage<Study>;
}