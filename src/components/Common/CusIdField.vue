<template>
	<span class="container">
		<span v-if="$shared.isSupervisor()" class="cusId" @click="gotoAdmin">{{user.cus_id}}</span>
		<span v-if="!$shared.isSupervisor()">{{user.cus_id}}</span>
	</span>
</template>

<script>
export default {
	props: {
		user: {
			u_idx: 0,
			cus_id: null
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
	/*display: contents;*/
}
.cusId {
	font-family: monospace;
	color: #1a7bb9;
}
.cusId:hover {
	color: #9c0000;
}
</style>
