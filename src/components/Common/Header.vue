<template>
	<div id="header" class="ibox-title">
		<div id="title">
			{{title}}
		</div>
		<div v-if="useBatchSelection" id="batch">
			<BatchSelection @change="$emit('changeBatch')" />
		</div>
		<div id="search" v-if="searchPlaceholder">
			<div class="input-group">
				<input type="text" :placeholder="searchPlaceholder" v-model="searchModel"
					   v-on:keypress.enter="$emit('search',searchModel)"
					   class="form-control" />
				<span v-if="searchModel" id="search-reset" @click="searchModel='';$emit('reset')">x</span>
				<span class="input-group-btn">
					<button class="btn btn-default" v-on:click="$emit('search', searchModel)">검색</button>
				</span>
			</div>
		</div>
		<div id="switches">
			<div class="switch" v-if="switch1Text">
				<div class="switch-text">
					{{ switch1Text }}
				</div>
				<div>
					<div class="onoffswitch">
						<input class="onoffswitch-checkbox form-control" id="switch1-input" type="checkbox" v-model="switchModel" @change="$emit('switch1-change', switchModel)"/>
						<label class="onoffswitch-label" for="switch1-input">
							<span class="onoffswitch-inner"></span>
							<span class="onoffswitch-switch"></span>
						</label>
					</div>
				</div>
			</div>
			<div class="switch" v-if="switch2Text">
				<div class="switch-text">
					{{ switch2Text }}
				</div>
				<div>
					<div class="onoffswitch">
						<input class="onoffswitch-checkbox form-control" id="switch2-input" type="checkbox" v-model="switchModel" @change="$emit('switch2-change', switchModel)"/>
						<label class="onoffswitch-label" for="switch2-input">
							<span class="onoffswitch-inner"></span>
							<span class="onoffswitch-switch"></span>
						</label>
					</div>
				</div>
			</div>
		</div>
		<div id="custom">
			<slot></slot>
		</div>
		<div id="buttons">
			<label v-if="btn1Text && !btn1Hide" :class="'btn btn-w-m btn-'+btn1Variant" @click="$emit('btn1-click')">
				<div v-if="!btn1Loading">{{ btn1Text }}</div>
				<clip-loader :loading="btn1Loading" color="rgba(255, 255, 255, 0.7)" size="15px"></clip-loader>
			</label>

			<label v-if="btn2Text && !btn2Hide" :class="'btn btn-w-m btn-'+btn2Variant" @click="$emit('btn2-click')">
				<div v-if="!btn2Loading">{{ btn2Text }}</div>
				<clip-loader :loading="btn2Loading" color="rgba(255, 255, 255, 0.7)" size="15px"></clip-loader>
			</label>

			<label v-if="btn3Text && !btn3Hide" :class="'btn btn-w-m btn-'+btn3Variant" @click="$emit('btn3-click')">
				<div v-if="!btn3Loading">{{ btn3Text }}</div>
				<clip-loader :loading="btn3Loading" color="rgba(255, 255, 255, 0.7)" size="15px"></clip-loader>
			</label>

			<label v-if="btn4Text && !btn4Hide" :class="'btn btn-w-m btn-'+btn4Variant" @click="$emit('btn4-click')">
				<div v-if="!btn4Loading">{{ btn4Text }}</div>
				<clip-loader :loading="btn4Loading" color="rgba(255, 255, 255, 0.7)" size="15px"></clip-loader>
			</label>
		</div>
	</div>
</template>

<script>
import BatchSelection from "@/components/Common/BatchSelection";
import ClipLoader from "vue-spinner/src/ClipLoader";

export default {
	components: {
		BatchSelection,
		ClipLoader
	},
	props: {
		title: String,

		useBatchSelection: Boolean,

		searchPlaceholder: String,
		searchKeyDefault: String,

		switch1Text: String,
		switch2Text: String,

		btn1Variant: String,
		btn1Text: String,
		btn1Loading: Boolean,
		btn1Hide: Boolean,

		btn2Variant: String,
		btn2Text: String,
		btn2Loading: Boolean,
		btn2Hide: Boolean,

		btn3Variant: String,
		btn3Text: String,
		btn3Loading: Boolean,
		btn3Hide: Boolean,

		btn4Variant: String,
		btn4Text: String,
		btn4Loading: Boolean,
		btn4Hide: Boolean,
	},
	data() {
		return {
			searchModel: this.searchKeyDefault,
			switchModel: false
		}
	},
};
</script>

<style scoped>
#header {
	display: flex;
	line-height: 1.8;
	padding: 12px 15px;
	margin: 0px 10px;
}

#title {
	font-size: 2.2rem;
	margin-right: 40px;
}

#batch {
	margin-right: 20px;
}

#search {
	position: relative;
	margin-right: 20px;
}
#search-reset {
	position: absolute;
	font-size: 2rem;
	color: #ccc;
	z-index: 99;
	top: -2px;
	right: 60px;
	cursor: pointer;
}


#switches {
	margin-top: 12px;
}
.switch {
	display: flex;
	line-height: 1.5;
}
.switch-text {
	font-size: 1.5rem;
	margin-right: 10px;
}



#custom {
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	font-size: 1.5rem;
}

#buttons {
	margin-left: auto;
}
#buttons .btn {
	margin-left: 10px;
}
</style>
