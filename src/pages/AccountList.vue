<template>
	<div>
		<Header title="계정 관리"
			search-placeholder="이름 or 이메일 or 사이트 or 파트너" @search="setSearch" @reset="setSearch"
			btn1-text="신규 등록" @btn1-click="createAccountPage" btn1-variant="success">
		</Header>
		<Content>
			<Table :headers="['No',{column:'ID',default:true,var:{var1:'id'}},
                              {column:'이름',default:false,var:{var1:'name'}},
                              {column:'권한',default:false,var:{var1:'acc_level'}},
                              {column:'파트너/사이트',default:false,var:{var1:'company'}},
							  '이메일','연락처',
                              {column:'로그인일시',default:false,var:{var1:'last_login_dt'}},'수정일시','']"
				:data="items" @sort="sort"
				v-slot="{item, i}">
				<td>{{ i+1 }}</td>
				<td>{{ item.id }}</td>
				<td>{{ item.name }}</td>
				<td>{{ item.acc_level==='P'?'리셀러':item.acc_level==='S'?'사이트관리자':'슈퍼바이저' }}</td>
				<td>{{ item.company }}</td>
				<td>{{ item.email }}</td>
				<td>{{ item.tel }}</td>
				<td>{{ item.last_login_dt ? moment(item.last_login_dt).format('YYYY-MM-DD mm:ss') : '' }}</td>
				<td>{{ item.upd_dt ? moment(item.upd_dt).format('YYYY-MM-DD mm:ss') : '' }}</td>
				<td v-if="!$shared.isPartnerManger()">
					<ItemButton text="수정" variant="edit" @click="editAccountPage(item.idx)" />
				</td>
			</Table>
		</Content>
	</div>
</template>

<script>
import api from '@/common/api'
import moment from 'moment'
import Header from "@/components/Header.vue";
import Content from "@/components/Content.vue";
import Table from "@/components/Table.vue";
import ItemButton from "@/components/ItemButton.vue";

export default {
	data() {
		return {
			items: [],
			itemsAll: [],
			searchKey: '',
			moment: moment
		};
	},
	components: {
		Header,
		Content,
		Table,
		ItemButton
	},
	async created() {
		this.searchKey = this.$shared.getCurSite().company;
		this.refreshData()
	},
	methods: {
		async refreshData() {
			const res = await api.get('/partners/accountList')
			console.log(res)
			this.items = res.data
			this.items.map(item=>{
				item.company = item.acc_level==='V'? '' : (item.site ? item.site.company : item.partner.company)
				return item
			})
			this.$shared.sortBy(this.items,'id')
			this.itemsAll = this.items
		},
		async search(searchKey) {
			this.searchKey = searchKey
			this.current_page = 1
			this.$shared.setCurSite({company: searchKey})
			this.refreshData()
		},
		createAccountPage() {
			this.$router.push({
				name: 'accountNew'
			})
		},
		editAccountPage(idx) {
			this.$router.push({
				name: 'accountForm',
				params: {idx: idx}
			})
		},
		sort(sortKey) {
			this.$shared.sortBy(this.items,sortKey.var1,sortKey.var2,sortKey.var3)
		},
		setSearch(sk) {
			this.items = this.itemsAll
			if (sk) {
				this.items = this.items.filter((item) => {
					return item.name.includes(sk) ||
						(item.id && item.id.includes(sk)) ||
						(item.email && item.email.includes(sk)) ||
						(item.company && item.company.includes(sk))
				})
			}
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
