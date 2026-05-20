import LogoType from "./LogoType";

export default interface Logo {
    type: LogoType;
    logo?: string | File | null;
}
