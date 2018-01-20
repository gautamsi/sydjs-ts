import * as async from "async";
import * as moment from "moment";
import { keystone } from "keystone";

const Meetup = keystone.list("Meetup");
const RSVP = keystone.list("RSVP");
const User = keystone.list("User");
const Post = keystone.list("Post");

export = function (req, res) {

    const stats: any = {};

    async.parallel([

        function (next) {

            Meetup.model.findOne()
                .where("startDate").gte(moment().startOf("day").toDate())
                .where("state", "published")
                .sort("startDate")
                .exec(function (err, meetup) {

                    RSVP.model.count({
                        meetup: meetup,
                        attending: true
                    })
                        .exec(function (err, count) {
                            stats.rsvps = count;
                            return next();
                        });

                });

        },

        function (next) {

            User.model.count()
                .exec(function (err, count) {
                    stats.members = count;
                    return next();
                });

        },

        function (next) {

            Post.model.count()
                .exec(function (err, count) {
                    stats.posts = count;
                    return next();
                });

        }

    ], function (err) {

        return res.apiResponse(stats);

    });

};
