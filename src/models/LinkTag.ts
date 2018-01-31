import { Keystone, FieldTypes as Types } from "keystone";


/**
 * Link Tags Model
 * ===============
 */

const LinkTag = new Keystone.List("LinkTag", {
    autokey: { from: "name", path: "key", unique: true }
});

LinkTag.add({
    name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

LinkTag.relationship({ ref: "Link", refPath: "tags", path: "links" });


/**
 * Registration
 * ============
 */

LinkTag.register();
