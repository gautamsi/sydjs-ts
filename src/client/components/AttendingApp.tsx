import * as React from "react";
import request = require("superagent");
import * as RSVPStore from "../stores/RSVPStore";
import * as createReactClass from "create-react-class";

const AttendingApp = /*React.createClass*/ createReactClass({

    getInitialState: function () {
        return {
            isReady: RSVPStore.isLoaded(),
            attendees: RSVPStore.getAttendees()
        };
    },

    componentDidMount: function () {
        RSVPStore.addChangeListener(this.updateStateFromStore);
    },

    componentWillUnmount: function () {
        RSVPStore.removeChangeListener(this.updateStateFromStore);
    },

    updateStateFromStore: function () {
        this.setState({
            isReady: RSVPStore.isLoaded(),
            attendees: RSVPStore.getAttendees()
        });
    },

    renderHeading: function () {
        if (!this.state.isReady) return <h3 className="heading-with-line" >...</h3>;
        const count = this.state.attendees ? this.state.attendees.length : "...";
        const plural = count === 1 ? " person is" : " people are";
        return <h3 className="heading-with-line"> {count + plural} attending</ h3 >;
    },

    render: function () {
        let attendeesList;
        if (this.state.isReady) {
            attendeesList = this.state.attendees.map(function (person: any) {
                return <li key={person.id}> <a href={person.url}> <img width="40" height="40" alt={person.name} className="img-circle" src={person.photo ? person.photo : "/images/avatar.png"} /></a></li>;
            });
        }
        return (
            <div>
                <section className="attending" >
                    {this.renderHeading()}
                    <ul className="list-unstyled list-inline text-center attendees-list" >
                        {attendeesList}
                    </ul>
                </section>
            </div>
        );
    }

});

export = AttendingApp;
