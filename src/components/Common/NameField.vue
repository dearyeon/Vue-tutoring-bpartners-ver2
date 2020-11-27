<template>
	<div class="container">
		<span class="name" @click="openUserInfo">{{item.user.name}}</span>
	    <UserInfoModal :data="item" v-if="showModal" @close="showModal = !showModal"/>
	</div>
</template>

<script>
import api from '@/common/api'
import shared from "@/common/shared"
import UserInfoModal from "@/components/Modal/UserInfoModal"
export default {
    data() {
        return {
            modalitem: [],
            showModal: false
        }
    },
	props: {
		item: Object
    },
    components: {
		UserInfoModal
	},
	methods: {
		async openUserInfo() {
            console.log(this.item.idx)
            this.modalitem = await shared.getUserInfo(this.item.idx)
			this.showUserInfoModal = !this.showUserInfoModal
		},
	}
};
</script>

<style scoped>
.container {
	display: contents;
}
.cusId {
	font-family: monospace;
	color: #1a7bb9;
}
.cusId:hover {
	color: #9c0000;
}
</style>
