// export const baseURL = 'http://localhost:10012'
// export const baseURL = "http://52.29.110.196:10012"
// export const baseURL = "http://52.29.110.196:10010"

let env = process.env.ENV || 'local';

const configData = require(`../environments/${env}.json`);
console.log(222222, configData.baseURL);

export const baseURL = configData.baseURL

