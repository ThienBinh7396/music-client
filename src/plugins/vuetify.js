import Vue from 'vue';
import Vuetify from 'vuetify/lib';



Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        options: {
            customProperties: true,
        },
        dark: true,
        themes: {
            dark: {
                lightColor: "#f4f4f4",
                blurColor: '#a0a0a0',
                lessBlurColor: '#828282',
                darkColor: '#cdcdcd',
                lessDarkColor: '#c7c7c7',
                secondaryColor: '#dbdbdb',
                activeColor: '#00b8ff',
                backgroundContainer: '#1D1B1B',
                backgroundColor: '#212121',

            },
            light: {
                lightColor: "#ff0",
                blurColor: '#a0a0a0',
                lessBlurColor: '#828282',
                secondaryColor: '#dbdbdb0d'

            },
        },
    }

});