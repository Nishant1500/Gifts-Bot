  var forever = require('forever-monitor'); // Watch The Bot For A Long Time

  var child = new (forever.Monitor)('bot.js', {
    max: 10,
    silent: false,
    minUptime: 86400000,
    killTree: true,
    spinSleepTime: 1000,
    args: ['--color']
  });

  child.on('exit', function () {
    console.log('index.js has exited after 10 restarts');
  });
  
  child.on('start', function (proccess) {
    console.log('Starting Bot | PID : ' + JSON.stringify(proccess.childData.pid))
  })
  
  child.on('restart', function() {
    console.error('Forever restarting script for ' + child.times + ' time');
});

  child.start();