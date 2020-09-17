import axios from "axios";
import querystring from "querystring";
import shared from "@/common/shared";
import {config} from "../../deploy.config"

let server = window.location.hostname.startsWith('partners2.') ? 'https://api.tutoring.co.kr' : 'https://bapi-dev.tutoring.co.kr';

//로컬 API 개발자 전용 설정
if(config.developer=='ken' && window.location.hostname=='localhost') {
     server = 'https://localhost';
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
