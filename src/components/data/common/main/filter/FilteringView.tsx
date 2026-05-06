import React from "react";
import { Container } from "react-bootstrap";
import DataManager from "../../../../../api/DataManager";
import FilterFlags, { FilterFlag } from "./FilterFlags";
import FilterProject from "./FilterProject";
import FilterTag from "./FilterTag";

interface FilteringViewProps {
    flags: Array<FilterFlag>
    searchParams: URLSearchParams;
    filterUpdate: Function;
    loading: boolean;
    keycloakReady: boolean;
    dataManager: DataManager;
    postMessage: Function;
}

function FilteringView({flags, searchParams, filterUpdate, loading, keycloakReady, dataManager, postMessage}: FilteringViewProps) {

    return <Container>
        <FilterFlags filterUpdate={filterUpdate} searchParams={searchParams} loading={loading} flags={flags} />

        {/* All filters bellow are dynamic and can be unavailable depending on context */}
        <FilterProject filterUpdate={filterUpdate} searchParams={searchParams} loading={loading} 
            keycloakReady={keycloakReady} dataManager={dataManager} postMessage={postMessage}/>

        <FilterTag filterUpdate={filterUpdate} searchParams={searchParams} loading={loading} 
            keycloakReady={keycloakReady} postMessage={postMessage} />

    </Container>;
}

export default FilteringView;