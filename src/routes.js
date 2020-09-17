import LessonList from "./components/LessonList";
import LessonDetailsList from "./components/LessonDetailsList";
import UserList from "./components/UserList";
import UserDetailsList from "./components/UserDetailsList";
import ApplyList from "./components/Apply/ApplyList";
import ApplyDetailsList from "./components/Apply/ApplyDetailsList";
import BillingList from "@/components/Billing/BillingList";
import BillingDetailsList from "@/components/Billing/BillingDetailsList";
import RegisterList from "@/components/Register/RegisterList";
import CreatePage from "@/components/Register/CreatePage";
import SetRegisterForm from "@/components/Register/SetRegisterForm";
import Main from "@/components/Main";
import Login from "@/components/Login";

const routes = [
  { path: "", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/main",
    component: Main,
    children: [
      { path: "/", redirect: "/lessonList" },
      { path: '/lessonList', component: LessonList },
      { name: "lessonDetailsList", path: '/lessonDetailsList/:id/:c_no', component: LessonDetailsList, props: true },
      { path: '/userList', component: UserList },
      { name: "userDetailsList", path: '/userDetailsList/:id/:c_no', component: UserDetailsList, props: true },
      { path: '/applyList', component: ApplyList },
      { name: 'applyDetailsList', path: '/applyDetailsList/:sIdx/:aNo', component: ApplyDetailsList, props: true },
      { path: "/billingList", component: BillingList },
      {
        name: "billingDetailsList",
        path: "/billingDetailsList/:sIdx/:aNo",
        component: BillingDetailsList,
        props: true,
      },
      { path: "/registerList", component: RegisterList },
      { path: "/createPage", component: CreatePage },
      { path: "/setRegisterForm", component: SetRegisterForm },
    ],
  },
];

export default routes;
