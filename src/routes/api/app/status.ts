import * as keystone from "keystone";
import * as async from "async";
import * as _ from "lodash";
import * as	moment from "moment";
import { createHash } from "crypto";

export = function (req, res) {

    const data: any = { meetups: {}, talks: {}, rsvp: {}, user: {} };

    async.series([
        function (next) {
            if (!req.body.user) return next();
            keystone.list("User").model.findById(req.body.user).exec(function (err, user) {
                if (err || !user) return next();
                data.user = user;
                return next();
            });
        },
        function (next) {
            keystone.list("Meetup").model.findOne()
                .where("state", "past")
                .sort("-startDate")
                .exec(function (err, meetup) {
                    data.meetups.last = meetup ? meetup.toJSON() : false;
                    return next();
                });
        },
        function (next) {
            keystone.list("Meetup").model.findOne()
                .where("state", "active")
                .sort("-startDate")
                .exec(function (err, meetup) {
                    data.meetups.next = meetup ? meetup.toJSON() : false;
                    return next();
                });
        },
        function (next) {
            if (!data.meetups.last) return next();
            keystone.list("Talk").model.find()
                .where("meetup", data.meetups.last)
                .populate("who")
                .sort("sortOrder")
                .exec(function (err, talks) {
                    data.talks.last = talks && talks.length ? talks.map(function (i) {
                        return i.toJSON();
                    }) : false;
                    return next();
                });
        },
        function (next) {
            if (!data.meetups.next) return next();
            keystone.list("Talk").model.find()
                .where("meetup", data.meetups.next)
                .populate("who")
                .sort("sortOrder")
                .exec(function (err, talks) {
                    data.talks.next = talks && talks.length ? talks.map(function (i) {
                        return i.toJSON();
                    }) : false;
                    return next();
                });
        },
        function (next) {
            if (!req.body.user) return next();
            if (!data.meetups.next) return next();
            keystone.list("RSVP").model.findOne()
                .where("who", data.user)
                .where("meetup", data.meetups.next)
                .exec(function (err, rsvp) {
                    data.rsvp = rsvp;
                    return next();
                });
        }
    ], function (err) {

        const response = {
            success: true,
            config: {
                versions: {
                    compatibility: process.env.APP_COMPATIBILITY_VERSION,
                    production: process.env.APP_PRODUCTION_VERSION
                },
                killSwitch: false
            },
            meetups: {
                last: false,
                next: false
            },
            rsvp: {
                responded: false,
                attending: false,
                date: undefined
            },
            user: false
        };

        const parseMeetup = function (meetup, current?) {
            const meetupData: any = {
                id: meetup._id,

                name: meetup.name,

                starts: meetup.startDate,
                ends: meetup.endDate,

                place: meetup.place,
                map: meetup.map,

                description: keystone.utils.cropString(keystone.utils.htmlToText(meetup.description), 250, "...", true),

                ticketsAvailable: meetup.rsvpsAvailable,
                ticketsRemaining: meetup.remainingRSVPs,

                talks: current ? data.talks.next : data.talks.last
            };
            meetupData.hash = createHash("md5").update(JSON.stringify(meetupData)).digest("hex");
            return meetupData;
        };

        if (data.meetups.last) {
            response.meetups.last = parseMeetup(data.meetups.last);
        }

        if (data.meetups.next && moment().isBefore(data.meetups.next.endDate)) {
            response.meetups.next = parseMeetup(data.meetups.next, true);
            if (data.user) {
                response.rsvp.responded = data.rsvp ? true : false;
                response.rsvp.attending = data.rsvp && data.rsvp.attending ? true : false;
                response.rsvp.date = data.rsvp ? data.rsvp.changedAt : false;
            }
        }

        if (data.user) {
            response.user = <any>{
                date: new Date().getTime(),
                userId: data.user.id,
                name: {
                    first: data.user.name.first,
                    last: data.user.name.last,
                    full: data.user.name.full
                },
                email: data.user.email,
                avatar: data.user.avatarUrl
            };
        }

        res.apiResponse(response);

    });
};
