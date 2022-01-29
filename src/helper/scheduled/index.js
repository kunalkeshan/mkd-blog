const Scheduler = require("node-schedule");

let i = 0;
Scheduler.scheduleJob("2 * * * * * ", () => {
    console.log(`it works, currently at ${i} callback`)
    i++;
});


