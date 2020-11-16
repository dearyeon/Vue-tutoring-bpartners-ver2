<template>
	<div class="container">
		<span class="cusId" v-if="user.cus_id" @click="gotoAdmin">{{user.cus_id}}</span>
		<span v-if="!user.cus_id">{{user.email}}</span>
	</div>
</template>

<script>
export default {
	props: {
		user: {
			u_idx: 0,
			cus_id: null,
			email: null
		}
	},
	methods: {
		gotoAdmin() {
			window.open('https://admin.tutoring.co.kr:9001/student/list/'+this.user.u_idx)
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
}
</style>
