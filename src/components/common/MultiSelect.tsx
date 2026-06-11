import { useState } from "react";
import { Form } from "react-bootstrap";

interface MultiSelectProps {
  allValues: string[];
  updSelection: (newSelection: string[]) => void;
  initialSelection: string[];
}

export default function MultiSelect({allValues, updSelection, initialSelection}: MultiSelectProps) {
  const allValuesSorted = [...allValues].sort();
  const iniValues = new Set(initialSelection);
  const [checkedValues, setCheckedValues] = useState(iniValues);

  return <> {
    allValuesSorted.map(v => 
      <Form.Check type="switch"
        id={v} label={v}
        checked={checkedValues.has(v)}
        onChange={(e) => {
          const newSelection = new Set(checkedValues);
          if ( e.target.checked ) 
            newSelection.add(v);
          else newSelection.delete(v);
          console.log(newSelection)
          setCheckedValues(newSelection);
          updSelection([...newSelection])  // map to array
        }}
      />)
  }</>;

}
