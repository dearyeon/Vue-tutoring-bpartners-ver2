<template>
	<span class="container">
		<span class="name" @click="openUserInfo">{{item.user.name}}</span>
	    <UserInfoModal :data="modalitem" v-if="showModal" @close="showModal = !showModal"/>
	</span>
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
            this.modalitem = await shared.getUserInfo(this.item.idx)
			this.showModal = !this.showModal
		},
	}
};
</script>

<style scoped>
<<<<<<< HEAD
=======
.container {

}
>>>>>>> 7e4d1e08ed33aefda9dc3a787523e5cb0adcada7
.cusId {
	font-family: monospace;
	color: #1a7bb9;
}
.cusId:hover {
	color: #9c0000;
}
</style>
