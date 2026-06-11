import { Form } from "react-bootstrap";
import MultiSelect from "../../../../../common/MultiSelect";

interface BodyEnumSelectProps {
    allValues: string[];
    updValue: (newValue: string[]) => void;
    oldValue: string[];
}

function BodyEnumSelect({allValues, updValue, oldValue}: BodyEnumSelectProps): JSX.Element {
    return <div className="m-2">
        <h4>Available properties:</h4>
        <Form className="ms-4">
            <MultiSelect allValues={allValues} initialSelection={oldValue} updSelection={updValue} />
        </Form>
    </div>;
}

export default BodyEnumSelect;