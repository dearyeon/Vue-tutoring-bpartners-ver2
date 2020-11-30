const menus = [
    {name:'수업 현황', id:'lesson', path:'/report/list', accLevel:'S|P', icon:'bar-chart-o'},
    {name:'신청 관리', id:'apply', path:'/apply/list', accLevel:'S|P', icon:'calendar-o'},
    {name:'입과 관리', id:'issue', path:'/issue/list', accLevel:'', icon:'calendar-check-o'},
    {name:'정기 결제 관리', id:'billing', path:'/billing/list', accLevel:'', icon:'credit-card'},
    {name:'추가 결제 관리', id:'addbilling', path:'/addBilling/list', accLevel:'', icon:'credit-card-alt'},
    {name:'차수 관리', id:'batch', path:'/batch/list', accLevel:'P', icon:'list'},
    {name:'사이트 관리', id:'customer', path:'/site/list', accLevel:'P', icon:'handshake-o'},
]

export default menus;
