<template>
	<table class="table table-striped table-hover dataTable">
		<thead>
		<tr>
			<th v-for="(header,i) in headers" :key="i" v-if="header">
				{{header}}
			</th>
		</tr>
		</thead>
		<tbody>
		<tr class="hover-pointer" v-for="(item, i) in data" :key="i" v-show="!item.hide">
			<slot :item="item" :i="i"></slot>
		</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	props: {
		headers: Array,
		data: Array
	}
}

</script>

<style scoped>
</style>
