import Vue from 'vue'
import api from "@/common/api";

let allBatches = null

const shared = {
    bast: null,
    sortKey: '',
    items: [],
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
   getCurBatch() {
        return JSON.parse(localStorage.getItem('curBatch'))
    },
    setCurBatch(batch) {
        localStorage.setItem('curBatch', JSON.stringify(batch))
    },
    sortBy (items, sortKey1, sortKey2) {
        if(this.items !== items) this.sortKey = '', this.items=items
        if(sortKey2) {
            (this.sortKey === sortKey1) ? items.reverse() : (items.sort(function (a, b) {
                return !a[sortKey1] ? -1 : !b[sortKey1] ? 1 : a[sortKey1][sortKey2] < b[sortKey1][sortKey2] ? -1 : a[sortKey1][sortKey2] > b[sortKey1][sortKey2] ? 1 : 0
            }))
        } else {
            (this.sortKey === sortKey1) ? items.reverse() : (items.sort(function (a, b) {
                return !a[sortKey1] ? -1 : !b[sortKey1] ? 1 : a[sortKey1] < b[sortKey1] ? -1 : a[sortKey1] > b[sortKey1] ? 1 : 0
            }))
        }
        this.sortKey = sortKey1
    },
    logout(msg) {
        shared.setToken(null)
        Vue.swal(msg).then(()=>{
            location = '/'
        })
    },
    async getUserInfo(item) {
        const res = await api.get('/partners/report', {
            uIdx: item.user.idx,
            bIdx: this.getCurBatch().idx,
            bbgIdx: item.goods.idx
        })
        return res.data
    }
    },
	
	
	
		removeElementInArray(arr, item) {
			const idx = arr.indexOf(item)
			if (idx > -1) arr.splice(idx, 1)
		}
}

Object.defineProperty(Vue.prototype,'$shared', {
    get() { return shared }
})

export default shared;
