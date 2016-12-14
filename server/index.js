import express from 'express';
import bodyParser from 'body-parser';
const app = express();

const logsRouter = express.Router();

app.use(bodyParser.json());

const maxSize = 1000;

class MockStorage {
  constructor(){
    this.db = {logs: []};
  }
  get(cb){
     cb(null,this.db);
  }
  set(db,cb){
    this.db = db;
    cb(null);
  }
}

const memoryStorage = new MockStorage();

function appendLog(events, storage){
  storage.get((err, data) => {
    if (!err){

      let db = data || {logs: []};
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
  let storage = req.webtaskContext ? req.webtaskContext.storage : memoryStorage;
  console.log(`appending...`);
  appendLog(req.body, storage);
  res.send('ok');
});

logsRouter.delete('/logs',(req,res)=> {
    let storage = req.webtaskContext ? req.webtaskContext.storage : memoryStorage;
    storage.get((err, db) => {
      //TOOD error handling...
      db.logs = [];
      storage.set(db,err=>{
        if (err)
          console.log(err);
        else console.log(`saved...`);
      });
      res.status(200).end();
    });
  }
);

logsRouter.get('/logs',(req,res)=> {
    let storage = req.webtaskContext ? req.webtaskContext.storage : memoryStorage;
    storage.get((err, data) => {
      res.json(data.logs);
    });
  }
);

logsRouter.get('/dbsize',(req,res)=> {
    let storage = req.webtaskContext ? req.webtaskContext.storage : memoryStorage;
    storage.get((err, db) => {
      res.json({sizeInBytes: JSON.stringify(db).length });
    });
  }
);

app.use('/api', logsRouter);

app.listen(3001, ()=>console.log(`strated...`));
