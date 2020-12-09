<template>
	<span class="container">
		<span><strong>{{item.user.name}}({{item.user.email?item.user.email:item.user.cus_id}})</strong>님<br/>을 취소 하시겠습니까?</span>
	</span>
</template>

<script>
import shared from "@/common/shared"
export default {
	props: {
		item: Object
    }
};
</script>

<style scoped>
</style>
