<template>
    <div>
        <Header title="고객사 관리"
                search-placeholder="고객사 명" @search="setSearch"
                btn1-text="고객사 등록" @btn1click="createCustomerPage" btn1-variant="success" :btn1-loading="false">
        </Header>

        <Content>
            <Table :headers="['','고객사 명','담당자 이름','부서','전화번호','이메일','등록일자','수정일자','고객사수정']"
                :data="items"
                    v-slot="{item}">
                <td><img alt="image" class="img-rounded" :src="$shared.getSiteImgThumbnailUrl(item.ci_img)" style="width:20px;height:20px;"></td>
                <td>{{ item.company }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.part }}</td>
                <td>{{ item.tel }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.reg_dt?moment(item.reg_dt).format('YYYY-MM-DD'):'' }}</td>
                <td>{{ item.upd_dt?moment(item.upd_dt).format('YYYY-MM-DD'):'' }}</td>
                <td><ItemButton text="수정" variant="edit" @click="editCustomerPage(item.idx)" /></td>
            </Table>
        </Content>
        
        <Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)" @returnPage="setCurrentPage" />
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