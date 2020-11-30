import Vue from 'vue'
import api from "@/common/api";

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
	removeToken() {
		sessionStorage.removeItem('bat')
		this.bast = null
	},


	setAccount(account) {
		sessionStorage.setItem('account', JSON.stringify(account))
	},
	getAccount() {
		return JSON.parse(sessionStorage.getItem('account'))
	},
	removeAccount() {
		sessionStorage.removeItem('account')
	},

	isLoggedIn() {
		return this.getToken()==null ? false : true;
	},
	isSupervisor() {
		return this.getAccount() ? this.getAccount().acc_level == consts.ACCOUNT_LEVEL_SUPERVISOR : false;
	},
	isSiteManager() {
		return this.getAccount() ? this.getAccount().acc_level == consts.ACCOUNT_LEVEL_SITE_MANAGER : false;
	},
	isPartnerManger() {
		return this.getAccount() ? this.getAccount().acc_level == consts.ACCOUNT_LEVEL_PARTNER_MANAGER : false;
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
		const json = localStorage.getItem('curBatch')
		return json ? JSON.parse(json) : {}
	},
	setCurBatch(batch) {
		localStorage.setItem('curBatch', JSON.stringify(batch))
	},
	removeCurBatch() {
		localStorage.removeItem('curBatch')
	},

	getCurSite() {
		const json = localStorage.getItem('curSite')
		return json ? JSON.parse(json) : {}
	},
	setCurSite(site) {
		localStorage.setItem('curSite', JSON.stringify(site))
	},
	removeCurSite() {
		localStorage.removeItem('curSite')
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
	logout(msg, isError) {
		shared.removeToken()
		shared.removeAccount()
		Vue.swal(msg).then(()=>{
			if(isError) {
				//에러에 의한 로그아웃인 경우에만, 모든 세션정보 초기화
				shared.removeCurBatch()
				shared.removeCurSite()
			}

			location = '/'
		})
	},
	async getUserInfo(boIdx) {
		const res = await api.get('/partners/report', { boIdx })
		return res.data
	},

	removeElementInArray(arr, item) {
		const idx = arr.indexOf(item)
		if (idx > -1) arr.splice(idx, 1)
	}
}

export const consts = {
	ACCOUNT_LEVEL_SITE_MANAGER : 'S',
	ACCOUNT_LEVEL_PARTNER_MANAGER : 'P',
	ACCOUNT_LEVEL_SUPERVISOR : 'V'
}

Object.defineProperty(Vue.prototype,'$shared', {
	get() { return shared }
})

export default shared;
