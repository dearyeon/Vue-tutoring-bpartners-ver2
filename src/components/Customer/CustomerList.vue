<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title" style="height:65px">
                    <div class="pull-left">
                        <h2>고객사 관리</h2>
                    </div>
                    <div class="pull-right">
                        <a class="btn btn-success" @click="openModal"><i class="fa fa-plus"></i> 고객사 등록</a>
                    </div>
                </div>
                <div class="ibox-content m-b-sm border-bottom">
                    <form id="listform">
                        <div class="row">
                            <div class="col-sm-3">
                                <label class="control-label" for="customer_name">검색어</label>
                                <input type="text" placeholder="Search Word" class="form-control" v-model="searchKey" v-on:keypress.enter="setSearch(searchKey)" >
                            </div>
                            <div class="col-sm-1" style="margin-top:23px">
                                <button class="btn btn-primary" v-on:click="setSearch(search)">검색</button>
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
                                        <th class="pagesubmit sorting" field="order" value="company" @click="sortBy('company')">고객사명</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="max_c_no" @click="sortBy('c_no')">차수</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="sortBy('fr_dt')">시작날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="sortBy('to_dt')">종료날짜</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="hover-pointer LESSON_INFO" v-for="(item, index) in items" :key="`Customer-${index}`" v-show="showSearch(item)">
                                            <td><img alt="image" class="img-rounded" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_M" style="width:20px;height:20px;"></td>
                                            <td>{{ item.site.company }}</td><!--@click="routeDetailPage(item.idx,item.c_no)"-->
                                            <td class="text-center">
                                                <select> <!--@change="routeDetailPage(item.idx,item.c_no,$event)"-->
                                                    <option value="none" selected disabled hidden>{{item.c_no}}차</option>
                                                    <option v-for="i in item.c_no" :value="i" :key="i.id">{{item.c_no-i+1}}차</option>
                                                </select>
                                            </td>
                                            <td class="text-center">{{ moment(item.fr_dt).format('YYYY-MM-DD') }}</td>
                                            <td class="text-center">{{ moment(item.to_dt).format('YYYY-MM-DD') }}</td>
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
        const res = await api.get('/partners/lessonList')
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
        setSearch(input) {
            this.search = input;
        },
        showSearch(item) {
            return !item.site.company.indexOf(this.searchKey)
        },
        async setCurrentPage (data) {
            this.current_page = data
            const res = await api.get('/partners/lessonList?page=' + this.current_page)
            this.current_page = res.data.current_page
            this.items = res.data.data
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