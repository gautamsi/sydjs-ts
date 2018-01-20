import { keystone } from "keystone";
import * as async from "async";
const User = keystone.list("User");

const admins = [
    { email: "user@keystonejs.com", password: "admin", name: { first: "Admin", last: "User" } }
];

function createAdmin(admin, done) {
    User.model.findOne({ email: admin.email }).exec(function (err, user) {
        admin.isAdmin = true;
        new User.model(admin).save(function (err) {
            if (err) {
                console.error("Error adding admin " + admin.email + " to the database:");
                console.error(err);
            } else {
                console.log("Added admin " + admin.email + " to the database.");
            }
            done();
        });
    });
}

export = function (done) {
    async.forEach(admins, createAdmin, done);
};
