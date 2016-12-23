import express from 'express';
import url from 'url';
import Webtask from 'webtask-tools';

import logs from './routes/logs';
import wt from './routes/wt';
import agent from './routes/agent';

const app = express();

function buildBaseUrl(req, res, next) {
    var protocol = 'https';
    var pathname = url.parse(req.originalUrl).pathname
                      .replace(req.path, '');
    res.locals.baseUrl = url.format({
      protocol: protocol,
      host:     req.get('host'),
      pathname: pathname
    }).replace(/\/$/, "");
    next();
}

app.use(buildBaseUrl);
app.use('/api/logs', logs);
app.use('/api/agent', agent);
app.use('/',wt);

const port = process.env.PORT || 8080;

module.exports = Webtask.fromExpress(app);
//app.listen(port,()=>console.log(`running: ${port}`));
