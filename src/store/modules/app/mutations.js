import {set, toggle } from '@/utils/vuex'
import Swal from 'sweetalert2';

export default {
    showDialogProcess: set('dialogProcess'),
    setPressToast: set('pressToast'),
    showToast: (state, config) => {

        state.pressToast = true;

        state.configToast = config;

    },
    setAxiosInstance: set('axiosInstance'),
    setAlert: (state, alert) => {
        Swal.fire(alert);
    },
    setToken: set('token'),
    setUser: set('user'),
    setAdminToken: set('adminToken'),
    setSocket: (state, socket) => {
        if (state.socket) state.socket.close();
        state.socket = null;
        state.socket = socket.io;

        socket.io.emit('init', socket.init);

    },
    setDetectMobile: set('detectMobile'),
    setColor: set('color'),
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setRightDrawer: set('rightDrawer'),
    toggleRightDrawer: toggle('rightDrawer'),
    setResponsive: (state, width) => {
        // 1: xs
        // 2: sm
        // 3: md
        // 4: lg
        // 5: xl

        let rs = 'lg';

        switch (true) {
            case (width < 576):
                rs = 1;
                break;

            case (width >= 576 && width < 768):
                rs = 2;
                break;

            case (width >= 768 && width < 992):
                rs = 3;
                break;

            case (width >= 992 && width < 1200):
                rs = 4;
                break;

            case (width >= 1200):
                rs = 5;

        }

        state.responsive = rs;


    },
    setShowMusicBar: set('showMusicBar'),
    setPlayListCategories: set('playListCategories')
}