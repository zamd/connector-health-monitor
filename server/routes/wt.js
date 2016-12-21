import express from 'express';
import bodyParser from 'body-parser';
import getStore from './../lib/store';
import ResourceManager from './../lib/ResourceManager';

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
    redirect_uris: [res.locals.baseUrl + '/login/callback'],
    client_name:   "Connector Health Dashboard",
    post_logout_redirect_uris: [res.locals.baseUrl]
  });
});


rootRotuer.get('/testall',function(req,res){
  console.log(req.webtaskContext);
  res.header('Content-Type','text/html');
  res.status(200).send("Ok");
});

rootRotuer.get('/login', ensureProvisioned,function (req, res) {
  res.header('Content-Type','text/html');
  res.status(200).send("Hello Webtask");
});

rootRotuer.post('/login/callback', function (req, res) {
  let auth0_domain = 'internalserver.auth0.com';
  if (req.webtaskContext)
    auth0_domain = req.webtaskContext.data.AUTH0_DOMAIN;

  getStore(req).get((err, db) => {
    db = db || {};
    if(!db.config || !db.config.provisioned) {
      provision(auth0_domain,req.body.access_token)
      .then(r=> {
        db.config = db.config || {};
        db.config.provisioned = true;
        getStore(req).set(db, err=>{
          if (!err) {
              res.header('Content-Type','application/json');
              res.status(200).json(r);
            }
        });
      }).catch(r=>{
        res.header('Content-Type','text/html');
        res.status(200).send("Error...." + r.toString());
      })
    }
    else {
        res.header('Content-Type','text/html');
        res.status(200).send("already provisioned..");
    }
  });
});

function ensureProvisioned(req,res,next) {
  if (req.provisioned)
    return next();

    let rta =  "https://auth0.auth0.com";
    if(req.webtaskContext)
      rta = req.webtaskContext.data.AUTH0_RTA;

    var redirectUri = res.locals.baseUrl + '/login/callback';

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
