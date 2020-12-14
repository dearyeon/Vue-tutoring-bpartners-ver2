<template>
    <table class="table table-striped table-hover dataTable">
        <thead>
			{{$shared.sortKey}}
        <tr>
            <th v-for="(header,i) in headers" :key="i" v-show="header">
                <div v-if="typeof header==='object'&&header" class="sort" @click="[$emit('sort',header.var),sorting(header,i)]">{{header.column}}<i :class="isSort[i]"></i></div>
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
		this.headers.forEach((header,i) => {
			if(typeof header==='object'&&header) {
				if(header.default===true) {
					(header.column==='학습률')? this.isSort[i]='fa fa-sort-desc':this.isSort[i]='fa fa-sort-asc'
					this.sortKey = header.column
				} else this.isSort[i]='fa fa-sort'
			}
		})
	},
    methods: {
        sorting (header,i) {
			if(this.sortKey === header.column) {
				if (this.isSort[i]==='fa fa-sort-desc') this.isSort[i]='fa fa-sort-asc'
				else if(this.isSort[i]==='fa fa-sort-asc') this.isSort[i]='fa fa-sort-desc'
			} else {
				this.sortKey = header.column
				this.headers.forEach((header,i) => {
					if(header.column && this.isSort[i]!=='fa fa-sort') {
						this.isSort[i]='fa fa-sort'
					}
				})
				this.isSort[i] = 'fa fa-sort-asc'
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

