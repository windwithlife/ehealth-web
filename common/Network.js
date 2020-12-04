const isServer = typeof window == 'undefined';
import axios from "axios";
import { Modal } from 'antd';
import {Loading,doHref} from './utils';
import config from "./config";
const SOA_GATEWAY = config.servers.soaServer;
const baseUrl     = config.application.contextPath;



function setToken(token){
    if (!isServer) {
        localStorage.setItem('token', token);
    }
}
function getToken() {
    let token ='empty'
    if (!isServer) {
        token = localStorage.getItem('token');
    }
   
    return token;
}


const checkStatus = response => {
    console.log("check status");
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
        return response
    } else if (response.status == 401 || response.status == 403) {
        if (!isServer) doHref();
        return response
    } else {
        var error = new Error((response && response.statusText) || 'text')
        error.response = response
        throw error
    }
}
function dealTokenV1(response) {
    let result = response.data;
    let { token = '', status, data } = result;//status 响应状态(0:失败 1:成功  2:未登录c)
    if (data.token) token = data.token;

    switch (status) {
        case 0: {
            Modal.info({ content: result.message })
            throw new Error(result.message);
        }
        case 1: {
            localStorage.setItem('token', token);
            if (location.pathname == `${baseUrl}/index`) doHref('lecture_setting'); //首页登录成功处理
            return result;
        }
        case 2: {
            if (!isServer) doHref();
            else { }//TODO  302
            return result;
        }
    }
}

function dealTokenV2(response) {
    const result       = response.data;
    const token  = response.headers.token;
    const statusCode = result.status.code;

    switch (statusCode) {
        case 401: {
            if (!isServer) doHref();
        }
        case 403: {
            if (!isServer) doHref();
        }
        default: {
            setToken(token);
        }
    }
    return result;
}

/*********************network version 1 */

export async function invoke_post(url, params = {}) {
    try {
        Loading.show();
        let urlPrefix = SOA_GATEWAY +  config.servers.serverPath +'/' + url;
        axios.defaults.withCredentials = true;
        axios.defaults.crossDomain = true;
        let token = localStorage.getItem('token');
        let result = await axios({
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            //url:`${urlPrefix}${url}`,
            url:urlPrefix,
            data: { platType: 4, category: 1, version: 1, platForm: "web", token, data: params }
        }).then(checkStatus).then(dealTokenV1)
        Loading.hide();
        return result;
    } catch (error) {
        Loading.hide();
        console.error('---invoke_post_error---: ', error);
        throw error;
    }
}



export async function invoke_get(url, params = {}) {
    try {
        let urlPrefix = SOA_GATEWAY +  config.servers.serverPath + '/'+ url;
        axios.defaults.withCredentials = true;
        axios.defaults.crossDomain = true;
        let token = getToken();
        params.platType = 4;
        params.platForm = "web";
        params.version =1;
        
        params.token= token;

        let result = await axios({
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'get',
            url: urlPrefix,
            params: params,
        }).then(checkStatus).then(dealTokenV1)
       
        return result;
    } catch (error) {
        Loading.hide();
        console.error('---invoke_post_error---: ', error);
        throw error;
    }
}

export async function uploadFile(file) {
    try {
       
        Loading.show();
        let formData = new FormData();
        let token = localStorage.getItem('token');
        let json = { token, platType: 4, category: 1, version: 1, platForm: "web" };
        formData.append('json', JSON.stringify(json))
        formData.append('file', file);
        let urlPrefix = config.servers.resourceServer;
        console.log(urlPrefix);
        let result = await axios.post(urlPrefix, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(checkStatus).then(dealTokenV1)
        Loading.hide();
        return result;
    } catch (error) {
        Loading.hide();
        console.error('---invoke_uploadFile_error---: ', error);
        throw error;
    }
}



/*********** V2***********************/


export class Network {
    constructor(applicationName){
        if(applicationName){this.applicationName = applicationName;}
        this.host = SOA_GATEWAY;
    }

    composeBaseUrl(path, useApplicationName){
        let finalUrl = this.host + '/';
        if((useApplicationName) && this.applicationName){
            finalUrl = finalUrl +  '/' + this.applicationName + path;  
        }else{
            finalUrl = finalUrl + path;
        }
        return  finalUrl;
        
    }
    switchDevServerHost(newHost){
       if(config.ENV_NAME === "DEV"){
            this.host = newHost;
       }
    }
    async fetch_post(url, params = {}) {
        try {
            //Loading.show();
            const fullUrl = this.composeBaseUrl(url, true);
            axios.defaults.withCredentials = true;
            axios.defaults.crossDomain = true;
            let token = getToken();
            let result = await axios({
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                method: 'post',
                url: fullUrl,
                data: { head: { version: 1, systemCode: "1", deviceType: "1" }, params: params }
            }).then(checkStatus).then(dealTokenV2)
            
            return result;
        } catch (error) {
            console.error('---invoke_post_error---: ', error);
            throw error;
        }
    }
    async fetch_get(url, params = {}) {
        try {
            const fullUrl = this.composeBaseUrl(url, true);
            axios.defaults.withCredentials = true;
            axios.defaults.crossDomain = true;
            let token = getToken();
            params.version = 1;
            params.systemCode = "1";
            params.deviceType = "1";
            let result = await axios({
                headers: {
                    'token': token
                },
                method: 'get',
                url: fullUrl,
                params: params,
            }).then(checkStatus).then(dealTokenV2)
         
            return result;
        } catch (error) {
            console.error('---invoke_post_error---: ', error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
           
            let formData = new FormData();
            let token = getToken();
            let json = { token, platType: 4, category: 1, version: 1, platForm: "web" };
            formData.append('json', JSON.stringify(json))
            formData.append('file', file);
            let urlPrefix = config.servers.resourceServer;
            let result = await axios.post(urlPrefix, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(checkStatus).then(dealTokenV2)
            
            return result;
        } catch (error) {
            Loading.hide();
            console.error('---invoke_uploadFile_error---: ', error);
            throw error;
        }
    }

}


