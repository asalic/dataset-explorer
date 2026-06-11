import { SlashCircle } from "react-bootstrap-icons";

function NoLogoAvailable({}): JSX.Element {
    return <div className="w-100 h-100 d-flex flex-wrap flex-row justify-content-center align-content-center text-secondary">
            <SlashCircle className="me-1 mt-1"></SlashCircle>
            <b>No logo available</b>
        </div>
}

export default NoLogoAvailable;