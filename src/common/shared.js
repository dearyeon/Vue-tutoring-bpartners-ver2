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
    setAccount(account) {
        sessionStorage.setItem('account', JSON.stringify(account))
    },
    getAccount() {
        return JSON.parse(sessionStorage.getItem('account'))
    },
    isLoggedIn() {
        return this.getToken()==null ? false : true;
    },
    nf(number) {
        return new Intl.NumberFormat('ko-KR').format(number)
    },
    getSiteImgUrl(imgFileNm) {
        if(!imgFileNm) imgFileNm = 'default.png'
        return 'https://cdn.tutoring.co.kr/uploads/b2b/site/'+imgFileNm
    },
    getSiteImgThumbnailUrl(imgFileNm) {
        if(!imgFileNm) imgFileNm = 'default.png'
        return 'https://cdn.tutoring.co.kr/uploads/b2b/site/tmb/'+imgFileNm
    },
    sortBy (sortKey) {
        (this.sortKey === sortKey) ? this.items.reverse() : (this.items.sort(function (a, b) {
            return a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0
        }))
        this.sortKey = sortKey
    },
}

Object.defineProperty(Vue.prototype,'$shared', {
    get() { return shared }
})

export default shared;
