<template>
    <table class="table table-striped table-hover dataTable">
        <thead>
        <tr>
            <th v-for="(header,i) in headers" :key="i" v-if="header">
                <div v-if="header === '학습률'" class="sort" @click="[$emit('sort'), sort=!sort]">{{header}}<i :class="sorting()"></i></div>
                <div v-else>{{header}}</div>
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
    },
    data() {
        return {
            sort:false
        }
    },
    methods: {
        sorting () {
            if(this.sort) return 'fa fa-chevron-up'
            else return 'fa fa-chevron-down'
        }
    }
}

</script>

<style scoped>
.sort {
    cursor: pointer
}
</style>

