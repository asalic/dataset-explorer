
import { useState } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from "./BodyRTE.module.css";

interface BodyRTEProps {
    updValue: Function;
    oldValue: string | null;
}

export function BodyRTE(props: BodyRTEProps): JSX.Element {
    const [value, setValue] = useState(props.oldValue ?? "");

    const changeValue = (newValue: string) => {
        setValue(newValue);
        props.updValue(newValue);
    }
    return <div className={styles["editor-wrapper"]}>
        <ReactQuill theme="snow" value={value} onChange={changeValue} 
            modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link']
          ]
        }}
        bounds={'[data-text-editor="editor"]'}
        formats={[
          'bold', 'italic', 'underline', 'strike', 
          'list', 'bullet', 'link', 'script'
        ]}
    
    />
    </div>;
//   const [value, setValue] = useState('<p>Hello <strong>world</strong></p>');

//   return (
//     <div style={{ maxWidth: 800, margin: '0 auto' }}>
//       <ReactQuill
//         theme="snow"
//         value={value}
//         onChange={setValue}
//         modules={{
//           toolbar: [
//             [{ header: [1, 2, false] }],
//             ['bold', 'italic', 'underline'],
//             [{ list: 'ordered' }, { list: 'bullet' }],
//             ['link', 'image'],
//             ['clean']
//           ]
//         }}
//         formats={[
//           'header', 'bold', 'italic', 'underline',
//           'list', 'bullet', 'link', 'image'
//         ]}
//       />
//       <div style={{ marginTop: 16 }}>
//         <strong>Rendered output (HTML):</strong>
//         <div dangerouslySetInnerHTML={{ __html: value }} />
//       </div>
//     </div>
//   );

}