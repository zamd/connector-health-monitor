class MockStorage {
  constructor(){
    this.db = {logs: [],config: {provisioned:false}};
  }
  get(cb){
     cb(null,this.db);
  }
  set(db,cb){
    this.db = db;
    cb(null);
  }
}


export default MockStorage;
