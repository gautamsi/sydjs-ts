const _ = require("lodash");
const Store = require("store-prototype");
const request = require("superagent");

const RSVPStore = new Store();

declare var SydJS;

let loaded = false;
let busy = false;
let meetup = {};
let rsvp = {};
let attendees: any[] = [];

const REFRESH_INTERVAL = 5000; // 5 seconds

let refreshTimeout: any = null;
function cancelRefresh() {
    clearTimeout(refreshTimeout);
}

RSVPStore.extend({

    getMeetup: function () {
        return meetup;
    },

    getRSVP: function () {
        return rsvp;
    },

    getAttendees: function (callback: any) {
        return attendees;
    },

    rsvp: function (attending: any, callback: any) {
        if (busy) return;
        cancelRefresh();
        busy = true;
        RSVPStore.notifyChange();
        request
            .post("/api/me/meetup")
            .send({
                data: {
                    meetup: SydJS.currentMeetupId,
                    attending: attending
                }
            })
            .end(function (err: any, res: any) {
                if (err) {
                    console.log("Error with the AJAX request: ", err);
                    return;
                }
                RSVPStore.getMeetupData();
            });
    },

    isLoaded: function () {
        return loaded;
    },

    isBusy: function () {
        return busy;
    },

    getMeetupData: function (callback: any) {
        // ensure any scheduled refresh is stopped,
        // in case this was called directly
        cancelRefresh();
        // request the update from the API
        busy = true;
        request
            .get("/api/meetup/" + SydJS.currentMeetupId)
            .end(function (err: any, res: any) {
                if (err) {
                    console.log("Error with the AJAX request: ", err);
                }
                busy = false;
                if (!err && res.body) {
                    loaded = true;
                    meetup = res.body.meetup;
                    rsvp = res.body.rsvp;
                    attendees = res.body.attendees;
                    RSVPStore.notifyChange();
                }
                RSVPStore.queueMeetupRefresh();
                return callback && callback(err, res.body);
            });
    },

    queueMeetupRefresh: function () {
        refreshTimeout = setTimeout(RSVPStore.getMeetupData, REFRESH_INTERVAL);
    }

});

RSVPStore.getMeetupData();
export = RSVPStore;
