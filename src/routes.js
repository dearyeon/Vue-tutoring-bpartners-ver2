import ApplyList from "./components/ApplyList";
import BillingList from "@/components/BillingList";

const routes = [
    { path: '', redirect: '/applyList' },
    { path: '/applyList', component: ApplyList },
    { path: '/billingList', component: BillingList },
];

export default routes;
