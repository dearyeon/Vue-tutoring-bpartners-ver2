import axios from "axios";
import querystring from "querystring";

const server = 'https://b2b-api.tutoring.co.kr';

const api = {
    get : async function(endpoint, params) {
        const headers = {
            'Content-Type':'application/x-www-form-urlencoded',
            'BAST':'BAT5f5872afe960a5f5872afe964a'
        };
        const res = await axios.get(`${server}${endpoint}`, {headers,params});
        return res.data;
    },

    post: async function (endpoint, params) {
        const headers = {
            'Content-Type':'application/x-www-form-urlencoded',
            'BAST':'BAT5f5872afe960a5f5872afe964a'
        };
        const res = await axios.post(`${server}${endpoint}`, querystring.stringify(params), {headers});
        return res.data;
    }
}

export default api;
