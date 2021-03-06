import * as keystone from "keystone";
import * as async from "async";
import * as request from "request";
import * as _ from "lodash";
const User = keystone.list("User");

export = function (req, res) {

    const locals: any = {
        authUser: req.body.authUser,
        form: req.body.form,

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

        keystone.session.signin(String(locals.existingUser._id), req, res, onSuccess, onFail);

    };

    // Function to handle data confirmation process
    async.series([

        // Check for user by email (only if not signed in)
        function (next) {

            if (locals.existingUser) return next();

            console.log("[api.app.service]  - Searching for existing users via [" + locals.form.email + "] email address...");
            console.log("------------------------------------------------------------");

            const query = User.model.findOne();
            query.where("email", locals.form.email);
            query.exec(function (err, user) {
                if (err) {
                    console.log("[api.app.service]  - Error finding existing user via email.", err);
                    console.log("------------------------------------------------------------");
                    return next({ message: "Sorry, there was an error processing your information, please try again.", name: "" });
                }
                if (user) {
                    console.log("[api.app.service]  - Found existing user via email address...");
                    console.log("------------------------------------------------------------");
                    return next({ message: "There's already an account with that email address, please sign-in instead.", name: "" });
                }
                return next();
            });

        },

        // Create or update user
        function (next) {

            if (locals.existingUser) {

                console.log("[api.app.service]  - Existing user found, updating...");
                console.log("------------------------------------------------------------");

                const userData = {
                    state: "enabled",

                    website: locals.form.website,

                    isVerified: true,

                    services: locals.existingUser.services || {}
                };

                _.extend(userData.services[locals.authUser.type], {
                    isConfigured: true,

                    profileId: locals.authUser.profileId,

                    username: locals.authUser.username,
                    avatar: locals.authUser.avatar,

                    accessToken: locals.authUser.accessToken,
                    refreshToken: locals.authUser.refreshToken
                });

                // console.log('[api.app.service]  - Existing user data:', userData);

                locals.existingUser.set(userData);

                locals.existingUser.save(function (err) {
                    if (err) {
                        console.log("[api.app.service]  - Error saving existing user.", err);
                        console.log("------------------------------------------------------------");
                        return next(err);
                    }
                    console.log("[api.app.service]  - Saved existing user.");
                    console.log("------------------------------------------------------------");
                    return next();
                });

            } else {

                console.log("[api.app.service]  - Creating new user...");
                console.log("------------------------------------------------------------");

                const userData = {
                    name: {
                        first: locals.form["name.first"],
                        last: locals.form["name.last"]
                    },
                    email: locals.form.email,
                    password: Math.random().toString(36).slice(-8),

                    state: "enabled",

                    website: locals.form.website,

                    isVerified: true,

                    notifications: {
                        posts: locals.form.alertsNotifications,
                        meetups: locals.form.alertsNotifications
                    },

                    services: {}
                };

                userData.services[locals.authUser.type] = {
                    isConfigured: true,

                    profileId: locals.authUser.profileId,

                    username: locals.authUser.username,
                    avatar: locals.authUser.avatar,

                    accessToken: locals.authUser.accessToken,
                    refreshToken: locals.authUser.refreshToken
                };

                // console.log('[api.app.service]  - New user data:', userData );

                locals.existingUser = new User.model(userData);

                locals.existingUser.save(function (err) {
                    if (err) {
                        console.log("[api.app.service]  - Error saving new user.", err);
                        console.log("------------------------------------------------------------");
                        return next({ message: "Sorry, there was an error processing your account, please try again.", name: "" });
                    }
                    console.log("[api.app.service]  - Saved new user.");
                    console.log("------------------------------------------------------------");
                    return next();
                });

            }

        },

        // Session
        function () {
            if (req.user) {
                console.log("[api.app.service]  - Already signed in, skipping sign in.");
                console.log("------------------------------------------------------------");
                return res.apiResponse({
                    success: true,
                    session: true,
                    date: new Date().getTime(),
                    userId: req.user.id
                });
            }
            return doSignIn();
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
