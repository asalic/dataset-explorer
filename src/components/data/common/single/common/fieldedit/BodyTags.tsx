import React, { useState } from "react";
import TagEditor from "../../../../../common/tag/TagEditor";
import { Alert, Button } from "react-bootstrap";

interface BodyTagsProps {
  oldValue: string[];
  updValue: Function;

}
export default function BodyTags({ oldValue, updValue}: BodyTagsProps): JSX.Element {
    const [value, setValue] = useState(oldValue);

    const addTag = (tagNew: string) => {
        const newTags = [...value, tagNew];
        setValue(newTags);
        updValue(newTags);
    }

    const deleteTags = (tagsToRemove: Set<string>) => {
        const newTags = value.filter(t => !tagsToRemove.has(t));
        setValue(newTags);
        updValue(newTags);
    }

    const restoreTags = () => {
        setValue(oldValue);
        updValue(oldValue);
    }

    return <>
        <TagEditor addTag={addTag} deleteTags={deleteTags} existingTags={value} oneCol={false}/>
        {
            value?.length > 0 ? null : <div className="w-100 ms-2"><i>No tags available.</i></div>
        }
        <Button className="mt-2" variant="primary" onClick={restoreTags} title="Restore original list of tags" size="sm">Restore original</Button>
        <Alert variant="info" role="alert" className="mt-2">
            Some existing tags are not removable by a normal user. 
            Until the necessary funcionality needed to disable the removal of those tags becomes available on the backend, 
            you should remove tags one by one, each time clicking on update to commit the changes to the backend.
            The tags that you know you added are removable.
        </Alert>
    </>
}