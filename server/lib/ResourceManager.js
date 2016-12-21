import rp from 'request-promise';

class ResourceManager {

  constructor(domain,token) {
    this.domain = domain;
    this.token = token;
  }

  bearerHeader() {
    return {"Authorization": `Bearer ${this.token}`};
  }

  async createResourceServer(name, identifier, scopes=["provision:agent", "add:logs" ]) {
    const scopesValues = scopes.map(s=>{
      return {value:s, description:s.replace(":"," ")};
    });
    return await rp( {
      method: 'POST',
      url: `https://${this.domain}/api/v2/resource-servers`,
      headers: this.bearerHeader(),
      json: {name,identifier,scopes:scopesValues}
    });
  }

  async createClient(name) {
    return await rp( {
      method: 'POST',
      url: `https://${this.domain}/api/v2/clients`,
      headers: this.bearerHeader(),
      json: {name}
    });
  }

  async createClientGrant(clientId,audience,scope) {
    return await rp( {
      method: 'POST',
      url: `https://${this.domain}/api/v2/client-grants`,
      headers: this.bearerHeader(),
      json: {
        client_id:clientId,
        audience,
        scope
      }
    });
  }

  async createResources(){
    const healthAgentName= 'health agent',
    healthDashboardName= 'health dashboard',
    healthApiName= 'urn:connector.healthAgent.api',
    healthApiAudience= 'urn:connector.healthAgent.a4api141',
    scope = ["provision:agent", "add:logs"];

    console.log(`creating health agent...`);
    let healthAgent = await this.createClient(healthAgentName);
    console.log(`creating health dashboard...`);
    let healthDashboard = await this.createClient(healthDashboardName);
    console.log(`creating health api...`);
    let healtApi = await this.createResourceServer(healthApiName,healthApiAudience,scope);
    console.log(`create health agent api grant...`);
    let agentGrant = await this.createClientGrant(healthAgent.client_id, healtApi.identifier, scope);
    console.log(`creating health dashboard api grant...`);
    let dashboardGrant = await this.createClientGrant(healthDashboard.client_id, healtApi.identifier, scope);
    return {
      clientId: healthAgent.client_id,
      clientSecret: healthAgent.client_secret
    };
  }
}

export default ResourceManager;
