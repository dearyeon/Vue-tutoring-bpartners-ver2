<template>
    <ul class="pagination">
        <li><a rel="prev" @click="setPage(currentPage-1)">&laquo;</a></li>
            <li :class="(currentPage===pn)?'active':''" v-for="pn in totalPage" :key="pn">
                <a @click="setPage(pn)">{{ pn }}</a>
            </li>
        <li><a rel="next" @click="setPage(currentPage+1)">&raquo;</a></li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            currentPage: 1,
        };
    },
    props: {
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