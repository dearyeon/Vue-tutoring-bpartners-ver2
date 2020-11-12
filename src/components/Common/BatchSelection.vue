<template>
	<div class="container">
		<cool-select v-model="selectedBatch"
					 :items="batches"
					 placeholder=""
					 item-value="idx"
					 item-text="company"
					 class="select"
					 :inputElCustomAttributes="{id:'cool-input'}"
					 @select="onSelected" @focus="onFocus" @blur="onBlur">
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
					검색 결과가 없습니다.
				</div>
			</template>

		</cool-select>
	</div>
</template>

<script>
import { CoolSelect } from 'vue-cool-select'
import api from "@/common/api";
import moment from 'moment'

export default {
	components: { CoolSelect },
	data() {
		return {
			batches: ['a','b'],
			selectedBatch: null,
			moment: moment
		}
	},
	async created() {
		const res = await api.get('/partners/batches');
		this.batches = res.data;
	},
	methods: {
		onSelected(batch) {
			localStorage.setItem('curBBIdx', batch.idx)
			console.debug('idx',batch.idx)
			document.getElementById('cool-input').blur();
		},
		onFocus() {
			console.debug('focus')
			this.selectedBatch = null
		},
		onBlur() {
			const curBBIdx = localStorage.getItem('curBBIdx')
			console.debug('blur',curBBIdx)
			this.selectedBatch = Number(curBBIdx)
		},
	}
};
</script>

<style scoped>
.container {
	display: flex;
}
.ci-img {
	width: 30px;
	height: 30px;
	margin-right: 10px;
	border: 1px solid #eaecf0;
	border-radius: 5px;
}
.select {
	width: 400px;
}
.item-container {

}
</style>

<style>
.IZ-select__item.IZ-select__item--selected {
	background-color: #eceef2 !important;
}
</style>
