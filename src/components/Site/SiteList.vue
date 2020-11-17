<template>
    <div>
        <Header title="고객사 관리"
                search-placeholder="고객사 명" @search="setSearch"
                btn1-text="고객사 등록" @btn1click="createCustomerPage" btn1-variant="success" :btn1-loading="false">
        </Header>
        <div class="col-lg-12">
            <div class="ibox float-e-margins">

                <div class="row">
                    <div class="ibox content">
                        <div class="ibox-content">
                            <div class="row ibox-content">
                                <table class="table table-hover dataTable">
                                    <thead>
                                    <tr>
                                        <th style="width:20px"></th>
                                        <th class="pagesubmit sorting" field="order" value="company" @click="$shared.sortBy(items, 'company')">고객사 명</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="name" @click="$shared.sortBy(items, 'name')">담당자 이름</th>
                                        <th class="pagesubmit text-center" value="part">부서</th>
                                        <th class="pagesubmit text-center" value="tel">전화번호</th>
                                        <th class="pagesubmit text-center" value="email">이메일</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="$shared.sortBy(items, 'reg_dt')">등록일자</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="$shared.sortBy(items, 'upd_dt')">수정일자</th>
                                        <th class="pagesubmit text-center">고객사수정</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="hover-pointer LESSON_INFO" v-for="(item, index) in items" :key="`Customer-${index}`" @click="editCustomerPage(item.idx)">
                                            <td>
                                                <img alt="image" class="img-rounded" :src="$shared.getSiteImgThumbnailUrl(item.ci_img)" style="width:20px;height:20px;">
                                            </td>
                                            <td>{{ item.company }}</td>
                                            <td class="text-center">{{ item.name }}</td>
                                            <td class="text-center">{{ item.part }}</td>
                                            <td class="text-center">{{ item.tel }}</td>
                                            <td class="text-center">{{ item.email }}</td>
                                            <td class="text-center">{{ item.reg_dt?moment(item.reg_dt).format('YYYY-MM-DD'):'' }}</td>
                                            <td class="text-center">{{ item.upd_dt?moment(item.upd_dt).format('YYYY-MM-DD'):'' }}</td>
                                            <td class="text-center"><button class="btn btn-edit">수정</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="row">
                        <div class="text-center">
                            <Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)" @returnPage="setCurrentPage" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddSiteModal v-if="showModal" @close="openModal" @update="updateItem"/>
    </div>
</template>

<script>
import api from '@/common/api'
import moment from 'moment'
import Pagination from '@/components/atom/Pagination'
import AddSiteModal from '../Site/AddSiteModal'
import BatchSelection from "@/components/Common/BatchSelection"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"
export default {
    data() {
        return {
            items: [],
            sortKey: '',
            searchKey: '',
            current_page: 1,
            total_page: 1,
            per_page: '',
            showModal: false,
            moment: moment
        };
    },
    components: {
		Header,
		Content,
		CusIdField,
		BatchSelection,
        Table,
        ItemButton,
        Pagination,
        AddSiteModal
    },
    async created() {
        const res = await api.get('/partners/siteList')
        this.current_page = res.data.current_page
        this.total_page = res.data.last_page
        this.per_page = res.data.per_page
        this.items = res.data.data
    },
    methods: {
        routeDetailPage (idx, c_no) {
            this.$router.push({
                name: '',
                params: { }
            })
        },
        async setSearch(input) {
            const res = await api.get('/partners/siteList', { sk:input })
            this.current_page = res.data.current_page
            this.total_page = res.data.last_page
            this.per_page = res.data.per_page
            this.items = res.data.data
        },
        async setCurrentPage(data) {
            this.current_page = data
            const res = await api.get('/partners/siteList?page=' + this.current_page)
            this.current_page = res.data.current_page
            this.items = res.data.data
        },
        createCustomerPage() {
			this.$router.push({ name: 'siteNew' })
		},
        editCustomerPage(idx) {
			this.$router.push({
				name: 'siteEdit',
				params: { idx:idx }
			})
		},
        openModal() {
          this.showModal = !this.showModal;
        },
        updateItem(item) {
          ////
        }
    }
}
</script>

<style scoped>
.btn-edit {
	color: #1e9ed3;
	background-color: #fff;
	border: 1px solid #1e9ed3;
	border-radius: 0px;
}
</style>