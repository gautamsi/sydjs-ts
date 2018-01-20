import {
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLEnumType,
} from "graphql";

import * as keystoneTypes from "./keystoneTypes";

import { keystone } from "keystone";
const Meetup = keystone.list("Meetup");
const Talk = keystone.list("Talk");
const User = keystone.list("User");
const RSVP = keystone.list("RSVP");
const Organisation = keystone.list("Organisation");

function getMeetup(id: any) {
    if (id === "next") {
        return Meetup.model.findOne().sort("-startDate")
            .where("state", "active").exec();
    } else if (id === "last") {
        return Meetup.model.findOne().sort("-startDate")
            .where("state", "past").exec();
    } else {
        return Meetup.model.findById(id).exec();
    }
}

const meetupStateEnum = new GraphQLEnumType({
    name: "MeetupState",
    description: "The state of the meetup",
    values: {
        draft: { description: "No published date, it's a draft meetup" },
        scheduled: { description: "Publish date is before today, it's a scheduled meetup" },
        active: { description: "Publish date is after today, it's an active meetup" },
        past: { description: "Meetup date plus one day is after today, it's a past meetup" },
    },
});

const meetupType: any = new GraphQLObjectType({
    name: "Meetup",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: "The name of the meetup.",
        },
        publishedDate: keystoneTypes.date(Meetup.fields["publishedDate"]),
        state: { type: new GraphQLNonNull(meetupStateEnum) },
        startDate: keystoneTypes.datetime(Meetup.fields["startDate"]),
        endDate: keystoneTypes.datetime(Meetup.fields["endDate"]),
        place: { type: GraphQLString },
        map: { type: GraphQLString },
        description: { type: GraphQLString },
        maxRSVPs: { type: new GraphQLNonNull(GraphQLInt) },
        totalRSVPs: { type: new GraphQLNonNull(GraphQLInt) },
        url: { type: GraphQLString },
        remainingRSVPs: { type: new GraphQLNonNull(GraphQLInt) },
        rsvpsAvailable: { type: new GraphQLNonNull(GraphQLBoolean) },
        talks: {
            type: new GraphQLList(talkType),
            resolve: (source, args) =>
                Talk.model.find().where("meetup", source.id).exec(),
        },
        rsvps: {
            type: new GraphQLList(rsvpType),
            resolve: (source, args) =>
                RSVP.model.find().where("meetup", source.id).exec(),
        },
    }),
});

const talkType: any = new GraphQLObjectType({
    name: "Talk",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: "The title of the talk.",
        },
        isLightningTalk: {
            type: GraphQLBoolean,
            description: "Whether the talk is a Lightning talk",
        },
        meetup: {
            type: meetupType,
            description: "The Meetup the talk is scheduled for",
            resolve: (source, args, info) =>
                Meetup.model.findById(source.meetup).exec(),
        },
        who: {
            type: new GraphQLList(userType),
            description: "A list of at least one User running the talk",
            resolve: (source, args, info) =>
                User.model.find().where("_id").in(source.who).exec(),
        },
        description: { type: GraphQLString },
        slides: {
            type: keystoneTypes.link,
            resolve: (source) => ({
                raw: source.slides,
                format: source._.slides.format,
            }),
        },
        link: {
            type: keystoneTypes.link,
            resolve: (source) => ({
                raw: source.link,
                format: source._.link.format,
            }),
        },
    }),
});

const userType: GraphQLObjectType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(keystoneTypes.name) },
        // email: {
        // 	type: keystoneTypes.email,
        // 	resolve: (source) => ({
        // 		email: source.email,
        // 		gravatarUrl: source._.email.gravatarUrl,
        // 	}),
        // },
        talks: {
            type: new GraphQLList(talkType),
            resolve: (source, args) =>
                Talk.model.find().where("who", source.id).exec(),
        },
        rsvps: {
            type: new GraphQLList(rsvpType),
            resolve: (source, args) =>
                RSVP.model.find().where("who", source.id).exec(),
        },
    }),
});

const rsvpType = new GraphQLObjectType({
    name: "RSVP",
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        meetup: {
            type: meetupType,
            resolve: (source) => Meetup.model.findById(source.meetup).exec(),
        },
        who: {
            type: userType,
            resolve: (source) => User.model.findById(source.who).exec(),
        },
        attending: { type: GraphQLBoolean },
        createdAt: keystoneTypes.datetime(Meetup.fields["createdAt"]),
        changedAt: keystoneTypes.datetime(Meetup.fields["changedAt"]),
    },
});

const organisationType = new GraphQLObjectType({
    name: "Organisation",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        logo: { type: keystoneTypes.cloudinaryImage },
        website: { type: GraphQLString },
        isHiring: { type: GraphQLBoolean },
        description: { type: keystoneTypes.markdown },
        location: { type: keystoneTypes.location },
        members: {
            type: new GraphQLList(userType),
            resolve: (source, args) =>
                User.model.find().where("organisation", source.id).exec(),
        },
    }),
});

const queryRootType = new GraphQLObjectType({
    name: "Query",
    fields: {
        meetups: {
            type: new GraphQLList(meetupType),
            resolve: (_, args) =>
                Meetup.model.find().exec(),
        },
        meetup: {
            type: meetupType,
            args: {
                id: {
                    description: 'id of the meetup, can be "next" or "last"',
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
            resolve: (_, args) => getMeetup(args.id),
        },
        talks: {
            type: new GraphQLList(talkType),
            resolve: (_, args) =>
                Talk.model.find().exec(),
        },
        talk: {
            type: talkType,
            args: {
                id: {
                    description: "id of the talk",
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
            resolve: (_, args) => Talk.model.findById(args.id).exec(),
        },
        organisation: {
            type: organisationType,
            args: {
                id: {
                    description: "id of the organisation",
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
            resolve: (_, args) => Organisation.model.findById(args.id).exec(),
        },
        users: {
            type: new GraphQLList(userType),
            resolve: (_, args) =>
                User.model.find().exec(),
        },
        user: {
            type: userType,
            args: {
                id: {
                    description: "id of the user",
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
            resolve: (_, args) => User.model.findById(args.id).exec(),
        },
        rsvp: {
            type: rsvpType,
            args: {
                id: {
                    description: "id of the RSVP",
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
            resolve: (_, args) => RSVP.model.findById(args.id).exec(),
        },
    },
});

export default new GraphQLSchema({
    query: queryRootType,
});
