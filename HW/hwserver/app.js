const express = require('express');
const cron = require('node-cron');
const app = express();
const port = 3000;
const Funcs = require('./routes/logupdate/logupdatecontroller');
const ngrok_info = require('./server_settings/ngrok_info');
const servertime = require('./server_settings/get_servertime');

servertime.servertime();

app.use('/', require('./routes/index.js'));

cron.schedule('0,30 * * * *', function(){
    Funcs.selectAll();
    console.log("CRON ACCEPT");
});

ngrok_info.ngrok_info();

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});
