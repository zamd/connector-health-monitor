import tools from 'auth0-extension-tools';

async function getStore(req) {
  let storageProvider = req.webtaskContext ? new tools.WebtaskStorageContext(req.webtaskContext.storage) :
                                             new tools.FileStorageContext('./db.json');

  return new tools.BlobRecordProvider(storageProvider);
}

export default getStore;
