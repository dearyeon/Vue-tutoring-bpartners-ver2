<template>
    <table class="table table-striped table-hover dataTable">
        <thead>
			{{$shared.sortKey}}
        <tr>
            <th v-for="(header,i) in headers" :key="i" v-show="header">
                <div v-if="typeof header==='object'&&header" class="sort" @click="[$emit('sort',header.var),sorting(header)]">{{header.column}}<i :class="isSort[header.column]"></i></div>
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
			isSort:[],
			sortKey:''
        }
	},
	created() {
		this.headers.forEach(header => {
			if(typeof header==='object'&&header) {
				if(header.default===true) {
					(header.column==='학습률')? this.isSort[header.column]='fa fa-sort-desc':this.isSort[header.column]='fa fa-sort-asc'
					this.sortKey = header.column
				} else this.isSort[header.column]='fa fa-sort'
			}
		})
	},
    methods: {
        sorting (header) {
			if(this.sortKey === header.column) {
				if (this.isSort[header.column]==='fa fa-sort-desc') this.isSort[header.column]='fa fa-sort-asc'
				else if(this.isSort[header.column]==='fa fa-sort-asc') this.isSort[header.column]='fa fa-sort-desc'
			} else {
				this.sortKey = header.column
				this.headers.forEach((header,i) => {
					if(header&& header.column && this.isSort[header.column]!=='fa fa-sort') {
						this.isSort[header.column]='fa fa-sort'
					}
				})
				this.isSort[header.column] = 'fa fa-sort-asc'
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

