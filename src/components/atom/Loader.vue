<template>
	<div class="row auto-clear">
		<div class="col-sm-6 col-md-4 col-lg-3">
			<div>
				<pulse-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="50px"></pulse-loader>
			</div>
			<div>
				<grid-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></grid-loader>
			</div>
			<div>
				<clip-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></clip-loader>
			</div>
			<div>
				<rise-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></rise-loader>
			</div>
			<div>
				<beat-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></beat-loader>
			</div>
			<div>
				<sync-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></sync-loader>
			</div>
			<div>
				<rotate-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></rotate-loader>
			</div>
			<div>
				<fade-loader :loading="true" color="rgba(255, 100, 255, 0.7)" height="50px" width="50px"></fade-loader>
			</div>
			<div>
				<pacman-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></pacman-loader>
			</div>
			<div>
				<square-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></square-loader>
			</div>
			<div>
				<scale-loader :loading="true" color="rgba(255, 100, 255, 0.7)" height="50px" width="50px"></scale-loader>
			</div>
			<div>
				<scale-loader :loading="true" color="rgba(255, 100, 255, 0.7)" height="50px" width="50px"></scale-loader>
			</div>
			<div>
				<skew-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></skew-loader>
			</div>
			<div>
				<moon-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></moon-loader>
			</div>
			<div>
				<ring-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></ring-loader>
			</div>
			<div>
				<bounce-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></bounce-loader>
			</div>
			<div>
				<dot-loader :loading="true" color="rgba(255, 100, 255, 0.7)" size="60px"></dot-loader>
			</div>
		</div>
	</div>
</template>

<script>
	import PurseLoader from 'vue-spinner/src/PulseLoader.vue'
	import GridLoader from 'vue-spinner/src/GridLoader.vue'
	import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
	import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
	import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
	import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
	import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
	import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
	import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'
	import SquareLoader from 'vue-spinner/src/SquareLoader.vue'
	import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
	import SkewLoader from 'vue-spinner/src/SkewLoader.vue'
	import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
	import RingLoader from 'vue-spinner/src/RingLoader.vue'
	import DotLoader from 'vue-spinner/src/DotLoader.vue'
	import BounceLoader from 'vue-spinner/src/BounceLoader.vue'








	export default {
		data() {
			return {

			}
		},
		components:{
			PurseLoader,
			GridLoader,
			ClipLoader,
			RiseLoader,
			BeatLoader,
			SyncLoader,
			RotateLoader,
			FadeLoader,
			PacmanLoader,
			SquareLoader,
			ScaleLoader,
			SkewLoader,
			MoonLoader,
			RingLoader,
			DotLoader,
			BounceLoader
		}
	};
</script>

