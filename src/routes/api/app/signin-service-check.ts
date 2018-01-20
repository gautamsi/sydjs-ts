import { keystone, Keystone } from "keystone";
import * as async from "async";
import * as request from "request";
import * as _ from "lodash";
const User = keystone.list("User");

export = function (req, res) {

    const locals: any = {
        authUser: req.body.authUser,

        existingUser: false
    };

    // Function to handle signin
    const doSignIn = function () {

        console.log("[api.app.service]  - Signing in user...");
        console.log("------------------------------------------------------------");

        const onSuccess = function (user) {
            console.log("[api.app.service]  - Successfully signed in.");
            console.log("------------------------------------------------------------");
            return res.apiResponse({
                success: true,
                session: true,
                date: new Date().getTime(),
                userId: user.id
            });
        };

        const onFail = function (err) {
            console.log("[api.app.service]  - Failed signing in.", err);
            console.log("------------------------------------------------------------");
            return res.apiResponse({
                success: false,
                session: false,
                message: (err && err.message ? err.message : false) || "Sorry, there was an issue signing you in, please try again."
            });
        };

        Keystone.session.signin(String(locals.existingUser._id), req, res, onSuccess, onFail);

    };

    // Function to handle data confirmation process
    async.series([

        // Check for user by profile id (only if not signed in)
        function (next) {

            console.log("[api.app.service]  - Searching for existing users via [" + locals.authUser.type + "] profile id...");
            console.log("------------------------------------------------------------");

            const query = User.model.findOne();
            query.where("services." + locals.authUser.type + ".profileId", locals.authUser.profileId);
            query.exec(function (err, user) {
                if (err) {
                    console.log("[api.app.service]  - Error finding existing user via profile id.", err);
                    console.log("------------------------------------------------------------");
                    return next({ message: "Sorry, there was an error processing your information, please try again." });
                }
                if (user) {
                    console.log("[api.app.service]  - Found existing user via [" + locals.authUser.type + "] profile id...");
                    console.log("------------------------------------------------------------");
                    locals.existingUser = user;
                    return doSignIn();
                }
                return next();
            });

        },

        // Return that no existing user exists
        function () {
            console.log("[api.app.service]  - No existing user detected.");
            console.log("------------------------------------------------------------");
            return res.apiResponse({
                success: true,
                session: false,
                date: new Date().getTime(),
                userId: false
            });
        }

    ], function (err: Error) {
        if (err) {
            console.log("[api.app.service]  - Issue signing user in.", err);
            console.log("------------------------------------------------------------");
            return res.apiResponse({
                success: false,
                session: false,
                message: (err && err.message ? err.message : false) || "Sorry, there was an issue signing you in, please try again."
            });
        }
    });

};
