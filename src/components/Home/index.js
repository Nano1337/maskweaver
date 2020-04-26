import React from 'react';

import { withAuthorization } from '../Session';

class Home extends React.Component {
    constructor(props) {
        super(props);
        const usr = JSON.parse(localStorage.getItem('authUser'));
        this.state = {
            username: Object.values(usr).slice()[6], // big blob of user data, variable names self explainable
            email: Object.values(usr).slice()[1],
            photos: Object.values(usr).slice()[2],
            friends: Object.values(usr).slice()[3],
            points: Object.values(usr).slice()[4],
        }

    }
    componentDidMount() {
        const usr = JSON.parse(localStorage.getItem('authUser')); // user's personal data is stored in 'authUser'
        this.props.firebase.challenges().on('value', snapshot => {
            const chal = snapshot.val();
            const chalList = Object.keys(chal).map(key => ({ // stores list of challenges as well for ease of use
                ...chal[key],
                cid: key,
            }));
            localStorage.setItem('courses', JSON.stringify(chalList)); // list of challenges is stored in item 'courses'
            this.setState({
                username: Object.values(usr).slice()[6],  // this is repeated elsewhere because I momentarily forgot how to code.
                email: Object.values(usr).slice()[1],
                photos: Object.values(usr).slice()[2],
                friends: Object.values(usr).slice()[3],
                points: Object.values(usr).slice()[4],
                uid: Object.values(usr).slice()[4],
            });
        });
    }

    render() {
        return (
            <div>
                <div className="colorheader">
                    <h1>Add Masks</h1>
                </div>
                
                <Interactions name={this.state.username} photos={this.state.photos} firebase={this.props.firebase} points = {this.props.points}/>
            </div>
        );
    }
}
// here for temporary reading. Feel free to copy methods from here to other places. All functions will be documented.
class Interactions extends React.Component {
    constructor(props) {
        super(props);
        // bind stuff here temporarily

        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);

        this.state = {
            username:  Object.values(JSON.parse(localStorage.getItem('authUser'))).slice()[6],
            image: null, // image reference
            url: '', // database url
            progress: 0, // progress of upload
        }
    }

    handleChange = e => {
        const image = e.target.files[0];
        this.setState({image});
        console.log(this.state.username); // sets the state to include the current file upon adding one

    }

    handleUpload = e => {
        const image = this.state.image;

        const uploadTask = this.props.firebase.storage.ref(`images/${image.name}`).put(image); // uploads image to firebase
        uploadTask.on('state_changed',
            (snapshot) => { // stores
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                this.setState({progress}); // gives a number between 1-100 for percent done uploading
            } ,
            (error) => {
                console.log(error); // if upload errored
            },
            () => { // finishes the function here, adds the url
                // get the uploaded image url back

                const link = uploadTask.snapshot.ref.getDownloadURL().then( url => {
                    console.log(url);
                    const newPhotos = Object.values(JSON.parse(localStorage.getItem('authUser'))).slice()[2];
                    newPhotos.push(url); // adds the url of the photo to be associated with the user
                    console.log(url);
                    const usr = JSON.parse(localStorage.getItem('authUser'));
                    this.props.firebase.users().child(Object.values(usr).slice()[0]).update({
                        photos: newPhotos.slice(),
                    });
                });
            });
    } // please ignore code repetitions. IDK how react works and asynchronous calls, so I just called the original everywhere.

    render () { // file button and upload button
        return (
            <div>
                <center>
                    <div class="upload-btn-wrapper">
                        <button class="btn">Choose a photo</button>
                        <input type= "file" onChange={this.handleChange}/>
                    </div>
                    <br />
                    <button onClick = {this.handleUpload}>Upload</button>
                    <br />
                    {/* <progress value = {this.state.progress} max = "100"/> */ /* Don't really need a progress bar do we */}
                    <br/><br/>
                    <hr />
                    <br/><br/>
                    <img src={this.state.url} alt = "Uploaded Images" height = "300" width = "400" /> {/* TODO: How do we get a list of image links and display them?*/}
                    <br/>
                    
                </center>
            </div>
        )
    }

}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);