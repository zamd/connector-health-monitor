import express from 'express';
import Webtask from 'webtask-tools';
import url from 'url';
import MockStorage from './lib/MockStorage'
import logs from './routes/logs';
import wt from './routes/wt';

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
app.use('/api', logs);
app.use('/',wt);

module.exports = Webtask.fromExpress(app);
