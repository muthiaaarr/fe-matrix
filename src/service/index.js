import axios from "axios";
import config from "./config";
// import Swal from "sweetalert2";

const client = axios.create(config.api);

// const alert = {
//     showAlert(message) {
//         Swal.fire({
//             type: "error",
//             text: message,
//             animation: false,
//             allowOutsideClick: false,
//             customClass: {
//                 popup: "animated tada"
//             }
//         }).then(result => {
//             if (result.value) {
//                 window.location.reload();
//             }
//         });
//     }
// };


// Response interceptor
// client.interceptors.response.use(
//     response => response,
//     error => {
//         let err = error.toString();
//         if (err.includes("504")) {
//             alert.showAlert("Connection time out", "Reload");
//         } else if (err.includes("401")) {
//             alert.showAlert("Unauthorized", "Unauthorized");
//         } else if (err.includes("500")) {
//             alert.showAlert("Internal server error", "Reload");
//         } else if (err.includes("Network Error", "Reload")) {
//             alert.showAlert("Network Error");
//         }
//     }
// );

const MatrixService = {
    login(data) {
        return client.request(
            {
                method: "post",
                url: `${config.api.dev79}/login`,
                data
            },
            { crossdomain: true }
        )
    },
    readEmail(email) {
        return client.request(
            {
                method: "get",
                url: `${config.api.dev79}/user/readByEmail?email=${email}`,
            },
            { crossdomain: true }
        )
    },
    createCuti(data) {
        return client.request(
            {
                method: "post",
                url: `${config.api.dev79}/leave/save`,
                data
            },
            { crossdomain: true }
        )
    },
    updateCuti(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/updateIfStatusDraft`,
                data
            },
            { crossdomain: true }
        )
    },
    deleteCuti(id) {
        return client.request(
            {
                method: "delete",
                url: `${config.api.dev79}/leave/delete?formId=${id}`
            },
            { crossdomain: true }
        )
    },
    getCuti() {
        return client.request(
            {
                method: "get",
                url: `${config.api.dev79}/leave/readAll`
            },
            { crossdomain: true }
        )
    },
    getAllowance() {
        return client.request(
            {
                method: "get",
                url: `${config.api.dev79}/allowance/readAll`
            },
            { crossdomain: true }
        )
    },
    getLovSubstitute() {
        return client.request(
            {
                method: "get",
                url: `${config.api.dev79}/user/readAll`
            },
            { crossdomain: true }
        )
    },
    getCutiUser() {
        return client.request(
            {
                method: "get",
                url: `${config.api.dev79}/leave/readAll`
            },
            { crossdomain: true }
        )
    },
    sendLeaveRequest(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/updateToOpen`,
                data
            },
            { crossdomain: true }
        )
    },
    cancelLeaveRequest(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/updateToCanceled`,
                data
            },
            { crossdomain: true }
        )
    },
    getJatahCutiUser() {
        return client.request(
            {
                method: "get",
                url: `${config.api.dev79}/allowance/readAll`
            },
            { crossdomain: true }
        )
    },
    approvedByHRD(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/updateApproved`,
                data
            },
            { crossdomain: true }
        )
    },
    rejectedByHRD(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/updateToRejectByHRD`,
                data
            },
            { crossdomain: true }
        )
    },
    approvedBySpv(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/updateToInprogress`,
                data
            },
            { crossdomain: true }
        )
    },
    rejectedBySpv(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/UpdateRejectBySPV`,
                data
            },
            { crossdomain: true }
        )
    },
    sendFCM(body) {
        return client.request(
            {
                method: "post",
                url: `${config.api.fcm}/fcm/send`,
                data: body,
                headers: {
                    "Authorization": 'key=AAAAwTo3EiQ:APA91bE43hrkkAvCh_U4v1MI6sPg5EmLpAJHkM4EPH2Iqpd4umb9PRyJ7PoGMXL2mr28qcBicOyFj59K-xoKNbCFmole8p_1me9eTcS5lnfDoY26nhpnqS3-ugrgpbOHQlROyFlJ1udu'
                }
            },
            { crossdomain: true }
        )
    },
    saveToken(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/user/updateToken`,
                data
            },
            { crossdomain: true }
        )
    },
    readNotif(data) {
        return client.request(
            {
                method: "put",
                url: `${config.api.dev79}/leave/updateLeaveIsRead`,
                data
            },
            { crossdomain: true }
        )
    }
};

export { MatrixService };


