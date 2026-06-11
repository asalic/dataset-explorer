import { useState } from "react";
import { Form } from "react-bootstrap";
import LogoAdmin from "../../../../../project/LogoAdmin";
import type Logo from "../../../../../../model/project/Logo";
import LogoType from "../../../../../../model/project/LogoType";

interface BodyProjectLogoProps{
    // oldValue: Logo;
    updValue: Function;
}

export default function BodyProjectLogo({ updValue }: BodyProjectLogoProps): JSX.Element {

    const [logo, setLogo] = useState<Logo>({ type: LogoType.NONE });
    const onLogoSet = (logoNew: Logo) => {
        setLogo(logoNew);
        updValue(logoNew);
    }
    return <Form className="px-4">
        <LogoAdmin onLogoSet={onLogoSet} externalLogo={logo}/>
    </Form>

}