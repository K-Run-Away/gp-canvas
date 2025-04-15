let timer = null;
let timeLeft = 0;
let mode = 'stopwatch';
let pomodoroMode = 'work';
let workDuration = 25;

self.onmessage = function(e) {
  const { type, data } = e.data;

  switch (type) {
    case 'START':
      timeLeft = data.initialTime;
      mode = data.mode;
      pomodoroMode = data.pomodoroMode;
      workDuration = data.workDuration;
      
      timer = setInterval(() => {
        if (mode === 'stopwatch') {
          timeLeft += 1;
        } else {
          timeLeft -= 1;
          
          // Handle Pomodoro transitions
          if (mode === 'pomodoro' && timeLeft <= 0) {
            const nextMode = pomodoroMode === 'work' ? 'break' : 'work';
            pomodoroMode = nextMode;
            timeLeft = nextMode === 'work' ? workDuration * 60 : 5 * 60;
          }
        }
        
        self.postMessage({ timeLeft, pomodoroMode });
      }, 1000);
      break;
      
    case 'STOP':
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      break;
      
    case 'RESET':
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      timeLeft = data.initialTime;
      pomodoroMode = data.pomodoroMode;
      self.postMessage({ timeLeft, pomodoroMode });
      break;
  }
}; 