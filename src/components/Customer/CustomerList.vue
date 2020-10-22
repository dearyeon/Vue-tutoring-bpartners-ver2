<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title">
                    <div class="pull-left col-lg-2">
                        <h2>고객사 관리</h2>
                    </div>
                    <form id="listform">
                        <div class="row">
                            <div class="col-sm-3">
                                <input type="text" placeholder="고객사 명" class="form-control" v-model="searchKey" v-on:keypress.enter="setSearch(searchKey)" >
                            </div>
                            <div class="col-sm-1">
                                <button class="btn btn-primary" v-on:click="setSearch(searchKey)">검색</button>
                            </div>
                            <div class="pull-right">
                                <a class="btn btn-success" @click="createCustomerPage"><i class="fa fa-plus"></i> 고객사 등록</a>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="row">
                    <div class="ibox content">
                        <div class="ibox-content">
                            <div class="row ibox-content">
                                <table class="table table-hover dataTable">
                                    <thead>
                                    <tr>
                                        <th style="width:20px"></th>
                                        <th class="pagesubmit sorting" field="order" value="company" @click="sortBy('company')">고객사 명</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="name" @click="sortBy('name')">담당자 이름</th>
                                        <th class="pagesubmit text-center" value="part">부서</th>
                                        <th class="pagesubmit text-center" value="tel">전화번호</th>
                                        <th class="pagesubmit text-center" value="email">이메일</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="sortBy('fr_dt')">등록일자</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="sortBy('to_dt')">수정일자</th>
                                        <th class="pagesubmit text-center">고객사수정</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="hover-pointer LESSON_INFO" v-for="(item, index) in items" :key="`Customer-${index}`">
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
                                            <td class="text-center"><button class="btn btn-edit" @click="editCustomerPage(item.idx)">수정</button></td>
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
        <AddCustomerModal v-if="showModal" @close="openModal" @update="updateItem"/>
    </div>
</template>

<script>
import api from '@/common/api'
import moment from 'moment'
import Pagination from '@/components/atom/Pagination'
import AddCustomerModal from '../Customer/AddCustomerModal'
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
        Pagination, AddCustomerModal
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
        sortBy (sortKey) {
            (this.sortKey === sortKey) ? this.items.reverse() : (this.items.sort(function (a, b) {
                return a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0
            }))
            this.sortKey = sortKey
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
			this.$router.push({ name: 'customerNew' })
		},
        editCustomerPage(idx) {
			this.$router.push({
				name: 'customerEdit',
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