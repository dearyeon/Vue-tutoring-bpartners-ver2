import axios from "axios";
import querystring from "querystring";
import shared from "@/common/shared";
import {config} from "../../deploy.config"

const hostId = window.location.hostname.split('.')[0];
let server = 'https://bapi-dev.tutoring.co.kr';
if(hostId=='partners2') {
    server = 'https://bapi.tutoring.co.kr';
}
else if(hostId=='partners-st') {
    server = 'https://bapi-st.tutoring.co.kr';
}
//로컬 API 개발자 전용 설정
else if(config.developer=='' && window.location.hostname=='localhost') {
    server = 'http://localhost';
}

const api = {
    get : async function(endpoint, params) {
        const headers = {
            'BAST': shared.getToken()
        };
        const response = await axios.get(`${server}${endpoint}`, {headers,params});
        checkRes(response.data);

        return response.data;
    },

    post: async function (endpoint, params) {
        const headers = {
            'Content-Type':'application/x-www-form-urlencoded',
            'BAST': shared.getToken()
        };
        const response = await axios.post(`${server}${endpoint}`, querystring.stringify(params), {headers});
        checkRes(response.data);

        return response.data;
    },

    upload: async function (endpoint, params) {
        const headers = {
            'Content-Type':'multipart/form-data',
            'BAST': shared.getToken()
        };
        const formData = new FormData();
        Object.keys(params).map((key)=>{
            formData.append(key, params[key])
        })
        const response = await axios.post(`${server}${endpoint}`, formData, {headers});
        checkRes(response.data);

        return response.data;
    },
}


const checkRes =  function (res) {
    if(res.result===1000 && res.data.errorCode==900) {
        shared.logout('세션 유효기간 만료로\n로그아웃 됩니다.');
    }
}

export default api;
