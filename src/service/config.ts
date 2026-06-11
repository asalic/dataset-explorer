// import Config from "../../public/config.json";
import type ConfigJson from "../model/ConfigJson";
// const response = await fetch(`${(globalThis as any)["DYNAMIC_PUBLIC_URL"]}/config.json`);

const { protocol, hostname, port } = window.location;
const publicURL = `${protocol}//${hostname}${port ? `:${port}` : ''}${import.meta.env.BASE_URL}`;//(globalThis as any).PUBLIC_URL;

console.log(publicURL)
const response = await fetch(`${publicURL}/config.json`);
const j = await response.json();
if (!j["publicURL"]) {
    console.log(`publicURL not set in config, setting it now to '${publicURL}'`)
    j["publicURL"] = publicURL; 
}
const config: ConfigJson = j as ConfigJson;

export default config;