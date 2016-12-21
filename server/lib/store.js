import MockStorage from './MockStorage';

const memoryStorage = new MockStorage();

function getStore(req){
  return req.webtaskContext ? req.webtaskContext.storage : memoryStorage;
}

export default getStore;
