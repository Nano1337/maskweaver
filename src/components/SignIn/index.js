import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import YouTube from 'react-youtube';
import {useEffect, useState} from 'react';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// Hook

function useWindowSize() {

    // Initialize state with undefined width/height so server and client renders match
  
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  
    const [windowSize, setWindowSize] = useState({
  
      width: undefined,
  
      height: undefined,
  
    });
  
  
  
    useEffect(() => {
  
      // Handler to call on window resize
  
      function handleResize() {
  
        // Set window width/height to state
  
        setWindowSize({
  
          width: window.innerWidth,
  
          height: window.innerHeight,
  
        });
  
      }
  
      
  
      // Add event listener
  
      window.addEventListener("resize", handleResize);
  
      
  
      // Call handler right away so state gets updated with initial window size
  
      handleResize();
  
      
  
      // Remove event listener on cleanup
  
      return () => window.removeEventListener("resize", handleResize);
  
    }, []); // Empty array ensures that effect is only run on mount
  
  
  
    return windowSize;
  
  }

  function YouTube(props) {
      var src = "https://www.youtube.com/embed/" + props.videoId + "?autoplay=1" + "&start=" + props.opts.playerVars.start + "&end=" + props.opts.playerVars.end;
      return (
            <iframe id="ytplayer" type="text/html" width={props.opts.width} height={props.opts.height}
            src={src}
            frameborder="0"></iframe>
      );
  }

  function MasterYouTube(props) {
    var src = "https://www.youtube.com/embed/" + props.videoId + "?autoplay=1";
    return (
          <iframe id="ytplayer" type="text/html" width={props.opts.width} height={props.opts.height}
          src={src}
          frameborder="0"></iframe>
    );
}

function VideoTile(props) { 

    let opts;
    if (props.mode===2) {
        opts = {
            height: ((parseInt(props.height))/2)+"",
            width: ((parseInt(props.width))/2)+"",
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                start: props.start,
                end: props.end,
            },
        };
    } 
    if (props.mode===1) {
        opts = {
            height: props.height+"",
            width: props.width+"",
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
              start: props.start,
              end: props.end,
            },
        };
    }

    if (props.visible===true) {
        return (
            <div class="videotile" id={props.vidid}>
                {/* x button */}
                <YouTube videoId={props.vidid} opts={opts}/>;
            </div>
        )
    } else {
        return (<></>);
    }
    
}

function MasterVideoTile(props) {

    var myConfObj = {
        iframeMouseOver : false
    }
    window.addEventListener('blur',function(){
    if(myConfObj.iframeMouseOver){
        console.log('Wow! Iframe Click!');
        props.clickedVid();
    }
    });
    
    function thing1() {
        myConfObj.iframeMouseOver = true;
    }
    function thing2() {
        myConfObj.iframeMouseOver = false;
    }

    //

    let opts;
    if (props.mode===2) {
        opts = {
            height: ((parseInt(props.height))/2)+"",
            width: ((parseInt(props.width))/2)+"",
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                start: 0,
                end: 0,
            },
        };
    } 
    if (props.mode===1) {
        opts = {
            height: props.height+"",
            width: props.width+"",
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
              start: 0,
              end: 0,
            },
        };
    }
    
    return (
        <div class="videotile" id={props.vidid} onMouseOver={thing1} onMouseOut={thing2}>
            <h2>Once you begin playing the video, you can't pause it (or the videos will get out of sync!)</h2>
            <h5>{props.seconds}</h5>
            <MasterYouTube videoId={props.vidid} opts={opts} />;
        </div>
    )
}

function ViewVideoPage() {
    const size = useWindowSize();
    const [mode, setMode] = useState(2); //1 indicates only 1 video playing, 2 indicates 2 videos playing
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    function toggle() {
        setIsActive(!isActive);
    }

    var executed = false;
    function clickedVid() {
        if (!executed) {
            executed = true;
            toggle();
        }
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
        interval = setInterval(() => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
        } else if (!isActive && seconds !== 0) {
        clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    var sessionid = window.location.href.substring((window.location.href.indexOf("?")+4));

    var masteryoutubelinkid = "k0EJ0Lk3dT8"; //temp fill
    var arrayOfDelayStartSeconds = [15, 250]; //temp fill
    var arrayOfDelayEndSeconds = [222, 275]; //temp fill
    var arrayOfClipStartSeconds = [0, 7]; //temp fill
    var arrayOfClipLinkIDs = ["-5q5mZbe3V8", "-5q5mZbe3V8"]; //temp fill
    //note to self: clipend time is clipstart+delayend-delaystart, so no need to ask user for it or store it
    //TODO: GET YOUTUBELINK AND FILL ARRAYS FROM FIREBASE USING sessionid

    var indexarray = [];
    for (let i = 0, len = arrayOfClipLinkIDs.length; i < len; i++) {
        indexarray[i] = i;
    }

    if (mode===1) {
        return (
            <MasterVideoTile clickedVid={clickedVid} seconds={seconds} mode={mode} vidid={masteryoutubelinkid} width={size.width} height={size.height} />
        );
    } else if (mode===2) {
        return (
            <div class="sidebyside">
                <MasterVideoTile clickedVid={clickedVid} seconds={seconds} mode={mode} vidid={masteryoutubelinkid} width={size.width} height={size.height} />
                {
                    indexarray.map(
                        index => (
                            <VideoTile 
                                mode={mode} 
                                vidid={arrayOfClipLinkIDs[index]} 
                                start={arrayOfClipStartSeconds[index]} 
                                end={arrayOfClipStartSeconds[index] + arrayOfDelayEndSeconds[index] - arrayOfDelayStartSeconds[index]} 
                                width={size.width / 2} 
                                height={size.height / 2}
                                visible={seconds >= arrayOfDelayStartSeconds[index] && seconds <= arrayOfDelayEndSeconds[index]}
                            />
                        )
                    )
                }
            </div>
        );
    } else {
        return (
            <h1>Something went really wrong. Refresh the page!</h1>
        );
    }
}


function CreateVideoPage() {
    return (
        <h1>Create Video Page</h1>
    );
}

function SignInPage() {
    
    if (window.location.href.includes("?id=")) {
        return (
            <ViewVideoPage />
        );
    } else {
        return (
            <CreateVideoPage />
        );
    }
    
}

//NONE OF THE CODE BELOW MATTERS OR SHOULD BE TOUCHED BECAUSE SOMETHING WILL BREAK

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                /><br />
                <input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                /><br />
                <button disabled={isInvalid} type="submit">
                    Sign In
                </button>
                <br /><br />
                {error && <p>{error.message}</p>}
                <br /><br />
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };