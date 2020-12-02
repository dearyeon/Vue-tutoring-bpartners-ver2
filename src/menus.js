import shared from "@/common/shared.js";

const menus = [
	{name: '수업 현황', id: 'lesson', path: '/report/list', accLevel: 'S|P', icon: 'bar-chart-o'},
	{name: shared.isSupervisor()?'신청 관리':'신청 현황', id: 'apply', path: '/apply/list', accLevel: 'S|P', icon: 'calendar-o'},
	{name: '입과 관리', id: 'issue', path: '/issue/list', accLevel: '', icon: 'calendar-check-o'},
	{name: '정기 결제 관리', id: 'billing', path: '/billing/list', accLevel: '', icon: 'credit-card'},
	{name: '추가 결제 관리', id: 'addbilling', path: '/addBilling/list', accLevel: '', icon: 'credit-card-alt'},
	{name: shared.isSupervisor()?'차수 관리':'차수 현황', id: 'batch', path: '/batch/list', accLevel: 'P', icon: 'list'},
	{name: shared.isSupervisor()?'사이트 관리':'사이트 현황', id: 'customer', path: '/site/list', accLevel: 'P', icon: 'handshake-o'},
	{name: '본인 정보 수정', id: 'user', path: '/user', accLevel: '', icon: 'handshake-o'},
]

export default menus;
