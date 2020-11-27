<template>
	<div class="container">
		<span class="name" @click="openUserInfo">{{item.user.name}}</span>
	    <UserInfoModal :data="item" v-if="showModal" @close="showModal = !showModal"/>
	</div>
</template>

<script>
import UserInfoModal from "@/components/Modal/UserInfoModal"
export default {
    data() {
        return {
            showModal = false
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
