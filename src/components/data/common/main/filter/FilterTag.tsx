import React, { useCallback } from "react";
import TagEditor from "../../../../common/tag/TagEditor";

interface FilterTagProps {
    searchParams: URLSearchParams;
    filterUpdate: Function;
    loading: boolean;
    keycloakReady: boolean;
    postMessage: Function;
}

export default function FilterTag({ searchParams, filterUpdate }: FilterTagProps): JSX.Element {
    const tag: string[] = searchParams.getAll("tag");

    const addTag = (tagNew: string) => {
        filterUpdate({ tag: [...tag, tagNew] });
    };
    const deleteTags = useCallback((tagsToRemove: Set<string>) => filterUpdate({ tag: tag.filter(t => !tagsToRemove.has(t)) }), [filterUpdate])

    return <div className="mt-4 mb-4 mx-2">
        <h6>Tags</h6>
        <TagEditor addTag={addTag} deleteTags={deleteTags} existingTags={tag} oneCol={true}/>
    </div>;

}