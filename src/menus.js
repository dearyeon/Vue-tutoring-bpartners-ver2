import shared from "@/common/shared.js";

const menus = [
	{name: '수업 현황', path: '/report/list', accLevel: 'S|P', icon: 'bar-chart-o'},
	{name: '신청 현황', path: '/apply/list', accLevel: 'S|P', icon: 'calendar-o'},
	{name: '입과 관리', path: '/issue/list', accLevel: '', icon: 'calendar-check-o'},
	{name: '정기 결제 관리', path: '/billing/list', accLevel: '', icon: 'credit-card'},
	{name: '추가 결제 관리', path: '/billingP/list', accLevel: '', icon: 'credit-card-alt'},
	{name: '차수 현황', path: '/batch/list', accLevel: 'P', icon: 'list'},
	{name: '사이트 현황', path: '/site/list', accLevel: 'P', icon: 'handshake-o'},
	{name: '계정 관리', path: '/account/list', accLevel: '', icon: 'users'},
	{name: '본인정보 수정', path: '/me/form', accLevel: 'S|P', icon: 'user-o'},
]

export default menus;
