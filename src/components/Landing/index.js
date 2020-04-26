import React from 'react';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {    this.setState({value: event.target.value});  }

    handleSubmit(event) {
        const usr = JSON.parse(localStorage.getItem('authUser'));
        const friendsList = Object.values(usr).slice()[3];
        console.log(this.state.value);
        if (this.state.value === Object.values(usr).slice()[0])
            console.log("You are not friends with yourself"); // TODO: Display you can't add yourself!
        const friend = this.props.firebase.users().child(event.target.value).username;
        friendsList.push(friend);
        this.props.firebase.users().child(Object.values(usr).slice()[0]).update({
            friends: friendsList.splice(),
        });
        event.preventDefault();
    }

    render() {
        const usr = JSON.parse(localStorage.getItem('authUser')); // user's personal data is stored in 'authUser'
        var username = Object.values(usr).slice()[6];
        
        return (
            <div>
                <div className="colorheader">
                    <h1>Friends</h1>
                </div>
                <hr />
                <div className="colorheader">
                    <h2>Add a Friend</h2>
                </div>
                <center>
                    <form onSubmit={() => this.handleSubmit()}>
                        <label>
                            Enter the Friend's ID:<br />
                            <input type="text" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <br />
                        <input className = "nicesubmit" type="submit" value="Submit" />
                    </form>
                </center>
                <hr />
                <div className="colorheader">
                    <h2>Friend Activity</h2>
                </div>
                {getFriends().slice().map(
                    friend =>
                    <Friend 
                        name={friend.name}
                        pointCount={friend.pointCount}
                        currentUser={username}
                    />
                )}
            </div>
        );
    }
}

function getFriends() { //TODO: RETURN AN ARRAY OF FRIEND OBJECTS
    //each object should contain a name, which corresponds to a string, and a pointCount, which corresponds to an int
    //{ name: "Bob", pointCount: 15 }
    return [{ name: "Bob", pointCount: 0 }, { name: "Derek", pointCount: 15 }, { name: "Jessica", pointCount: -3 }, { name: "Bob", pointCount: 0 }, { name: "Bob", pointCount: 0 },];
}

function Friend(props) {
    const usr = JSON.parse(localStorage.getItem('authUser')); // user's personal data is stored in 'authUser'

    var msg = "";
    var diff = 0;
    var attribute = "friend";
    var myPts = Object.values(usr).slice()[4];
    if (myPts > props.pointCount) {
        diff = myPts - props.pointCount;
        attribute+="green";
        msg = (
        <h4>Congrats!<br /> You have {diff} more points!</h4>
        );
    }
    else if (myPts < props.pointCount) {
        diff = props.pointCount - myPts;
        attribute+="red";
        msg = (
        <h4>You're behind!<br /> Your friend has {diff} more points!</h4>
        );
    }
    else {
        msg = (
            <h4>You're tied for {myPts} points!<br /> See if you can pull ahead!</h4>
        );
    }

    return (
        <div className={attribute}>
            <div className="colorheadernospace">
                <h2>{props.name}</h2>
                <h3>{props.pointCount} points</h3>
                {msg}
            </div>
        </div>
    );
}

export default Landing;