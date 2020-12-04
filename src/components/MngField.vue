<template>
	<span @click="$shared.isSupervisor() && $emit('click',item,data)">
		<div class="mng-text" v-if="data">{{data}}</div>
		<ItemButton v-if="!data && $shared.isSupervisor()" :text="btnTitle" variant="default" />
	</span>
</template>

<script>

	import ItemButton from "./ItemButton"

	export default {
		props: {
			item: Object,
			data: String,
			btnTitle: String
		},
		components: {
			ItemButton
		}
	};
</script>

<style scoped>
	.mng-text {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 70px;
		white-space: nowrap;
	}
</style>
