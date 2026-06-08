import React, { ChangeEvent, useCallback, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import DeletableTagComponent from "./DeletableTagComponent";
import styles from "./TagEditor.module.css";


interface TagEditorProps {
    existingTags: string[];
    addTag: Function;
    deleteTags: Function;
    oneCol: boolean;
    className?: string;
}

export default function TagEditor({ existingTags, addTag, deleteTags, oneCol, className }: TagEditorProps): JSX.Element {

    const [tagNew, setTagNew] = useState<string>("");
    const tagExists = () => existingTags.includes(tagNew);
    const enterTagChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTagNew(e.target.value)
    }, [setTagNew]);

    const addTagLocal = (tagNew: string) => {
        addTag(tagNew);
        setTagNew("");
    }

    return <Container fluid className={`p-0 px-2 ${className ?? ""}`}>
        <div className={`d-flex gap-2 ${oneCol ? "flex-column" : ""}`}>
            <div className="d-flex flex-column flex-grow-1">
                <div className={styles["inputWrapper"]}>
                    <span>#</span>
                    <input className="w-100" type="text" title="Enter tag (without the '#' prefix, which is added automatically)"
                        placeholder="Enter tag" onChange={enterTagChange} value={tagNew} />
                </div>
                <div className={`text-warning ${tagExists() ? "" : "d-none"}`}>
                    Tag already exists.
                </div>
            </div>
            <div className="d-flex align-items-start gap-2">
                <Button title="Add new tag to the list" size="sm" variant="primary" onClick={() => addTagLocal(tagNew)} 
                    disabled={tagExists() || tagNew.length === 0}>Add</Button>
                <Button title="Remove all tags from the list" size="sm" variant="danger" disabled={existingTags.length === 0}
                    onClick={() => deleteTags(new Set([...existingTags]))}>Remove all</Button>
            </div>
        </div>
        <Row className="mt-2">
            <Col className={oneCol ? "d-flex flex-column gap-2 px-4 py-2" : "d-flex flex-row gap-2 flex-wrap px-4 py-2"}>
                {
                    existingTags.map(t => <DeletableTagComponent key={t} text={t}
                        onDelete={() => deleteTags(new Set([t]))} isClickable={false}
                    />)
                }
            </Col>
        </Row>
    </Container>

}