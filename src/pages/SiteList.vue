<template>
	<div>
		<Header title="고객사 관리"
			search-placeholder="고객사 명" :search-key-default="searchKey" @search="search" @reset="search(null)"
			btn1-text="고객사 등록" @btn1-click="createCustomerPage" btn1-variant="success" :btn1-loading="false" :btn1-hide="$shared.isPartnerManger()">
		</Header>

		<Content>
			<Table :headers="['No',' ',{column:'고객사 명',default:true,var:{var1:'company'}},
							  '담당자 이름','부서','전화번호','이메일',
							  {column:'등록일자',default:false,var:{var1:'reg_dt'}},'수정일자']
							.concat($shared.isSupervisor()?['고객사수정']:null)"
				:data="items" @sort="sort"
				v-slot="{item, i}">
				<td>{{ total - ((current_page - 1) * per_page) - i }}</td>
				<td><img alt="image" class="img-rounded" :src="$shared.getSiteImgThumbnailUrl(item.ci_img)"
					style="width:20px;height:20px;"></td>
				<td>{{ item.company }}</td>
				<td>{{ item.name }}</td>
				<td>{{ item.part }}</td>
				<td>{{ item.tel }}</td>
				<td>{{ item.email }}</td>
				<td>{{ item.reg_dt ? moment(item.reg_dt).format('YYYY-MM-DD') : '' }}</td>
				<td>{{ item.upd_dt ? moment(item.upd_dt).format('YYYY-MM-DD') : '' }}</td>
				<td v-if="!$shared.isPartnerManger()">
					<ItemButton text="수정" variant="edit" @click="editCustomerPage(item.idx)"/>
				</td>
			</Table>
		</Content>

		<Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)"
			@returnPage="setCurrentPage"/>
		<AddSiteModal v-if="showModal" @close="openModal" @update="updateItem"/>
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
import AddSiteModal from "@/modals/AddSiteModal.vue";

export default {
	data() {
		return {
			items: [],
			sortKey: '',
			searchKey: '삼성',
			current_page: 1,
			total_page: 1,
			per_page: 1,
			total: 0,
			showModal: false,
			moment: moment
		};
	},
	components: {
		Header,
		Content,
		Table,
		ItemButton,
		Pagination,
		AddSiteModal
	},
	async created() {
		this.searchKey = this.$shared.getCurSite().company;
		this.refreshData()
	},
	methods: {
		async refreshData() {
			const res = await api.get('/partners/siteList', {sk: this.searchKey, page: this.current_page})
			this.current_page = res.data.current_page
			this.total_page = res.data.last_page
			this.per_page = res.data.per_page
			this.items = res.data.data
			this.total = res.data.total
			this.$shared.sortBy(this.items,'company')
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

		createCustomerPage() {
			this.$router.push({name: 'siteNew'})
		},
		editCustomerPage(idx) {
			this.$router.push({
				name: 'siteForm',
				params: {idx: idx}
			})
		},
		openModal() {
			this.showModal = !this.showModal;
		},
		updateItem() {
			////
		},
		sort(sortKey) {
			this.$shared.sortBy(this.items,sortKey.var1,sortKey.var2,sortKey.var3)
		}
	}
}
</script>

<style scoped>
.btn-edit {
	color: #1e9ed3;
	background-color: #fff;
	border: 1px solid #1e9ed3;
	border-radius: 0px;
}
</style>
