import React from 'react';

import { withAuthorization } from '../Session';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.getFriends = this.getFriends.bind(this);
        this.addCourse = this.addCourse.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {    this.setState({value: event.target.value});  }

    // handleSubmit(event) { 
        
    //     event.preventDefault();
    // }

    addCourse(nameOfCourse) { //Writes correctly, albeit infinitely
        console.log('hi');
        
        const usr = JSON.parse(localStorage.getItem('authUser'));
        var newCourses = Object.values(usr).slice()[2];
        newCourses.push(nameOfCourse);
        console.log(newCourses);
        this.setState({
            arrCourses: newCourses.slice(),
        });

        // console.log(Object.values(usr).slice()[2]);
        localStorage.setItem('authUser', JSON.stringify(usr));
        // console.log(Object.values(usr).slice()[2]);
        // this.props.firebase.users().child(Object.values(usr).slice()[0]).update({
        //     friends: newCourses.slice(),
        // });
    }

    getFriends() { 
        //TODO: RETURN AN ARRAY OF FRIEND OBJECTS FROM THE DATABASE FOR THE CURRENT USER
        //to help, use something similar to lines 48-49 to get current user username/uid or whatever
        //in the output, each object should contain a name, which corresponds to a string, and a pointCount, which corresponds to an int
        //{ name: "Bob", pointCount: 15 }
        //the return statement below is just dummy code. pls remove
        return [{ name: "Bob", pointCount: 0 }, { name: "Derek", pointCount: 15 }, { name: "Jessica", pointCount: -3 }, { name: "Bob", pointCount: 0 }, { name: "Bob", pointCount: 0 },];
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
                    {/* <form onSubmit={this.handleSubmit}>
                        <label>
                            Enter the Friend's ID:<br />
                            <input type="text" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <br />
                        <input className = "nicesubmit" type="submit" value="Submit" />
                    </form> */}
                    <NameForm addCourse={this.addCourse} firebase = {this.props.firebase}/>
                </center>
                <hr />
                <div className="colorheader">
                    <h2>Friend Activity</h2>
                </div>
                {this.getFriends().slice().map(
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

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {    this.setState({value: event.target.value});  }

    handleSubmit(event) { //plugs into the backend to add the course, and passes the function on up for the main container to do the re-rendering
        let shouldAddCourse = false;

        //TODO: MAKE THIS LINE OF CODE, #102, GET A TOTAL ARRAY OF ALL UIDS IN THE DATABASE
        this.props.firebase.users().on('value', snapshot => {
            const userObject = snapshot.val();
            const userList = Object.keys(userObject).map(key => ({
                ...userObject[key],
                uid: key,
            }));
            localStorage.setItem('users', JSON.stringify(userList));
            var allEntries = JSON.parse(localStorage.getItem('users'));

            for (let i = 0, len = allEntries.length; i < len; ++i) {
                var course = allEntries[i];
                if (course.uid === this.state.value) {
                    shouldAddCourse = true;
                    console.log("yeah");
                }
            }

            if (shouldAddCourse) {
                this.props.addCourse(this.state.value);
            } else {
                alert('Sorry, ID not found');
            }
        });
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Enter Friend ID below:<br /><br />
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <br /><br />
                <input className = "nicesubmit" type="submit" value="Submit" />
            </form>
        );
    }
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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Landing);