import swal from "sweetalert2";

const modal = {
	confirm(name, email, cusId, taskName, taskFunc, afterOKFunc) {
		swal.fire({
			icon: 'warning',
			html: `<strong>${name}(${email?email:cusId})</strong>님<br/>을 ${taskName} 하시겠습니까?`,
			showCancelButton: true,
			confirmButtonText: '확인',
			confirmButtonColor: '#ed5565',
			cancelButtonText: '닫기',
			cancelButtonColor: '#808080',
			reverseButtons: true,

		})
		.then(async result => {
			if (result.isConfirmed) {
				const res = await taskFunc()
				if (res.result === 2000) {
					swal.fire({
						text: `${taskName} 완료되었습니다.`,
						icon: 'success',
						confirmButtonText: '확인',
						confirmButtonColor: '#ed5565',
					})
					afterOKFunc()
				} else {
					swal.fire({
						title: '에러',
						html: `<strong>${res.message}</strong>`,
						icon: 'error',
						confirmButtonText: '확인',
						confirmButtonColor: '#ed5565'
					})
				}
			}
		})
	},
	simple(title, text, icon) {
		return swal.fire({
			icon: icon,
			title: title,
			text: text,
			confirmButtonText: '확인',
			confirmButtonColor: '#ed5565'
		})
	}
}

export default modal;
