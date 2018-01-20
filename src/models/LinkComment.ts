import { Keystone, FieldTypes } from "keystone";
const Types = FieldTypes;

/**
 * Link Comments Model
 * ===================
 */

const LinkComment = new Keystone.List("LinkComment", {
    nocreate: true
});

LinkComment.add({
    link: { type: Types.Relationship, ref: "Link", index: true },
    author: { type: Types.Relationship, ref: "User", index: true },
    date: { type: Types.Date, default: Date.now, index: true },
    content: { type: Types.Markdown }
});


/**
 * Registration
 * ============
 */

LinkComment.defaultColumns = "author, date|20%";
LinkComment.register();
