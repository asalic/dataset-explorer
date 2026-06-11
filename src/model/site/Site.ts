import type SiteShort from "./SiteShort";

export default interface Site extends SiteShort {
    country:  string;
    url?: string | null;
    contactName?: string | null;
    contactEmail?: string | null;
}