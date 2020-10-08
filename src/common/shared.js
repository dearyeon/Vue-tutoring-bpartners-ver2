import Vue from 'vue'

const shared = {
    bast: null,
    setToken(token) {
        sessionStorage.setItem('bat', token)
        this.bast = token
    },
    getToken() {
        return this.bast ? this.bast : sessionStorage.getItem('bat')
    },
    isLoggedIn() {
        return this.getToken()==null ? false : true;
    },
    nf(number) {
        return new Intl.NumberFormat('ko-KR').format(number)
    }
}

Object.defineProperty(Vue.prototype,'$shared', {
    get() { return shared }
})

export default shared;
