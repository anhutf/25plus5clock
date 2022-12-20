const Timer = (props) => {
  return (
    <div className="timer">
      <h2 className="timer-title" id="timer-label">
        {props.timerTitle ? "Break" : "Session"}
      </h2>
      <div className="timer-view" id="time-left">
        {props.value}
      </div>
      <div className="timer-option">
        <button className="control" id="start_stop" onClick={props.controlBtn}>
          {props.displayIcon ? (
            <ion-icon class="icon" name="pause-outline"></ion-icon>
          ) : (
            <ion-icon class="icon" name="play-outline"></ion-icon>
          )}
        </button>
        <button className="control" id="reset" onClick={props.resetBtn}>
          <ion-icon class="icon" name="refresh-outline"></ion-icon>
        </button>
      </div>
    </div>
  );
};

const Clock = () => {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 || breakTime >= 60 * 60) return;
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 || sessionTime >= 60 * 60) return;
      setSessionTime((prev) => prev + amount);
      if (!timerOn) setDisplayTime(sessionTime + amount);
    }
  };

  // const playBreakAudio = () => {
  //   const audio = document.getElementById("beep");
  //   audio.currentTime = 0;
  //   audio.play();
  //   setTimeout(() => {
  //     audio.pause();
  //   }, 2000);
  // };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        const audio = document.getElementById("beep");

        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              audio.play();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              audio.play();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 500);

      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setTimerOn(false);
    setOnBreak(false);

    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="clock">
      <h1 className="heading">25 + 5 Clock</h1>
      <audio
        id="beep"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
      <Timer
        value={formatTime(displayTime)}
        displayIcon={timerOn}
        controlBtn={controlTime}
        resetBtn={resetTime}
        timerTitle={onBreak}
      />
      <div className="break-session">
        <div className="break">
          <p className="title" id="break-label">
            Break Length
          </p>
          <div className="option">
            <button
              className="decrement"
              id="break-decrement"
              onClick={() => changeTime(-60, "break")}
            >
              <ion-icon class="icon" name="remove-circle-outline"></ion-icon>
            </button>
            <span className="value" id="break-length">
              {breakTime / 60}
            </span>
            <button
              className="increment"
              id="break-increment"
              onClick={() => changeTime(60, "break")}
            >
              <ion-icon class="icon" name="add-circle-outline"></ion-icon>
            </button>
          </div>
        </div>
        <div className="session">
          <p className="title" id="session-label">
            Session Length
          </p>
          <div className="option">
            <button
              className="decrement"
              id="session-decrement"
              onClick={() => changeTime(-60, "session")}
            >
              <ion-icon class="icon" name="remove-circle-outline"></ion-icon>
            </button>
            <span className="value" id="session-length">
              {sessionTime / 60}
            </span>
            <button
              className="increment"
              id="session-increment"
              onClick={() => changeTime(60, "session")}
            >
              <ion-icon class="icon" name="add-circle-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<Clock />, document.getElementById("root"));
