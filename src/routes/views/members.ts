import * as keystone from "keystone";
import * as _ from "lodash";

const User = keystone.list("User");

export = function (req, res) {

    const view = new keystone.View(req, res);
    const locals = res.locals;

    locals.section = "members";
    locals.page.title = "Members - SydJS";


    // Load Organisers
    view.on("init", function (next) {
        User.model.find()
            .sort("name.first")
            .where("isPublic", true)
            .where("isOrganiser", true)
            .exec(function (err, organisers) {
                if (err) res.err(err);
                locals.organisers = organisers;
                next();
            });
    });


    // Load Speakers

    view.on("init", function (next) {
        User.model.find()
            .sort("-talkCount name.first")
            .where("isPublic", true)
            .where("talkCount").gt(0)
            .exec(function (err, speakers) {
                if (err) res.err(err);
                locals.speakers = speakers;
                next();
            });
    });


    // Pluck IDs for filtering Community

    view.on("init", function (next) {
        locals.organiserIDs = _.map(locals.organisers, "id");
        locals.speakerIDs = _.map(locals.speakers, "id");
        next();
    });


    // Load Community

    view.on("init", function (next) {
        User.model.find()
            .sort("-lastRSVP")
            .where("isPublic", true)
            .where("_id").nin(locals.organiserIDs)
            .where("_id").nin(locals.speakerIDs)
            .exec(function (err, community) {
                if (err) res.err(err);
                locals.community = community;
                next();
            });
    });


    view.render("site/members");
};
