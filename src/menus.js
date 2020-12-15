import shared from "@/common/shared.js";

const menus = [
	{name: '수업 현황', path: '/report/list', accLevel: 'S|P', icon: 'bar-chart-o'},
	{name: shared.isSupervisor()?'신청 관리':'신청 현황', path: '/apply/list', accLevel: 'S|P', icon: 'calendar-o'},
	{name: '입과 관리', path: '/issue/list', accLevel: '', icon: 'calendar-check-o'},
	{name: '정기 결제 관리', path: '/billing/list', accLevel: '', icon: 'credit-card'},
	{name: '추가 결제 관리', path: '/billingP/list', accLevel: '', icon: 'credit-card-alt'},
	{name: shared.isSupervisor()?'차수 관리':'차수 현황', path: '/batch/list', accLevel: 'P', icon: 'list'},
	{name: shared.isSupervisor()?'사이트 관리':'사이트 현황', path: '/site/list', accLevel: 'P', icon: 'handshake-o'},
	{name: '본인정보 수정', path: '/account', accLevel: '', icon: 'handshake-o'},
]

export default menus;
