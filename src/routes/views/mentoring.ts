import { Keystone } from "keystone";

export = function (req, res) {

    const view = new Keystone.View(req, res),
        locals = res.locals;

    locals.section = "mentoring";

    view.render("site/mentoring");

};
