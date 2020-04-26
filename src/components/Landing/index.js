import React from 'react';

class Landing extends React.Component {
    render() {
        const usr = JSON.parse(localStorage.getItem('authUser')); // user's personal data is stored in 'authUser'
        var username = Object.values(usr).slice()[6];
        
        return (
            <div>
                <div className="colorheader">
                    <h1>Friends</h1>
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