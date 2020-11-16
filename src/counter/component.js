import React, { Component, } from "react"
import '../fccclock.css'
import "../App.css"

const formatNumber = number => `0${number}`.slice(-2)

class Fccclock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive : false,
      time : 1500,
      breakLength : 5,
      sessionLength: 25,
      intervalID: "",
      break : false
    };

    this.incBreakLength = this.incBreakLength.bind(this)
    this.decBreakLength = this.decBreakLength.bind(this)
    this.incSessionLength = this.incSessionLength.bind(this)
    this.decSessionLength = this.decSessionLength.bind(this)
    this.toggle = this.toggle.bind(this)
    this.reset = this.reset.bind(this)

  }

  incBreakLength = () => {
    if(!this.state.isActive && this.state.breakLength < 60)
    this.setState({
      breakLength : this.state.breakLength+1
    })
  }
  
  decBreakLength = () => {
    if(!this.state.isActive && this.state.breakLength > 1){
      this.setState({
        breakLength : this.state.breakLength-1
      })
    }
  }
  
  incSessionLength = () => {
    if(!this.state.isActive && this.state.sessionLength < 60)
    this.setState({
      sessionLength : this.state.sessionLength+1,
      time : (this.state.sessionLength+1)*60
    })
  }
  
  decSessionLength = () => {
    if(!this.state.isActive && this.state.sessionLength > 1)
    this.setState({
      sessionLength : this.state.sessionLength-1,
      time : (this.state.sessionLength-1)*60
    })
  }

  toggle = () => {//Toggle Play or Stop mode

    if(this.state.isActive) {//Managing the timer and Interval here.
      clearInterval(this.state.intervalID) //Pause the timer
    } else { // if the timer has been started
      this.setState({
        intervalID: setInterval(() => {
          if(this.state.time !== 0){// if time in seconds is 0, reset to either session or break lenght
            this.setState({//Normal case.  Count Down.
              time : this.state.time-1,
            })
          }else{
            this.audioBeep.play();
            this.setState({
              time : this.state.break? this.state.sessionLength*60 : this.state.breakLength*60,
              break : !this.state.break
            })
        }
      }, 1000)
      });
    }

    this.setState({// Toggle play state
      isActive : !this.state.isActive
    })
  }

  reset = () => {    
    this.setState({
      isActive : false,
      sessionLength: 25,
      breakLength : 5,
      time: 1500,
      intervalID : ""
    })
    if(this.state.intervalID)
    clearInterval(this.state.intervalID)

    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render() {

    const counter ={
      mins:formatNumber(Math.floor(this.state.time/60)),
      secs:formatNumber(Math.floor(this.state.time%60))
    }

      return (
        <div className="App">
        <div id="timer-label">{this.state.isActive ? this.state.break ?  "Break Time" : "Started" : "Stopped"}</div>
        <div id ="time-left" className="Counter">
            {counter.mins}:{counter.secs}
        </div>
          <div>
            <div id="break-label">Break : 
            <span id="break-length">{this.state.breakLength}</span>
            <button id="break-increment" onClick={this.incBreakLength}>
                +
            </button>
            <button id="break-decrement" onClick={this.decBreakLength}>
                -
            </button>
          </div>
          <div id="session-label">Session : 
            <span id="session-length">{this.state.sessionLength}</span>
            <button id="session-increment" onClick={this.incSessionLength}>
                +
            </button>
            <button id="session-decrement" onClick={this.decSessionLength}>
                -
            </button>
          </div>
          <button id="start_stop" onClick={this.toggle}>
                {this.state.isActive? "Stop" : "Start"}
            </button>
            <button id="reset" onClick={this.reset}>
                Reset
            </button>
        </div>
        <audio id="beep" preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>

    )
  }
}

export default Fccclock