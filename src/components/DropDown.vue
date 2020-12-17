<template>
	<span class="container">
        <span class="pull-left">
            <strong>현재상태</strong>
        </span>
        <select id="select" style="font-size:15px" @change="$emit('change',$event)">
			<option value="">-- 전체 --</option>
            <option v-for="(item,i) in value" :value="i" :key="item.id">{{ item }}</option>
        </select>
	</span>
</template>

<script>
export default {
    data() {
        return {
            value: []
        }
    },
    created() {
        this.value = ['진행중','대기중','완료']
    },
    methods: {

    }
};
</script>

<style scoped>
#select {
    margin-left:10px
}
</style>
