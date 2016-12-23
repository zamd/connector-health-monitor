import express from 'express';
import bodyParser from 'body-parser';
import getStore from './../lib/store';

const agentRouter = express.Router();

agentRouter.get('/status', (req,res)=> {
  getStore(req).then( async db => {
      let logs = await db.getAll('logs');

      res.json({configured: logs.length > 0, lastContact: new Date()});
  });
});

export default agentRouter;
