import express from 'express';
import getStore from './../lib/store';

const logsRouter = express.Router();

const maxSize = 1000;



function appendLog(events, storage){
  storage.get((err, data) => {
    if (!err){

      let db = data || {logs: [], config:{provisioned:false}};
      if (events && events.length>0) {
        console.log(events.length);
        db.logs = db.logs.concat(events);
        //Cap to maxSize...
        db.logs = db.logs.slice(db.logs.length - maxSize);

        storage.set(db,err=>{
          if (err)
            console.log(err);
          else console.log(`saved...`);
        });
      }
    }
  });
}

logsRouter.post('/logs', (req,res) =>{
  let store = getStore(req);
  console.log(`appending...`);
  appendLog(req.body, store);
  res.send('ok');
});

logsRouter.delete('/logs',(req,res)=> {
    let store = getStore(req);
    store.get((err, db) => {
      //TOOD error handling...
      db.logs = [];
      store.set(db,err=>{
        if (err)
          console.log(err);
        else console.log(`saved...`);
      });
      res.status(200).end();
    });
  }
);

logsRouter.get('/logs',(req,res)=> {
    getStore(req).get((err, data) => {
      res.json(data.logs);
    });
  }
);

logsRouter.get('/dbsize',(req,res)=> {
    let store = getStore(req);
    store.get((err, db) => {
      res.json({sizeInBytes: JSON.stringify(db).length });
    });
  }
);

export default logsRouter;
