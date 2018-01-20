import { Keystone, FieldTypes } from "keystone";
const Types = FieldTypes;

/**
 * Organisations Model
 * ===================
 */

const Organisation = new Keystone.List("Organisation", {
    track: true,
    autokey: { path: "key", from: "name", unique: true }
});

Organisation.add({
    name: { type: String, index: true },
    logo: { type: Types.CloudinaryImage },
    website: Types.Url,
    isHiring: Boolean,
    description: { type: Types.Markdown },
    location: Types.Location
});


/**
 * Relationships
 * =============
 */

Organisation.relationship({ ref: "User", refPath: "organisation", path: "members" });


/**
 * Registration
 * ============
 */

Organisation.defaultColumns = "name, website, isHiring";
Organisation.register();
