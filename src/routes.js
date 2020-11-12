import LessonList from "@/components/Lesson/LessonList";
import LessonDetailsList from "@/components/Lesson/LessonDetailsList";
import UserList from "@/components/User/UserList";
import UserDetailsList from "@/components/User/UserDetailsList";
import ApplyList from "@/components/Apply/ApplyList";
import ApplyDetailsList from "@/components/Apply/ApplyDetailsList";
import BillingList from "@/components/Billing/BillingList";
import BillingDetailsList from "@/components/Billing/BillingDetailsList";
import RegisterList from "@/components/Batch/BatchList";
import CreatePage from "@/components/Batch/CreatePage";
import ApplyForm from "@/components/Batch/ApplyForm";
import BatchForm from "@/components/Batch/BatchForm";
import CustomerList from "@/components/Customer/CustomerList";
import CustomerForm from "@/components/Customer/CustomerForm";
import Main from "@/components/Main";
import Login from "@/components/Login";

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
      { path: '/apply/DetailsList/:bbIdx', name: 'applyDetailsList', component: ApplyDetailsList, props: true },
      { path: "/billing/List", component: BillingList },
      { path: "/billing/DetailsList/:bbIdx", name: "billingDetailsList", component: BillingDetailsList, props: true },
      { path: "/register/List", name: "registerList", component: RegisterList },
      { path: "/register/createPage", component: CreatePage },
	    { path: "/register/applyNew/:bIdx", name: "applyNew", component: ApplyForm, props:true },
	    { path: "/register/applyEdit/:baIdx", name: "applyEdit", component: ApplyForm, props:true },
      { path: "/register/batchNew/:bsIdx/:company", name: "batchNew", component: BatchForm, props:true },
      { path: "/register/batchEdit/:bIdx", name: "batchEdit", component: BatchForm, props:true },
      { path: '/customer/List', name: "customerList", component: CustomerList },
      { path: "/customer/customerNew", name: "customerNew", component: CustomerForm, props:true },
      { path: "/customer/customerEdit/:idx", name: "customerEdit", component: CustomerForm, props:true },
    ],
  },
];

export default routes;
