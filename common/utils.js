
import config from "./config";
const isServer = typeof window == 'undefined';

export function getQuery() {
    const url = decodeURI(location.search); // 获取url中"?"符后的字串(包括问号)
    let query = {};
    if (url.indexOf("?") != -1) {
        const str = url.substr(1);
        const pairs = str.split("&");
        for(let i = 0; i < pairs.length; i ++) {
             const pair = pairs[i].split("=");
            query[pair[0]] = pair[1];
        }
    }
    return query ;  // 返回对象
}

export function doHref(path=''){
    location.href = `${location.origin}${config.application.baseUrl}/${path}` //首页登录成功处理
}

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
            if (divEle) document.body.removeChild(divEle);
        }
    }
}
