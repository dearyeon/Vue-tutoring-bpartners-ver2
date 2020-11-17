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
					   v-on:keypress.enter="$emit('search',searchModel)" class="form-control"/>
				<span class="input-group-btn">
					<button class="btn btn-default" v-on:click="$emit('search', searchModel)">검색</button>
				</span>
			</div>
		</div>
		<div id="switch" v-if="switchText">
			<div id="switch-text">
				{{ switchText }}
			</div>
			<div id="switch-control">
				<div class="onoffswitch">
					<input class="onoffswitch-checkbox form-control" id="switch-input" type="checkbox" v-model="switchModel"/>
					<label class="onoffswitch-label" for="switch-input">
						<span class="onoffswitch-inner"></span>
						<span class="onoffswitch-switch"></span>
					</label>
				</div>
			</div>
		</div>
		<div id="custom">
			<slot></slot>
		</div>
		<div id="buttons">
			<label v-if="btn1Text" :class="'btn btn-w-m btn-'+btn1Variant" @click="$emit('btn1click')">
				<div v-if="!btn1Loading">{{ btn1Text }}</div>
				<clip-loader :loading="btn1Loading" color="rgba(255, 255, 255, 0.7)" size="15px"></clip-loader>
			</label>&nbsp;

			<label v-if="btn2Text" :class="'btn btn-w-m btn-'+btn2Variant" @click="$emit('btn2click')">
				<div v-if="!btn2Loading">{{ btn2Text }}</div>
				<clip-loader :loading="btn2Loading" color="rgba(255, 255, 255, 0.7)" size="15px"></clip-loader>
			</label>&nbsp;
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

		switchText: String,

		btn1Variant: String,
		btn1Text: String,
		btn1Loading: Boolean,

		btn2Variant: String,
		btn2Text: String,
		btn2Loading: Boolean,
	},
	data() {
		return {
			searchModel: '',
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
	margin-right: 20px;
}

#switch {
	display: flex;
	margin-top: 12px;
	line-height: 1.5;
}
#switch-text {
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
</style>
