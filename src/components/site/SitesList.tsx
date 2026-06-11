import { useCallback, useEffect } from "react";
import MessageView from "../common/MessageView";
import Message from "../../model/Message";
import type SiteShort from "../../model/site/SiteShort";
import { ListGroup } from "react-bootstrap";

// const CODE_ATT = "data-site-code";
interface SitesListProps {
    updSelectedCode: Function;
    selectedCode: string | null;
    sites: SiteShort[];
}
export default function SitesList({updSelectedCode, selectedCode, sites}: SitesListProps): JSX.Element {


    const selectSite = useCallback((code: string) => {
        updSelectedCode(code);
    }, [updSelectedCode]);

    useEffect(() => {
        if (sites.length > 0) {
            if (selectedCode) {
                const sel = sites.find(s => s.code === selectedCode);
                if (!sel) {
                    updSelectedCode(sites[0]?.code);
                }
            } else {
                updSelectedCode(sites[0]?.code);
            }
        }
    }, [selectedCode, updSelectedCode, sites])


    if (sites.length === 0) {
        return  <MessageView message={new Message(Message.INFO, "No sites available. Use the New button above to createt some.")} />;
    } else {
        return <ListGroup as="ol">
            {
                sites.map((s: SiteShort) => <ListGroup.Item as="li" action  key={s.code} 
                            active={s.code === selectedCode}
                            className="d-flex justify-content-between align-items-start"
                            onClick={() => selectSite(s.code)}>
                        <div className="ms-2 me-auto" style={{wordBreak: "break-all"}}>
                            <div className="fw-bold fs-4">{s.code}</div>
                            {s.name}
                        </div>
                    </ListGroup.Item>
                )
            }

        </ListGroup>

    }

}