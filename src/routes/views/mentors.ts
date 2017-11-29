import * as keystone from "keystone";

const User = keystone.list("User");

export = function (req, res) {

    const view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = "members";

    view.query("members", User.model.find().sort("name").where("isPublic", true).populate("organisation").where("mentoring.available", true), "posts talks[meetup]");

    view.render("site/mentors");
};
