import { useState } from "react";
import { Form } from "react-bootstrap";
import LogoType from "../../model/project/LogoType";
import type Logo from "../../model/project/Logo";

interface LogoAdminProps {
    className?: string;
    onLogoSet:  (logo: Logo) => void
    externalLogo?: Logo;
}

export default function LogoAdmin({ className, onLogoSet, externalLogo }: LogoAdminProps): JSX.Element {

    const [type, setType] = useState<string>(externalLogo?.type ?? LogoType.NONE);

    const [, setLogo] = useState<string | File | null>(externalLogo?.logo ?? null);

    // const [external, setExternal] = useState<string>("");
    // const [upload, setUpload] = useState<File | null>(null);



    const logoTypeChange = (value: LogoType) => {
        setType(value);
        onLogoSet({ type: value, logo: null });
        // if (value === LogoType.EXTERNAL_LINK) {
        //     onLogoSet(LogoType.EXTERNAL_LINK, external);
        // } else if (value === LogoType.UPLOAD_IMAGE) {
        //     onLogoSet(LogoType.UPLOAD_IMAGE, upload);
        // } else {
        //     throw new Error(`Unknown logo type '${value}'`)
        // }
    }

    const onLogoChange = (type: LogoType, value: string | File | null) => {
        setLogo(value);
        onLogoSet({ type: type as LogoType, logo: value });
        // if (type === LogoType.EXTERNAL_LINK) {
        //     setExternal(value as string);
        //     onLogoSet(value);
        // } else if (type === LogoType.UPLOAD_IMAGE) {
        //     setUpload(value as File | null);
        //     onLogoSet(value);
        // } else {
        //     throw new Error(`Unknown logo type '${type}'`)
        // }
    }

    return <div className={`${className} d-flex flex-column gap-2`}>
        <Form.Group>
            <span onClick={() => logoTypeChange(LogoType.EXTERNAL_LINK)}>
            <Form.Check type="radio" label="Logo from external link" name="project-logo-set-opt"
                value={LogoType.EXTERNAL_LINK} onChange={() => logoTypeChange(LogoType.EXTERNAL_LINK)} checked={type === LogoType.EXTERNAL_LINK} />
            </span>
            <Form.Control type="text" disabled={type !== LogoType.EXTERNAL_LINK}
                placeholder="Enter a valid URL to a picture file." onChange={(e) => onLogoChange(LogoType.EXTERNAL_LINK, e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
            <span onClick={() => logoTypeChange(LogoType.UPLOAD_IMAGE)}>
            <Form.Check type="radio" label="Logo from local image" name="project-logo-set-opt"
                value={LogoType.UPLOAD_IMAGE} onChange={() => logoTypeChange(LogoType.UPLOAD_IMAGE)} checked={type === LogoType.UPLOAD_IMAGE} />
            </span>
            <Form.Control type="file" size="sm" disabled={type !== LogoType.UPLOAD_IMAGE} accept="image/gif, image/jpeg, image/svg+xml, image/png"
                onChange={(e) => onLogoChange(LogoType.UPLOAD_IMAGE, (e.target as HTMLInputElement).files?.[0] ?? null)}/>
        </Form.Group>
        <Form.Group className="mb-3">
            <span onClick={() => logoTypeChange(LogoType.NONE)}>
            <Form.Check type="radio" label="No logo" name="project-logo-set-opt"
                value={LogoType.NONE} onChange={() => logoTypeChange(LogoType.NONE)} checked={type === LogoType.NONE} />
            </span>
            
        </Form.Group>
    </div>;
}