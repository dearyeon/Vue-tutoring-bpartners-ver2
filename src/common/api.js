import axios from "axios";
import querystring from "querystring";

const server = 'https://btb-api.tutoring.co.kr';

const api = {
    get : async function(endpoint, params) {
        const res = await axios.get(`${server}/${endpoint}`, {params:params});
        return res.data;
    },

    post: async function (endpoint, params) {
        const headers = {'Content-Type':'application/x-www-form-urlencoded'};
        const res = await axios.post(`${server}/${endpoint}`, querystring.stringify(params), {headers});
        return res.data;
    }
}

export default api;
