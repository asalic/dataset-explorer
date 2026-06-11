
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { Search as SearchIc } from "react-bootstrap-icons";
import {useState, useEffect}from 'react';

interface SearchComponentProps {
  initValue: string;
  searchStringUpdate: Function;
}

function SearchComponent({initValue, searchStringUpdate}: SearchComponentProps): JSX.Element {
    const [input, setInput] = useState(initValue);
    useEffect(() => {
      setInput(initValue);
    }, [initValue]);
    // const updInput = (newVal) => {
    //   setInput(newVal);
    //   setSearchString(input);
    // }
  
    return (
      <InputGroup className="mb-3">
        <FormControl
          type="search"
          placeholder="Enter your dataset search terms e.g. name, author"
          aria-label="Dataset search"
          aria-describedby="basic-addon2"
          //defaultValue={props.initValue}
          style={{fontWeight: "bold"}}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
                let searchString: string | null = (e.target as HTMLInputElement).value;
                if (searchString === "") {
                    searchString = null
                }
                searchStringUpdate(searchString);
            }
          }}
        />
        <Button variant="outline-primary" size="sm" className="search-btn" onClick={() => {
            let searchString: string | null = input;
            if (searchString === "") {
                searchString = null;
            }
            searchStringUpdate(searchString);
        }}>
          <SearchIc />
        </Button>
      </InputGroup>
    );
  }

  export default SearchComponent;