import { Keystone } from "keystone";

export = function (req, res) {

    const view = new Keystone.View(req, res),
        locals = res.locals;

    locals.section = "session";

    Keystone.session.signout(req, res, function () {
        res.redirect("/");
    });

};
