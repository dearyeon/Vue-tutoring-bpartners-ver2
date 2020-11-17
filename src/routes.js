import ApplyList from "@/components/Apply/ApplyList";
import ApplyForm from "@/components/Batch/ApplyForm";
import BatchForm from "@/components/Batch/BatchForm";
import SiteList from "@/components/Site/SiteList";
import SiteForm from "@/components/Site/SiteForm";
import Main from "@/components/Main";
import Login from "@/components/Login";
import ReportList from "@/components/Report/ReportList";
import BatchList from "@/components/Batch/BatchList";
import BillingList from "@/components/Billing/BillingList";
import AddBillingList from "@/components/AddBilling/AddBillingList";
import IssueList from "@/components/Issue/IssueList";

const routes = [
	{path: "", redirect: "/login"},
	{path: "/login", component: Login},
	{
		path: "/main",
		component: Main,
		children: [
			{path: "/", redirect: "/report/list"},
			{path: '/report/list', component: ReportList},
			{path: '/apply/list', component: ApplyList},
			{path: '/issue/list', component: IssueList},
			{path: '/billing/list', component: BillingList},
			{path: '/addBilling/list', component: AddBillingList},
			{path: "/batch/list", component: BatchList},
			{path: "/batch/applyNew/:bIdx", name: "applyNew", component: ApplyForm, props: true},
			{path: "/batch/applyEdit/:baIdx", name: "applyEdit", component: ApplyForm, props: true},
			{path: "/batch/batchNew/:bsIdx/:company", name: "batchNew", component: BatchForm, props: true},
			{path: "/batch/batchEdit/:bIdx", name: "batchEdit", component: BatchForm, props: true},
			{path: '/site/list', name: "siteList", component: SiteList},
			{path: "/site/siteNew", name: "siteNew", component: SiteForm, props: true},
			{path: "/site/siteEdit/:idx", name: "siteEdit", component: SiteForm, props: true},
		],
	},
];

export default routes;
