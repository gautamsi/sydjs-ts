import { keystone, Keystone } from "keystone";
import * as moment from "moment";
const RSVP = keystone.list("RSVP");

const Meetup = keystone.list("Meetup");

export = function (req, res) {

    const view = new Keystone.View(req, res),
        locals = res.locals;

    locals.section = "meetups";
    locals.page.title = "Meetups - SydJS";

    view.query("upcomingMeetup",
        Meetup.model.findOne()
            .where("state", "active")
            .sort("-startDate")
        , "talks[who]");

    view.query("pastMeetups",
        Meetup.model.find()
            .where("state", "past")
            .sort("-startDate")
        , "talks[who]");

    view.on("render", function (next) {

        if (!req.user || !locals.upcomingMeetup) return next();

        RSVP.model.findOne()
            .where("who", req.user._id)
            .where("meetup", locals.upcomingMeetup)
            .exec(function (err, rsvp) {
                locals.rsvpStatus = {
                    rsvped: rsvp ? true : false,
                    attending: rsvp && rsvp.attending ? true : false
                };
                return next();
            });

    });

    view.render("site/meetups");

};
