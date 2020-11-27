<template>
<div>
	<Header title="입과 관리"
			:use-batch-selection="true" @changeBatch="refreshData"
			search-placeholder="이름 or 이메일 or 고객식별ID" @search="setSearch" @reset="setSearch"
			switch1-text="취소포함" @switch1-change="toggleCancel"
			btn1-text="일괄 입과" @btn1-click="showApplyModal=true" btn1-variant="primary" :btn1-loading="false"
			btn2-text="일괄 수정" @btn2-click="" btn2-variant="warning" :btn2-loading="false"
			btn3-text="일괄 취소" @btn3-click="alert(1)" btn3-variant="danger" :btn3-loading="false">
	</Header>

	<Content>
		<Table :headers="['No','이름','고객식별ID','이메일','연락처','수강권','수강권번호','신청일시','입과일시','입과번호','입과/취소']"
			   :data="orders"
			    v-slot="{item, i}">
			<td>{{ i + 1 }}</td>
			<td @click="openUserInfo(item.idx)">{{ item.user.name }}</td>
			<td><CusIdField :user="item.user"/></td>
			<td>{{ item.user.email}}</td>
			<td>{{ item.user.cel}}</td>
			<td>{{ item.charge_plan && item.charge_plan.title }}</td>
			<td>{{ item.charge_plan && item.charge_plan.idx }}</td>
			<td>{{ item.apply_dt && moment(item.apply_dt).format('YY-MM-DD HH:mm') }}</td>
			<td v-if="item.issue_dt">{{ item.issue_dt && moment(item.issue_dt).format('YY-MM-DD HH:mm') }}</td>
			<td v-else>
			</td>
			<td>{{ item.mt_idx }}</td>
			<td><ItemButton v-if="!item.issue_dt" text="입과" variant="success btn-outline" @click="[showApplyModal=true, curOrder=item]" />
				<ItemButton v-else text="취소" variant="danger" @click="" /></td>
		</Table>
	</Content>

	<UserInfoModal :data="modalitem" v-if="showModal" @close="showModal=false"/>

	<IssueDateModal :item="curOrder" :batch="batch" v-if="showApplyModal" @close="closeApplyModal" @save="issueOrder"/>

</div>
</template>


<script>
import api from "@/common/api"
import moment from 'moment'
import shared from "@/common/shared"
import BatchSelection from "@/components/Common/BatchSelection"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"
import UserInfoModal from "@/components/Modal/UserInfoModal"
import IssueDateModal from '../Modal/IssueDateModal'

export default {
	components: {
		Header,
		Content,
		CusIdField,
		BatchSelection,
		Table,
		ItemButton,
		UserInfoModal,
		IssueDateModal
	},
	data() {
		return {
			orders: [],
			ordersAll: [],
			moment: moment,
			showModal: false,
			showApplyModal: false,
			includeCancel: false,
			batch: null,
			curOrder: null
		};
	},
	created() {
		this.refreshData();
	},
	methods: {
		async refreshData() {
			this.batch = shared.getCurBatch()
			const res = await api.get("/partners/issueOrderList", {bbIdx:this.batch.idx})
			const data = res.data
			this.ordersAll = data.orders
			this.orders = this.ordersAll
			
			this.filteredData()
		},
		filteredData() {
			this.orders = this.ordersAll
			if(!this.includeCancel) {
				this.orders = this.orders.filter((order) => {
					return order.issue_dt !== null
				})
			}
			if(this.sk) this.orders = this.orders.filter((order) => {
				return !order.user.name.indexOf(this.sk) ||
						(order.user.cus_id && !order.user.cus_id.indexOf(this.sk)) ||
						(order.user.email && !order.user.email.indexOf(this.sk))
			})
		},
		async openUserInfo(boIdx) {
			this.modalitem = await shared.getUserInfo(boIdx)
			this.showModal = !this.showModal
		},
		setSearch(sk) {
			this.sk = sk
			this.filteredData()
		},
		toggleCancel(event){
			this.includeCancel = event;
			this.filteredData();
		},
		async issueOrder(fr_dt,to_dt) {
			let res
			if(this.curOrder) {
				res = await api.post("/partners/issueOrder", {boIdx:this.curOrder.idx,frDate:moment(fr_dt).format('YYYY-MM-DD'),toDate:moment(to_dt).format('YYYY-MM-DD')});
			} else {
				res = await api.post("/partners/issueBatch", {bbIdx:shared.getCurBatch().idx,frDate:moment(fr_dt).format('YYYY-MM-DD'),toDate:moment(to_dt).format('YYYY-MM-DD')});
			}

			if (res.result === 2000) {
				this.$swal.fire({
					title: '입과 완료 되었습니다.',
					icon: 'success',
					html: `대상 건수 <strong>${res.data.targetCnt}</strong>건<br/>성공 건수 <strong>${res.data.successCnt}</strong>건<br/>실패 건수 <strong>${res.data.failCnt}</strong>건<br/>`,
					confirmButtonText: 'OK',
				})
				this.refreshData()
				this.curOrder = null
				this.showApplyModal = !this.showApplyModal
			} else if (res.result === 1000) {
				this.$swal.fire({
					title: res.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				})
			}
		},
		closeApplyModal() {
			this.curOrder = null
			this.showApplyModal = !this.showApplyModal
		}
	}
};
</script>



<style scoped>
</style>
