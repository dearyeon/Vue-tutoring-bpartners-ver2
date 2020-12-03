<template>
	<div id="wrapper">
		<input type="text" name="prevent_autofill_id" id="prevent_autofill_id" value="" style="display:none;" />
		<input type="password" name="prevent_autofill_pw" id="prevent_autofill_pw" value="" style="display:none;" />

		<Menu class="menu" :menuToggle="menuToggle"></Menu>
		<div :id="menuToggle?'page-wrapper':'container'" class="gray-bg animated">
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

import Menu from "@/Menu.vue";

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

.modal {
	background-color: rgba(0, 0, 0, 0.5);
	overflow-y: auto;
	z-index: 1;
}

.swal2-popup {
	font-size: 13px !important;
}
.swal2-content {
	font-size: 18px !important;
}
</style>
