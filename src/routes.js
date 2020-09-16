import LessonList from "./components/LessonList";
import LessonDetailsList from "./components/LessonDetailsList";
import ApplyList from "./components/ApplyList";
import ApplyDetailsList from "./components/ApplyDetailsList";
import BillingList from "@/components/BillingList";
import BillingDetailsList from "@/components/BillingDetailsList";
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
      { path: '/applyList', component: ApplyList },
      { name: "applydetailslist", path: '/applydetailslist/:id', component: ApplyDetailsList, props: true },
      { path: "/billingList", component: BillingList },
      { name: "billingDetailsList", path: "/billingDetailsList/:id", component: BillingDetailsList, props: true },
    ],
  },
];

export default routes;
