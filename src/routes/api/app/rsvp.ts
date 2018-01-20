import * as async from "async";
import { keystone } from "keystone";
const RSVP = keystone.list("RSVP");
const User = keystone.list("User");

export = function (req, res) {

    User.model.findById(req.body.user).exec(function (err, user) {
        if (err || !user) return res.apiResponse({ success: false });
        RSVP.model.findOne()
            .where("who", user)
            .where("meetup", req.body.meetup)
            .exec(function (err, rsvp) {

                if (rsvp) {

                    if (req.body.attending == "false" && req.body.cancel == "true") {
                        console.log("[api.app.rsvp] - Existing RSVP found, deleting...");
                        rsvp.remove(function (err) {
                            if (err) return res.apiResponse({ success: false, err: err });
                            console.log("[api.app.rsvp] - Deleted RSVP.");
                            return res.apiResponse({ success: true });
                        });
                    } else {
                        console.log("[api.app.rsvp] - Existing RSVP found, updating...");
                        rsvp.set({
                            attending: req.body.attending == "true",
                            changedAt: req.body.changed
                        }).save(function (err) {
                            if (err) return res.apiResponse({ success: false, err: err });
                            console.log("[api.app.rsvp] - Updated RSVP.");
                            return res.apiResponse({ success: true });
                        });
                    }

                } else {

                    console.log("[api.app.rsvp] - No RSVP found, creating...");

                    new RSVP.model(<any>{
                        meetup: req.body.meetup,
                        who: user,
                        attending: req.body.attending == "true",
                        changedAt: req.body.changed
                    }).save(function (err) {
                        if (err) return res.apiResponse({ success: false, err: err });
                        console.log("[api.app.rsvp] - Created RSVP.");
                        return res.apiResponse({ success: true });
                    });

                }

            });
    });

};
