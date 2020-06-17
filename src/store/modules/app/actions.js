import Swal from 'sweetalert2';

export default {
    showAlert({ commit }, alert) {
        console.log(alert);
        return new Promise(res => {
            Swal.fire(alert).then(rs => {
                res(rs);
            })
        })
    }
}