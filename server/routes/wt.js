import express from 'express';
import bodyParser from 'body-parser';
import getStore from './../lib/store';
import ResourceManager from './../lib/ResourceManager';
import template from 'html!./../../build/index.html';

const rootRotuer = express.Router();

async function provision(domain,token) {
  const rm = new ResourceManager(domain,token);
  try {
    return await rm.createResources();
  }
  catch(e){
    console.log(`Exception: ${e}`);
    throw e;
  }
};

rootRotuer.use(bodyParser.urlencoded({ extended: false }));

rootRotuer.get('/.well-known/oauth2-client-configuration', function (req, res) {
  res.header("Content-Type", 'application/json');
  res.status(200).send({
    redirect_uris: [res.locals.baseUrl + '/login'],
    client_name:   "Connector Health Dashboard",
    post_logout_redirect_uris: [res.locals.baseUrl]
  });
});

rootRotuer.get('/testall',function(req,res){
  console.log(req.webtaskContext);
  res.header('Content-Type','text/html');
  res.status(200).send("Ok");
});

rootRotuer.get('/',function (req, res) {
  console.log(template);
  let contents = template.replace(/\/zamd\/connector-health-monitor/g,"https://8f4890b4.ngrok.io")
  res.header('Content-Type','text/html');
  res.status(200).send(contents);
});

rootRotuer.get('/login', ensureProvisioned,function (req, res) {
  res.header('Content-Type','text/html');
  res.status(200).send("Hello Webtask");
});

async function ensureConfig(db){
  let config = await db.getAll('config').then(c=>c.shift());
  if (!config)
    config = await db.create('config',{provisioned: false});

  return config;
}

rootRotuer.post('/login', function (req, res) {
  let auth0_domain = 'internalserver.auth0.com';
  if (req.webtaskContext)
    auth0_domain = req.webtaskContext.data.AUTH0_DOMAIN;

  getStore(req).then( async (db) => {
    try {
      let config = await ensureConfig(db);
      if (!config.provisioned) {
        let r = await provision(auth0_domain,req.body.access_token);
        // set as provisioned...
        config.provisioned = true;
        await db.update('config',config._id, config);
      }
      
      res.redirect('./');
    }
    catch(e){
      res.header('Content-Type','text/html');
      res.status(200).send("Error...." + e.toString());
    }
  });
});

function ensureProvisioned(req,res,next) {
  if (req.provisioned)
    return next();

    let rta =  "https://auth0.auth0.com";
    if(req.webtaskContext)
      rta = req.webtaskContext.data.AUTH0_RTA;

    var redirectUri = res.locals.baseUrl + '/login';

    var authorizationUrl = [
      rta + '/i/oauth2/authorize',
      '?client_id=' + res.locals.baseUrl,
      '&response_type=token',
      '&response_mode=form_post',
      '&scope=' + encodeURIComponent("create:clients create:resource_servers create:client_grants openid profile"),
      '&expiration=9999999999',
      '&redirect_uri=' + redirectUri
    ].join('');

    res.redirect(authorizationUrl);
}

export default rootRotuer;
