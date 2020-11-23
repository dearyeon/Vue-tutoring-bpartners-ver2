<template>
<div>
	<Header title="입과 관리"
			:use-batch-selection="true" @changeBatch="refreshData"
			search-placeholder="이름 or 이메일 or 고객식별ID" @search="search"
			switch1-text="취소포함" @switch1-cahnge="toggleCancel"
			btn1-text="일괄 입과" @btn1-click="alert(1)" btn1-variant="primary" :btn1-loading="false"
			btn2-text="일괄 취소" @btn2-click="alert(1)" btn2-variant="danger" :btn2-loading="false">
	</Header>

	<Content>
		<Table :headers="['No','이름','이메일/고객식별ID','수강권','수강권번호','신청일시','입과일시','입과번호','입과/취소']"
			   :data="orders"
			    v-slot="{item, i}">
			<td>{{ i + 1 }}</td>
			<td @click="openUserInfo(item.idx)">{{ item.user.name }}</td>
			<td><CusIdField :user="item.user"></CusIdField></td>
			<td>{{ item.charge_plan && item.charge_plan.title }}</td>
			<td>{{ item.charge_plan && item.charge_plan.idx }}</td>
			<td>{{ item.apply_dt && moment(item.apply_dt).format('YY-MM-DD HH:mm') }}</td>
			<td>{{ item.issue_dt && moment(item.issue_dt).format('YY-MM-DD HH:mm') }}</td>
			<td>{{ item.mt_idx }}</td>
			<td v-if="!item.apply_ccl_dt"><ItemButton text="취소" variant="danger" @click="" /></td>
			<td v-else><ItemButton text="입과" variant="primary" @click="" /></td>
		</Table>
	</Content>

	<UserInfoModal :data="modalitem" v-if="showModal" @close="showModal = !showModal"/>
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

export default {
	components: {
		Header,
		Content,
		CusIdField,
		BatchSelection,
		Table,
		ItemButton,
		UserInfoModal
	},
	data() {
		return {
			orders: [],
			delOrders: [],
			moment: moment,
			curBBIdx: 0,
			showModal: false,
			includeCancel: false,
		};
	},
	created() {
		this.refreshData();
	},
	methods: {
		async refreshData(params) {
			if(!params) params = {}

			this.curBBIdx = shared.getCurBatch().idx
			params.bbIdx = this.curBBIdx

			const res = await api.get("/partners/issueOrderList", params);
			const data = res.data;
			if(this.includeCancel) {
				this.orders = data.orders;
			} else {
				this.orders = data.orders.filter( (order) => {
					return order.apply_ccl_dt === null
				})
			}
		},
		async openUserInfo(boIdx) {
			this.modalitem = await shared.getUserInfo(boIdx)
			this.showModal = !this.showModal
		},
		search(sk) {
			this.refreshData({sk:sk})
		},
		toggleCancel(event){
			this.includeCancel = event;
			this.refreshData();
		},
	}
};
</script>



<style scoped>
</style>
