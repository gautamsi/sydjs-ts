import * as keystone from "keystone";
import * as _ from "lodash";

const User = keystone.list("User");
const Organisation = keystone.list("Organisation");

export = function (req, res) {

    const view = new keystone.View(req, res);
    const locals = res.locals;

    locals.section = "showbag";
    locals.page.title = "SydJS Showbag";

    Organisation.model.findOne().where("key", "thinkmill").exec(function (err, thinkmill) {
        if (err || !thinkmill) {
            return view.render("errors/500");
        }
        locals.thinkmill = thinkmill;

        view.query("members", User.model.find().where({ organisation: thinkmill.id }));
        view.render("site/showbag");

    });

};
