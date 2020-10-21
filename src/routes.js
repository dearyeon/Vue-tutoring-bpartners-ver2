import CustomerList from "@/components/Customer/CustomerList";
import LessonList from "@/components/Lesson/LessonList";
import LessonDetailsList from "@/components/Lesson/LessonDetailsList";
import UserList from "@/components/User/UserList";
import UserDetailsList from "@/components/User/UserDetailsList";
import ApplyList from "@/components/Apply/ApplyList";
import ApplyDetailsList from "@/components/Apply/ApplyDetailsList";
import BillingList from "@/components/Billing/BillingList";
import BillingDetailsList from "@/components/Billing/BillingDetailsList";
import RegisterList from "@/components/Register/RegisterList";
import CreatePage from "@/components/Register/CreatePage";
import ApplyForm from "@/components/Register/ApplyForm";
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
      { path: '/customer/List', component: CustomerList },
      { path: '/lesson/List', component: LessonList },
      { path: '/lesson/DetailsList/:id/:c_no', name: "lessonDetailsList", component: LessonDetailsList, props: true },
      { path: '/user/List', component: UserList },
      { path: '/user/DetailsList/:id/:c_no', name: "userDetailsList", component: UserDetailsList, props: true },
      { path: '/apply/List', component: ApplyList },
      { path: '/apply/DetailsList/:sIdx/:aNo', name: 'applyDetailsList', component: ApplyDetailsList, props: true },
      { path: "/billing/List", component: BillingList },
      { path: "/billing/DetailsList/:sIdx/:aNo/:bNo", name: "billingDetailsList", component: BillingDetailsList, props: true },
      { path: "/register/List", component: RegisterList },
      { path: "/register/createPage", component: CreatePage },
      { path: "/register/ApplyForm/:idx", name: "applyForm", component: ApplyForm, props:true },
    ],
  },
];

export default routes;
