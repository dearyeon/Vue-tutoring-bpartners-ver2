<template>
	<div id="wrapper">
		<Menu class="menu" :menuToggle="menuToggle"></Menu>
		<div :id="menuToggle?'page-wrapper':'container'" class="gray-bg animated">
			<!-- :class="menuToggle?'':'col-lg-11 col-lg-offset-1'"-->
			<button @click="menuToggle = !menuToggle"><i class="fa fa-bars"/></button>

			<!-- content begin -->
			<div class="wrapper wrapper-content">
				<router-view></router-view>
			</div>
			<!-- content begin -->


			<!-- footer begin -->
			<div class="footer">
				<div class="pull-right">
					TUTORING All Rights Reserved.
				</div>
				<div>
					<strong>Copyright</strong> TUTORING &copy; 2020
				</div>
			</div>
			<!-- footer end -->

			<!-- common modal begin -->
			<!--common modal end-->

		</div>
	</div>
</template>


<script>
import Menu from "@/components/Menu.vue";

export default {
	components: {
		Menu,
	},
	data() {
		return {
			menuToggle: true,
		}
	}
}
</script>


<style>
#wrapper {
	height: 100%;
}

#page-wrapper {
	padding: 0;
}

button {
	border: 0;
	outline: none;
	background-color: rgb(38, 57, 73);
}

.slide-fade-enter-active, .slide-fade-leave-active {
	transition: all .3s ease;
}

.slide-fade-leave-to {
	transform: translateX(-100px);
	opacity: 0;
}

.slide-fade-enter {
	transform: translateX(10px);
	opacity: 0;
}

body .row {
	margin: 0px;
}

.header {
	height: 65px;
}
.batch-selection {
	margin-top: -5px;
	margin-left: 100px;
	display: inline-block;
}

@media (min-width: 1200px) {
	.row.auto-clear .col-lg-1:nth-child(12n + 1) {
		clear: left;
	}

	.row.auto-clear .col-lg-2:nth-child(6n + 1) {
		clear: left;
	}

	.row.auto-clear .col-lg-3:nth-child(4n + 1) {
		clear: left;
	}

	.row.auto-clear .col-lg-4:nth-child(3n + 1) {
		clear: left;
	}

	.row.auto-clear .col-lg-6:nth-child(2n + 1) {
		clear: left;
	}
}

@media (min-width: 991px) and (max-width: 1199px) {
	.row.auto-clear .col-md-1:nth-child(12n + 1) {
		clear: left;
	}

	.row.auto-clear .col-md-2:nth-child(6n + 1) {
		clear: left;
	}

	.row.auto-clear .col-md-3:nth-child(4n + 1) {
		clear: left;
	}

	.row.auto-clear .col-md-4:nth-child(3n + 1) {
		clear: left;
	}

	.row.auto-clear .col-md-6:nth-child(2n + 1) {
		clear: left;
	}
}

@media (max-width: 990px) {
	.row.auto-clear .col-sm-1:nth-child(12n + 1) {
		clear: left;
	}

	.row.auto-clear .col-sm-2:nth-child(6n + 1) {
		clear: left;
	}

	.row.auto-clear .col-sm-3:nth-child(4n + 1) {
		clear: left;
	}

	.row.auto-clear .col-sm-4:nth-child(3n + 1) {
		clear: left;
	}

	.row.auto-clear .col-sm-6:nth-child(2n + 1) {
		clear: left;
	}
}
</style>
