import * as keystone from "keystone";

const Link = keystone.list("Link");
const LinkComment = keystone.list("LinkComment");

export = function (req, res) {

    const view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = "links";
    locals.filters = {
        link: req.params.link
    };

    view.on("init", function (next) {

        Link.model.findOne()
            .where("state", "published")
            .where("slug", locals.filters.link)
            .populate("author categories")
            .exec(function (err, link) {
                if (err) return res.err(err);
                if (!link) return res.notfound("Link not found");
                locals.link = link;
                locals.link.populateRelated("comments[author]", next);
            });

    });

    view.on("post", { action: "create-comment" }, function (next) {

        // handle form
        const newLinkComment = new LinkComment.model(<any>{
            link: locals.link.id,
            author: locals.user.id
        });
        const updater = newLinkComment.getUpdateHandler(req, res, {
            errorMessage: "There was an error creating your comment:"
        });

        updater.process(req.body, {
            flashErrors: true,
            logErrors: true,
            fields: "content"
        }, function (err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                req.flash("success", "Your comment has been added successfully.");
                return res.redirect("/links/link/" + locals.link.slug);
            }
            next();
        });

    });

    // Render the view
    view.render("site/link");

};
