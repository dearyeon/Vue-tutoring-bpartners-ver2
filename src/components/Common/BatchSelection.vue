<template>
	<div class="container">
		<cool-select v-model="selectedBatch"
					 :items="filteredBatches"
					 placeholder="사이트 이름으로 검색"
					 item-value="idx"
					 item-text="company"
					 class="select"
					 :inputElCustomAttributes="{id:'cool-input'}"
					 @select="onSelected" @focus="onFocus" @blur="onBlur" @search="onSearch">
			<!-- slot for each item in the menu -->
			<template slot="item" slot-scope="{ item: batch }">
				<div class="item-container">
					<img :src="$shared.getSiteImgThumbnailUrl(batch.ci_img)" class="ci-img">
					<span>
						{{ batch.company }} {{ batch.b_no }}회차 ({{moment(batch.fr_dt).format('YY.MM.DD')}}-{{moment(batch.to_dt).format('MM.DD')}})
					</span>
				</div>
			</template>

			<!-- slot for the selected item (in the text field) -->
			<template slot="selection" slot-scope="{ item: batch }">
				<div @click="onFocus">
					<img :src="$shared.getSiteImgThumbnailUrl(batch.ci_img)" class="ci-img">
					{{ batch.company }} {{ batch.b_no }}회차 ({{moment(batch.fr_dt).format('YY.MM.DD')}}-{{moment(batch.to_dt).format('MM.DD')}})
				</div>
			</template>

			<template slot="no-data" slot-scope="{ item: batch }">
				<div>
					검색 결과가 없습니다
				</div>
			</template>

		</cool-select>
	</div>
</template>

<script>
import { CoolSelect } from 'vue-cool-select'
import api from "@/common/api";
import moment from 'moment'
import shared from "@/common/shared";

let focusing = false
let input = null
let allBatches = null

export const refreshAllBatches = async function() {
	const res = await api.get('/partners/batches');
	allBatches = res.data;
}

export default {
	components: { CoolSelect },
	data() {
		return {
			filteredBatches: [],
			selectedBatch: null,
			moment: moment,
			curBatch: {}
		}
	},
	async created() {
		if(allBatches == null) await refreshAllBatches();
		this.filteredBatches = allBatches;

		this.curBatch = shared.getCurBatch()
		this.selectedBatch = this.curBatch
		this.filter(this.curBatch.company)
	},
	methods: {
		onSelected(batch) {
			console.debug('selected',batch.idx)

			this.curBatch = batch
			shared.setCurBatch(batch)
			this.$emit('change')

			this.filter(batch.company)
			document.getElementById('cool-input').blur();
		},
		onFocus() {
			this.selectedBatch = null
			console.debug('focus')

			focusing = true
			setTimeout(()=>{
				document.getElementById('cool-input').focus()
				focusing = false
			},300)
		},
		onBlur() {
			if(focusing) return

			console.debug('blur')
			this.selectedBatch = this.curBatch
		},
		onSearch() {
			if(this.filteredBatches != allBatches) {
				this.filteredBatches = allBatches
			}
		},
		filter(word) {
			this.filteredBatches = allBatches.filter(function (batch){
				return batch.company.indexOf(word) > -1
			});
		}
	}
};
</script>

<style scoped>
.container {
	display: contents;
}
.ci-img {
	width: 30px;
	height: 30px;
	margin-right: 0px;
	border: 1px solid #eaecf0;
	border-radius: 5px;
}
.select {
	width: 320px;
	height: 40px;
}
.item-container {

}
</style>

<style>
.batch-selection .IZ-select__item {
	padding: 8px 5px;
}
.batch-selection .IZ-select__item.IZ-select__item--selected {
	background-color: #eceef2;
}
.batch-selection .IZ-select__input.IZ-select__input--selection-slot {
	padding-left: 5px;
}
.IZ-select__input.IZ-select__input--selection-slot input {
	display: none;
}
</style>
