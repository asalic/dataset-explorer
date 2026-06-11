import { Overlay, Popover } from "react-bootstrap";
import TagComponent from "./TagComponent";

interface TagsPopoverProps {
    show: boolean;
    setShow: Function;
    tags: string[];
    targetRef: React.RefObject<HTMLElement | null>;
}


export default function TagsPopover({ show, setShow, tags, targetRef  }: TagsPopoverProps): JSX.Element {

  return <Overlay
            target={targetRef}
            show={show}
            placement="left"
            rootClose
            onHide={() => setShow(false)}
          >
            <Popover style={{ maxWidth: 300 }}>
              <Popover.Header as="h3">All Tags</Popover.Header>
              <Popover.Body>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    paddingRight: "4px"
                  }}
                  className="d-flex flex-wrap gap-1 mb-2"
                >
                  {tags.map((tag, i) => (
                    <TagComponent key={i} text={tag} isClickable={true}/>
                  ))}
                </div>
              </Popover.Body>
            </Popover>
          </Overlay>;
}
