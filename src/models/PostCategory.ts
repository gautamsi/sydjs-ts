import { Keystone, FieldTypes } from "keystone";
const Types = FieldTypes;

/**
 * Post Categories Model
 * =====================
 */

const PostCategory = new Keystone.List("PostCategory", {
    track: true,
    autokey: { from: "name", path: "key", unique: true }
});

PostCategory.add({
    name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

PostCategory.relationship({ ref: "Post", refPath: "categories", path: "posts" });


/**
 * Registration
 * ============
 */

PostCategory.register();
