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
    server = 'https://local.tutoring.co.kr';
}

const api = {
    get : async function(endpoint, params) {
        const headers = {
            'BAST': shared.getToken()
        };
        const res = await axios.get(`${server}${endpoint}`, {headers,params});
        return res.data;
    },

    post: async function (endpoint, params) {
        const headers = {
            'Content-Type':'application/x-www-form-urlencoded',
            'BAST': shared.getToken()
        };
        const res = await axios.post(`${server}${endpoint}`, querystring.stringify(params), {headers});
        return res.data;
    }
}

export default api;
