<template>
	<div>
		<Header title="차수 관리"
			search-placeholder="고객사 명" :search-key-default="searchKey" @search="search" @reset="search(null)">
			<!--<router-link :to="{ path: '/register/createPage' }"></router-link>-->
		</Header>

		<Content>
			<Table :headers="['No','고객사','담당자','회차','달성률','빌링','현재상태','신청시작일시','신청종료일시','수정일시']
							.concat($shared.isSupervisor()?['차수관리','신청양식설정','','URL']:null)"
				:data="list"
				v-slot="{item, i}">
				<td>{{ total - ((current_page - 1) * per_page) - i }}</td>
				<td>{{ item.company }}</td>
				<td>{{ item.name }}</td>
				<td>
					<select v-model="item.selectedApplyIdx" v-if="item.batches.length" style="height:30px; width:100%">
						<option v-for="(apply,i) in item.batches" :value="i" :key="apply.id">
							{{ apply.b_no }}회차
							({{ moment(apply.fr_dt).format('YY.MM.DD') }}-{{ moment(apply.to_dt).format('MM.DD') }}){{ item.batches[item.selectedApplyIdx].del_yn ? ' 취소' : '' }}
						</option>
					</select>
				</td>
				<td>{{
						item.batches.length ? (item.batches[item.selectedApplyIdx].target_rt ? item.batches[item.selectedApplyIdx].target_rt + '%' : '') : ''
					}}
				</td>
				<td>{{ item.batches.length ? (item.batches[item.selectedApplyIdx].use_billing ? '빌링' : '') : '' }}</td>
				<td><label :class="currentStatus(item,1)"
					style="width:60px;text-align: center">{{ currentStatus(item, 0) }}</label></td>
				<td>{{
						item.batches.length ? (item.batches[item.selectedApplyIdx].fr_dt ? moment(item.batches[item.selectedApplyIdx].fr_dt).format('YY-MM-DD HH:MM') : '') : ''
					}}
				</td>
				<td>{{
						item.batches.length ? (item.batches[item.selectedApplyIdx].to_dt ? moment(item.batches[item.selectedApplyIdx].to_dt).format('YY-MM-DD HH:MM') : '') : ''
					}}
				</td>
				<td>{{ item.upd_dt ? moment(item.upd_dt).format('YY-MM-DD HH:MM') : '' }}</td>
				<td v-if="$shared.isSupervisor()" class="text-left" style='white-space: nowrap;'>
					<ItemButton text="추가" variant="page-set" @click="createBatchPage(item.idx,item.company)"/>
					<ItemButton v-if="item.batches.length?(!!item.batches[item.selectedApplyIdx].idx):0" text="수정"
						variant="page-set" @click="editBatchPage(item.batches[item.selectedApplyIdx].idx)"/>
				</td>

				<td v-if="$shared.isSupervisor()" style='white-space: nowrap'>
					<div v-if="item.batches.length">
						<ItemButton v-if="!!item.batches[item.selectedApplyIdx].apply" text="페이지 수정" variant="page-set"
							@click="editApplyPage(item.batches[item.selectedApplyIdx].apply.idx)"/>
						<ItemButton v-else text="페이지 등록" variant="page-set"
							@click="createApplyPage(item.batches[item.selectedApplyIdx].idx, item.idx)"/>
					</div>
				</td>
				<td v-if="$shared.isSupervisor()">
					<ItemButton v-if="item.batches.length?item.batches[item.selectedApplyIdx].apply:0" text="신청 페이지"
						variant="primary" @click="goToApplyPage(applyPageUrl(item,item.selectedApplyIdx)+'/7788')"/>
				</td>
				<td v-if="$shared.isSupervisor()">
					<a v-if="item.batches.length?item.batches[item.selectedApplyIdx].apply:0"
						@click="copyText($event,i)">{{ applyPageUrl(item, item.selectedApplyIdx) }}</a>
					<div class="alert alert-success no-padding" role="alert" v-show="item.isCopy"
						:id="'clipBoardAlert'+i">
						<a href="#" class="alert-link">클립보드에 복사되었습니다.</a>
					</div>
				</td>
			</Table>
		</Content>

		<Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)"
			@returnPage="setCurrentPage"/>
	</div>
</template>

<script>
import api from '@/common/api'
import moment from 'moment'
import Header from "@/components/Header.vue";
import Content from "@/components/Content.vue";
import Table from "@/components/Table.vue";
import ItemButton from "@/components/ItemButton.vue";
import Pagination from "@/components/Pagination.vue";

const hostId = window.location.hostname.split('.')[0].split('-')[1];

let server;
if (hostId !== undefined) {
	server = '-' + hostId;
} else {
	window.location.hostname.split('.')[0] === 'partners2' ? server = '' : server = '-dev'
}

const applyPageDomain = 'https://apply' + server + '.tutoring.co.kr/';

export default {
	data() {
		return {
			list: [],
			current_page: 1,
			total_page: 1,
			per_page: 0,
			total: 0,
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
		Table,
		ItemButton,
		Pagination
	},
	async created() {
		this.searchKey = this.$shared.getCurSite().company;
		this.refreshData()
	},
	methods: {
		async refreshData() {
			const {data} = await api.get('/partners/siteBatchList', {sk: this.searchKey, page: this.current_page})
			let list = data.data;
			list.forEach(item => {
				item.selectedApplyIdx = 0,
					item.isCopy = false
			})
			this.list = list
			this.current_page = data.current_page
			this.total_page = data.last_page
			this.per_page = data.per_page
			this.total = data.total
		},
		async search(searchKey) {
			this.searchKey = searchKey
			this.current_page = 1
			this.$shared.setCurSite({company: searchKey})
			this.refreshData()
		},
		async setCurrentPage(page) {
			this.current_page = page
			this.refreshData()
		},


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
		createBatchPage(bsIdx, company) {
			this.$router.push({
				name: 'batchNew',
				params: {bsIdx: bsIdx, company: company}
			})
		},
		editBatchPage(bIdx) {
			this.$router.push({
				name: 'batchEdit',
				params: {bIdx: bIdx}
			})
		},
		editApplyPage(baIdx) {
			this.$router.push({
				name: 'batchApplyPageForm',
				params: {baIdx: baIdx}
			})
		},
		createApplyPage(bIdx, bsIdx) {
			this.$router.push({
				name: 'batchApplyPageNew',
				params: {bIdx: bIdx, bsIdx}
			})
		},
		currentStatus(item, val) {
			const date = moment().format('YYYY-MM-DD')
			if (item.batches.length && date < item.batches[item.selectedApplyIdx].fr_dt) {
				return val ? 'b-r-sm bg-warning' : '대기중'
			} else if (item.apply && date >= item.apply.apply_fr_dt && date <= item.apply.apply_to_dt) {
				return val ? 'b-r-sm btn-apply' : '신청중'
			} else if (item.batches.length && date >= item.batches[item.selectedApplyIdx].fr_dt && date <= item.batches[item.selectedApplyIdx].to_dt) {
				return val ? 'b-r-sm bg-primary' : '진행중'
			} else if (item.batches.length && date > item.batches[item.selectedApplyIdx].to_dt) {
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
