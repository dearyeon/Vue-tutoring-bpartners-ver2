<template>
    <ul class="pagination">
        <li><a rel="prev" @click="setPage(currentPage-1)">&laquo;</a></li>
            <li v-for="pn in totalPage" :key="pn" :class="(currentPage===pn)?'active':''">
                <a @click="setPage(pn)">{{ pn }}</a>
            </li>
        <li><a rel="next" @click="setPage(currentPage+1)">&raquo;</a></li>
    </ul>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPage: {
            type: Number,
            required: true
        }
    },
    methods: {
        setPage(page_num) {
            if(page_num > 0 && page_num <= this.totalPage) {
                this.currentPage = page_num;
                this.$emit("returnPage", this.currentPage);
            }
        }
    }
}
</script>