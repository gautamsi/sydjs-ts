import { keystone } from "keystone";
import * as _ from "lodash";
import * as querystring from "querystring";


/**
 * Initialises the standard view locals
 */

export function initLocals(req, res, next) {

    const locals = res.locals;

    locals.navLinks = [
        { label: "Home", key: "home", href: "/" },
        { label: "Code of Conduct", key: "about", href: "/about#CoC" },
        { label: "Meetups", key: "meetups", href: "/meetups" },
        { label: "Members", key: "members", href: "/members" },
        { label: "Showbag", key: "showbag", href: "/showbag" }
    ];

    locals.user = req.user;

    locals.basedir = keystone.get("basedir");

    locals.page = {
        title: "SydJS",
        path: req.url.split("?")[0] // strip the query - handy for redirecting back to the page
    };

    locals.qs_set = qs_set(req, res);

    if (req.cookies.target && req.cookies.target == locals.page.path) res.clearCookie("target");

    const bowser = require("../lib/node-bowser").detect(req);

    locals.system = {
        mobile: bowser.mobile,
        ios: bowser.ios,
        iphone: bowser.iphone,
        ipad: bowser.ipad,
        android: bowser.android
    };

    next();

}


/**
 * Make sponsors universally available
 */

export function loadSponsors(req, res, next) {
    keystone.list("Organisation").model.find().sort("name").exec(function (err, sponsors) {
        if (err) return next(err);
        req.sponsors = sponsors;
        res.locals.sponsors = sponsors;
        next();
    });
}


/**
 * Inits the error handler functions into `req`
 */

export function initErrorHandlers(req, res, next) {
    res.err = function (err, title, message) {
        res.status(500).render("errors/500", {
            err: err,
            errorTitle: title,
            errorMsg: message
        });
    };
    res.notfound = function (title, message) {
        res.status(404).render("errors/404", {
            errorTitle: title,
            errorMsg: message
        });
    };
    next();
}


/**
 * Fetches and clears the flashMessages before a view is rendered
 */

export function flashMessages(req, res, next) {
    const flashMessages = {
        info: req.flash("info"),
        success: req.flash("success"),
        warning: req.flash("warning"),
        error: req.flash("error")
    };
    res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
    next();
}

/**
 * Prevents people from accessing protected pages when they're not signed in
 */

export function requireUser(req, res, next) {
    if (!req.user) {
        req.flash("error", "Please sign in to access this page.");
        res.redirect("/signin");
    } else {
        next();
    }
}

/**
 * Returns a closure that can be used within views to change a parameter in the query string
 * while preserving the rest.
 */

export function qs_set(req, res) {
    return function qs_set(obj) {
        const params = _.clone(req.query);
        for (const i in obj) {
            if (obj[i] === undefined || obj[i] === null) {
                delete params[i];
            } else if (obj.hasOwnProperty(i)) {
                params[i] = obj[i];
            }
        }
        const qs = querystring.stringify(params);
        return req.path + (qs ? "?" + qs : "");
    };
}
