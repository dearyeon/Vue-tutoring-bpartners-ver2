<template>
	<div id="button"
		 :class="`btn btn-${variant} btn-outline ${disabled?'disabled':''}`"
		 @click="$emit('click')">
		{{text}}
	</div>
</template>

<script>
export default {
	props: {
		text: String,
		variant: String,
		disabled: Boolean
	}
}
</script>

<style scoped>
#button {
	border-radius: 4px;
}

</style>
