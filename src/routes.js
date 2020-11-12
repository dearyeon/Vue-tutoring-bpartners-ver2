import LessonList from "@/components/Lesson/LessonList";
import LessonDetailsList from "@/components/Lesson/LessonDetailsList";
import UserList from "@/components/User/UserList";
import UserDetailsList from "@/components/User/UserDetailsList";
import ApplyList from "@/components/Apply/ApplyList";
import ApplyDetailsList from "@/components/Apply/ApplyDetailsList";
import BillingList from "@/components/Billing/BillingList";
import BillingDetailsList from "@/components/Billing/BillingDetailsList";
import CreatePage from "@/components/Register/CreatePage";
import ApplyForm from "@/components/Register/ApplyForm";
import BatchForm from "@/components/Register/BatchForm";
import CustomerList from "@/components/Customer/CustomerList";
import CustomerForm from "@/components/Customer/CustomerForm";
import Main from "@/components/Main";
import Login from "@/components/Login";
import BatchList from "@/components/Batch/BatchList";

const routes = [
  { path: "", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/main",
    component: Main,
    children: [
      { path: "/", redirect: "/lesson/List" },
      { path: '/lesson/List', component: LessonList },
      { path: '/lesson/DetailsList/:bbIdx', name: "lessonDetailsList", component: LessonDetailsList, props: true },
      { path: '/user/List', component: UserList },
      { path: '/user/DetailsList/:id/:c_no', name: "userDetailsList", component: UserDetailsList, props: true },
      { path: '/apply/List', component: ApplyList },
      { path: '/apply/DetailsList/:sIdx/:bbIdx', name: 'applyDetailsList', component: ApplyDetailsList, props: true },
      { path: '/issue/List', component: ApplyList },
      { path: '/issue/DetailsList/:sIdx/:bbIdx', name: 'applyDetailsList', component: ApplyDetailsList, props: true },
      { path: "/billing/List", component: BillingList },
      { path: "/billing/DetailsList/:sIdx/:bbIdx", name: "billingDetailsList", component: BillingDetailsList, props: true },
      { path: "/batch/List", name: "batchList", component: BatchList },
      { path: "/batch/createPage", component: CreatePage },
	    { path: "/batch/applyNew/:bIdx", name: "applyNew", component: ApplyForm, props:true },
	    { path: "/batch/applyEdit/:baIdx", name: "applyEdit", component: ApplyForm, props:true },
      { path: "/batch/batchNew/:bsIdx/:company", name: "batchNew", component: BatchForm, props:true },
      { path: "/batch/batchEdit/:bIdx", name: "batchEdit", component: BatchForm, props:true },
      { path: '/customer/List', name: "customerList", component: CustomerList },
      { path: "/customer/customerNew", name: "customerNew", component: CustomerForm, props:true },
      { path: "/customer/customerEdit/:idx", name: "customerEdit", component: CustomerForm, props:true },
    ],
  },
];

export default routes;
