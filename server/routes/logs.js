import express from 'express';
import bodyParser from 'body-parser';
import getStore from './../lib/store';

const logsRouter = express.Router();

logsRouter.use(bodyParser.json());

logsRouter.post('/', (req,res) => {
  getStore(req).then( async (db)=> {
    await db.create('logs', {events: req.body} );
    res.send('ok');
  });
});

logsRouter.delete('/',(req,res)=> {
  getStore(req).then( async (db)=> {
    let logs = await db.getAll('logs');
    logs.forEach(async (l)=> await db.delete('logs',l._id));
    res.send('ok');
  });
});

logsRouter.get('/',(req,res)=> {
    getStore(req).then( async (db) => {
      try {
        let logs = await db.getAll('logs');
        if (logs.length===0)
          return res.json([]);
        // flatten...
        let entries = logs.map(l=>l.events).reduce((a,b)=>a.concat(b));
        res.json(entries);
      }catch(e){
        console.log(e);
      }
    });
  }
);


export default logsRouter;
