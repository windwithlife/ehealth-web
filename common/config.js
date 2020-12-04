
const isServer = typeof window === 'undefined';

const ENV_DEVELOPMENT = 'DEV';
const ENV_UAT = 'UAT';
const ENV_PRODUCTION = 'PROD';
const devConfig = require('../config/application-dev.json');
const uatConfig = require('../config/application-uat.json');
const prodConfig = require('../config/application-prod.json');

const configOptions = {"DEV":devConfig,"UAT":uatConfig,"PROD":prodConfig};

function detectEnvironment() {
  let env = ENV_DEVELOPMENT;
  if (isServer) {
    if (process.env.NODE_ENV === 'production') {
      env = ENV_PRODUCTION;
    } else if (process.env.NODE_ENV === 'uat') {
      env = ENV_UAT;
    }
  } else {
    let getConfig = require('next/config').default;
    const envName = getConfig().publicRuntimeConfig.envName;
    if (envName) { env = envName; }
  }
  console.log(env);
  return env;
}
function getConfigOption(){
  const envName = detectEnvironment();
  let configOption = configOptions[envName];
  console.log(configOption);
  return configOption;
  
}
function getConfigValues(){
   let configOption = getConfigOption();
  //  const current = {
  //   ENV_NAME: configOption.envName,
  //   SOA_GATE: configOption.servers.soaServer,
  //   MQTT_SERVER: configOption.servers.mqttServer,
  //   RESOURCE_SERVER: configOption.servers.resourceServer,
  //   APPLICATION_PATH: configOption.application.contextPath,
  //   DOCKER_REPO: configOption.repositories.dockerRepo,
  //   }
  //   return current;
  return configOption;

}
module.exports = getConfigValues();

