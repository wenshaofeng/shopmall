import ToastComponet from './vue-toast.vue'

let Toast = {}
Toast.install = function () {
    Vue.prototype.$toast = function () {
        const ToastController =  Vue.extend(ToastComponet)

        new Toast
    }
}

export default Toast;