import type Trace from "./Trace";

export default interface TracesBCPaginated {

    blockchain: string;
    traces: Trace[];
    countAllTraces: number;
}