<template>
    <table class="table table-striped table-hover dataTable">
        <thead>
        <tr>
            <th v-for="(header,i) in columns" :key="i" v-if="header">
                <div v-if="typeof header === 'object'" class="sort" @click="[$emit('sort',header.var1,header.var2),sorting(header)]">{{header.column}}<i :class="header.i"></i></div>
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
			columns:[],
			sortKey:''
        }
	},
	created() {
		this.columns = this.headers
		this.columns.forEach(header => {
			if(typeof header === 'object' && header!==null) {
				if(header.sort===true) {
					(header.column==='학습률')? header.i='fa fa-sort-desc':header.i='fa fa-sort-asc'
					this.sortKey = header.column
					console.log(header.i)
				} else header.i='fa fa-sort'
			}
		})
		console.log(this.headers)
	},
    methods: {
        sorting (header) {
			if(this.sortKey === header.column) {
				if (header.i==='fa fa-sort-desc') header.i='fa fa-sort-asc'
				else if(header.i==='fa fa-sort-asc') header.i='fa fa-sort-desc'
			} else {
				this.sorKey = header.column
				this.columns.forEach(header => {
					if(typeof header === 'object' && header!==null && header.i!=='fa fa-sort') {
						header.i='fa fa-sort'
					}
				})
				header.i = 'fa fa-sort-asc'
			}
        }
    }
}

</script>

<style scoped>
.sort {
    cursor: pointer
}
</style>

