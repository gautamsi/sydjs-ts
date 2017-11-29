import * as keystone from "keystone";

const Organisation = keystone.list("Organisation");

export = function (req, res) {

    const view = new keystone.View(req, res);
    const locals = res.locals;

    // locals.section = 'members';

    view.query("organisations", Organisation.model.find().sort("name"), "members");

    view.render("site/organisations");

};
