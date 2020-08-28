import axios from "axios";
import { Form, Input, Button, Checkbox, Modal } from 'antd';
const isServer = typeof window == 'undefined';

export function getTime(timeStamp = '') {
    const date = timeStamp ? new Date(timeStamp) : new Date();
    const year = date.getFullYear();
    const month = toDoubleNum(date.getMonth() + 1);
    const day = toDoubleNum(date.getDate());
    const hours = toDoubleNum(date.getHours());
    const minutes = toDoubleNum(date.getMinutes());
    const seconds = toDoubleNum(date.getSeconds());
    return {
        startOfDay: `${year}${month}${day} 000000`,
        endOfDay: `${year}${month}${day} 235959`,
        nowOfDay: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
        year, month, day, hours, minutes, seconds
    };
}
function toDoubleNum(num) {
    const strNum = String(num);
    return strNum.length === 1 ? `0${strNum}` : strNum;
}

export const Loading = {
    show() {
        if (!isServer) {
            let divEle = document.createElement('div');
            divEle.className = "div_loading_con"
            divEle.innerHTML = `
                <div class="iconfont div_loading">\ue64a</div>
            `
            document.body.appendChild(divEle);
        }
    },
    hide() {
        if (!isServer) {
            let divEle = document.querySelector('.div_loading_con');
            if (!!divEle) document.body.removeChild(divEle);
        }
    }
}

export const checkStatus = async response => {
    if (response.status >= 200 && response.status < 300) {
        return response.data
    } else {
        var error = new Error((response && response.statusText) || 'text')
        error.response = response
        throw error
    }
}
function dealToken(result) {
    let { token = '', status, data } = result;//status 响应状态(0:失败 1:成功  2:未登录c)
    if (!!data.token) token = data.token;

    switch (status) {
        case 0: {
            Modal.info({ content: result.message })
            throw new Error(result.message);
        }
        case 1: {
            localStorage.setItem('token', token);
            if (location.pathname == '/') location = `${location.origin}/lecture_setting` //首页登录成功处理
            return result;
        }
        case 2: {
            if (!isServer) location.href = `${location.origin}/`
            else { }//TODO  302
            return result;
        }
    }
    
}

export async function invoke_post(url, params = {}) {
    try {
        Loading.show();
        axios.defaults.withCredentials = true;
        axios.defaults.crossDomain = true;
        let token = localStorage.getItem('token');
        let result = await axios({
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            url,
            data: { platType: 4, category: 1, version: 1, platForm: "web", token, data: params }
        }).then(checkStatus).then(dealToken)
        Loading.hide();
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

        let result = await axios.post('https://service.koudaibook.com/meeting-server/uploadService/uploadImage', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(checkStatus).then(dealToken)
        Loading.hide();
        return result;
    } catch (error) {
        Loading.hide();
        console.error('---invoke_uploadFile_error---: ', error);
        throw error;
    }
}

