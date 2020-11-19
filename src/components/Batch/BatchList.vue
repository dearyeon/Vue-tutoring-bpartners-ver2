<template>
	<div>
		<Header title="차수 관리"
			search-placeholder="고객사 명" @search="setSearch">
			<!--<router-link :to="{ path: '/register/createPage' }"></router-link>-->
		</Header>

		<Content>
			<Table :headers="['No','고객사','담당자','회차','달성률','빌링','현재상태','신청시작일시','신청종료일시','수정일시','차수관리','신청양식설정','','URL']"
					:data="list"
					v-slot="{item, i}">
				<td>{{ i + 1 }}</td>
				<td>{{ item.company }}</td>
				<td>{{ item.name }}</td>
				<td>
					<select v-model="item.selectedApplyIdx" v-if="item.batches.length" style="height:30px; width:100%">
						<option v-for="(apply,i) in item.batches" :value="i" :key="apply.id">
							{{apply.b_no}}회차 ({{moment(apply.fr_dt).format('YY.MM.DD')}}-{{moment(apply.to_dt).format('MM.DD')}}){{item.batches[item.selectedApplyIdx].del_yn?' 취소':''}}
						</option>
					</select>
				</td>
				<td>{{ item.batches.length?(item.batches[item.selectedApplyIdx].target_rt?item.batches[item.selectedApplyIdx].target_rt+'%':''):'' }}</td>
				<td>{{ item.batches.length?(item.batches[item.selectedApplyIdx].use_billing?'빌링':''):'' }}</td>
				<td><label :class="currentStatus(item,1)" style="width:60px;text-align: center">{{ currentStatus(item,0) }}</label></td>
				<td>{{ item.batches.length?(item.batches[item.selectedApplyIdx].fr_dt?moment(item.batches[item.selectedApplyIdx].fr_dt).format('YY-MM-DD HH:MM'):''):'' }}</td>
				<td>{{ item.batches.length?(item.batches[item.selectedApplyIdx].to_dt?moment(item.batches[item.selectedApplyIdx].to_dt).format('YY-MM-DD HH:MM'):''):'' }}</td>
				<td>{{ item.upd_dt ? moment(item.upd_dt).format('YY-MM-DD HH:MM'):'' }}</td>
				<td class="text-left" style='white-space: nowrap;'>
					<ItemButton text="추가" variant="page-set" @click="createBatchPage(item.idx,item.company)" />
					<ItemButton v-if="item.batches.length?(!!item.batches[item.selectedApplyIdx].idx):0" text="수정" variant="page-set" @click="editBatchPage(item.batches[item.selectedApplyIdx].idx)" />
				</td>

				<td style='white-space: nowrap'>
					<div v-if="item.batches.length">
						<ItemButton v-if="!!item.batches[item.selectedApplyIdx].apply" text="페이지 수정" variant="page-set" @click="editApplyPage(item.batches[item.selectedApplyIdx].apply.idx)" />
						<ItemButton v-else text="페이지 등록" variant="page-set" @click="createApplyPage(item.batches[item.selectedApplyIdx].idx, item.idx)" />
					</div>
				</td>
				<td>
					<ItemButton v-if="item.batches.length?item.batches[item.selectedApplyIdx].apply:0" text="신청 페이지" variant="primary" @click="goToApplyPage(applyPageUrl(item,item.selectedApplyIdx)+'/7788')" />
				</td>
				<td>
					<a v-if="item.batches.length?item.batches[item.selectedApplyIdx].apply:0" @click="copyText($event,i)">{{applyPageUrl(item,item.selectedApplyIdx)}}</a>
					<div class="alert alert-success no-padding" role="alert" v-show="item.isCopy" :id="'clipBoardAlert'+i">
						<a href="#" class="alert-link">클립보드에 복사되었습니다.</a>
					</div>
				</td>
			</Table>
		</Content>

		<Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)" @returnPage="setCurrentPage" />
	</div>
</template>

<script>
import api from '@/common/api'
import Dropdown from '../atom/Dropdown'
import moment from 'moment'
import Pagination from '@/components/atom/Pagination'
import BatchSelection from "@/components/Common/BatchSelection"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"

	const hostId = window.location.hostname.split('.')[0].split('-')[1];

	let server;
	if(hostId !== undefined) {
		server = '-' + hostId;
	} else {
		window.location.hostname.split('.')[0] === 'partners2' ? server='' : server = '-dev'
	}

	const applyPageDomain = 'https://apply' + server + '.tutoring.co.kr/';

export default {
	data () {
		return {
			list: [],
			current_page: 1,
			total_page: 1,
			searchKey: '',
			moment: moment
		}
	},
	computed: {
		applyPageUrl() {
			return (item, index) => {
				return applyPageDomain + item.batches[index].apply.hash
			}
		}
	},
	components: {
		Header,
		Content,
		CusIdField,
		BatchSelection,
		Table,
		ItemButton,
		Dropdown,
		Pagination
	},
	async created () {

		const res = await api.get('/partners/siteBatchList');
		let list = res.data.data;
		list.forEach(item => {
			item.selectedApplyIdx = 0
			item.isCopy = false
		})

		this.list = list
		this.current_page = res.data.current_page
		this.total_page = res.data.last_page
	},
	methods: {
		copyText: function (e, index) {
			this.$copyText(e.target.innerText).then((e) => {
				this.list[index].isCopy = true
				let $targetElement = document.getElementById('clipBoardAlert' + index)
				this.fadeout($targetElement, index)
				console.log(e)
			}, (e) => {
				console.log(e)
			})
		},
		goToApplyPage: function (url) {
			window.open(url, '_blank')
		},
		fadeout: function (element, index) {
			var op = 1  // initial opacity
			var timer = setInterval(() => {
				if (op <= 0.1) {
					clearInterval(timer)
					this.list[index].isCopy = false
				}
				element.style.opacity = op
				element.style.filter = 'alpha(opacity=' + op * 100 + ')'
				op -= op * 0.1
			}, 50)
		},
		routeFormPage (idx) {
			this.$router.push({
				name: 'applyForm',
				params: { idx: idx }
			})
		},
		async setCurrentPage (data) {
			this.current_page = data
			const res = await api.get('/partners/siteBatchList?page=' + this.current_page)
			let list = res.data.data;
			list.forEach(item => {
				item.selectedApplyIdx = 0,
				item.isCopy = false
			})
			this.list = list
			this.current_page = res.data.current_page
		},
		createBatchPage (bsIdx,company) {
			this.$router.push({
				name: 'batchNew',
				params: { bsIdx:bsIdx, company:company}
			})
		},
		editBatchPage (bIdx) {
			this.$router.push({
				name: 'batchEdit',
				params: { bIdx:bIdx }
			})
		},
		editApplyPage(baIdx) {
			this.$router.push({
				name: 'applyEdit',
				params: { baIdx: baIdx }
			})
		},
		createApplyPage(bIdx, bsIdx) {
			this.$router.push({
				name: 'applyNew',
				params: { bIdx: bIdx}
			})
		},
		async setSearch(input) {
            const res = await api.get('/partners/siteBatchList', { sk:input })
			let list = res.data.data;
			list.forEach(item => {
				item.selectedApplyIdx = 0,
				item.isCopy = false
			})
			this.list = list
			this.current_page = res.data.current_page
			this.total_page = res.data.last_page
		},
		currentStatus (item, val) {
			const date = moment().format('YYYY-MM-DD')
			if (item.batches.length && date < item.batches[0].fr_dt) {
				return val ? 'b-r-sm bg-warning' : '대기중'
			} else if (item.apply && date >= item.apply.apply_fr_dt && date <= item.apply.apply_to_dt) {
				return val ? 'b-r-sm btn-apply' : '신청중'
			} else if (item.batches.length && date >= item.batches[0].fr_dt && date <= item.batches[0].to_dt) {
				return val ? 'b-r-sm bg-primary' : '진행중'
			} else if (item.batches.length && date > item.batches[0].to_dt) {
				return val ? 'b-r-sm bg-success' : '완료'
			}
    	},
	}
}
</script>

<style scoped>
.title {
	height: 65px;
}

.content {
	padding: 15px;
}

.table th,
.table td {
	padding-bottom: 8px;
}

.btn-page-set {
	color: #1e9ed3;
	background-color: #fff;
	border: 1px solid #1e9ed3;
	border-radius: 0px;
}

.table {
	margin: 0px;
}
</style>
