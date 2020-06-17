<template>
<transition name="fade">

    <v-navigation-drawer id="app-drawer" v-model="inputValue" src="https://res.cloudinary.com/do1xjyyru/image/upload/c_scale,q_40,w_362/v1569344996/public/sidebar-1_zrbx0c.jpg" app color="grey darken-2" dark floating mobile-break-point="991" persistent :width="responsive >= 2 ? 280 :  240" class="text-left">
        <template v-slot:img="attrs">

            <v-img v-bind="attrs" gradient="to top, rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)" />
        </template>

        <template v-slot:append>
            <v-list-item>
                <v-list-item-avatar>
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="stumbleupon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-stumbleupon fa-w-16 fa-3x">
                        <path fill="currentColor" d="M502.9 266v69.7c0 62.1-50.3 112.4-112.4 112.4-61.8 0-112.4-49.8-112.4-111.3v-70.2l34.3 16 51.1-15.2V338c0 14.7 12 26.5 26.7 26.5S417 352.7 417 338v-72h85.9zm-224.7-58.2l34.3 16 51.1-15.2V173c0-60.5-51.1-109-112.1-109-60.8 0-112.1 48.2-112.1 108.2v162.4c0 14.9-12 26.7-26.7 26.7S86 349.5 86 334.6V266H0v69.7C0 397.7 50.3 448 112.4 448c61.6 0 112.4-49.5 112.4-110.8V176.9c0-14.7 12-26.7 26.7-26.7s26.7 12 26.7 26.7v30.9z" class=""></path>
                    </svg>
                </v-list-item-avatar>

                <v-list-item-title class="title">
                    Admin
                </v-list-item-title>
            </v-list-item>
        </template>
        <v-divider class="mx-3 mb-3" />

        <perfect-scrollbar style="height: 100%;; overflow: hidden" >

            <v-list nav class="drawer-nav-cover px-2">

                <v-list-item class="drawer-nav " v-for="(link, i) in links" :key="i" :to="link.to" active-class="drawer-nav-active white--text">
                    <v-list-item-action>
                        <v-icon>{{ link.icon }}</v-icon>
                    </v-list-item-action>

                    <v-list-item-title v-text="link.text" />
                </v-list-item>
                <v-content width="100%" height="20px" padding="0" />
            </v-list>
        </perfect-scrollbar>

    </v-navigation-drawer>
</transition>
</template>

<script>
// Utilities
import {
    mapMutations,
    mapState
} from 'vuex'

export default {
    props: {
        opened: {
            type: Boolean,
            default: false
        }
    },
    components: {},
    data: () => ({
        links: [{
                to: '/admin/dashboard',
                icon: 'mdi-view-dashboard',
                text: 'Dashboard'
            },
            {
                to: '/admin/user',
                icon: 'mdi-account-circle',
                text: 'User'
            },
            {
                to: '/admin/singer',
                icon: 'mdi-microphone-variant',
                text: 'Singer'
            },
            {
                to: '/admin/genre',
                icon: 'mdi-library-music',
                text: 'Genre'
            },
            {
                to: '/admin/music',
                icon: 'mdi-music-note-outline',
                text: 'Music'
            },
            {
                to: '/admin/playlist',
                icon: 'mdi-playlist-music',
                text: 'Playlist'
            },
          

        ],

    }),

    computed: {
        ...mapState('app', ['color', 'responsive']),
        inputValue: {
            get() {
                return this.$store.state.app.drawer
            },
            set(val) {
                this.setDrawer(val)
            }
        }
    },

    methods: {
        ...mapMutations('app', ['setDrawer', 'toggleDrawer'])
    },
    mounted() {

    }
}
</script>

<style>
#app-drawer {
    flex-direction: column-reverse;
}

#app-drawer .v-navigation-drawer__content {
    overflow: hidden;
}

#app-drawer .vue-scrollbar__wrapper {
    background: none;

}

.drawer-nav-cover {
    padding: 0;
}

.drawer-nav {
    border-radius: 4px !important;
    border-left: 4px solid transparent;
    transition: 0.25s linear;
    padding: 0;
    color: red !important;
}

.drawer-nav .v-list-item__action {
    margin-right: 18px !important;
}

.drawer-nav i {
    font-size: 22px !important;
    color: #ffffffa6 !important;
    transition: 0.25s linear;
}

.drawer-nav .v-list-item__title {
    color: #ffffffa6 !important;
    font-size: 0.94rem;
}

.drawer-nav-content {
    color: rgba(255, 255, 255, .5) !important;

}

.drawer-nav:hover,
.drawer-nav-active {
    border-left-color: var(--v-activeColor-base);
    background: #2e3d50bf;
}

.drawer-nav:hover i,
.drawer-nav:hover .v-list-item__title,
.drawer-nav-active .v-list-item__title {
    color: #fdfdfd !important;
}

.drawer-nav-active i {
    color: var(--v-activeColor-base) !important;
    transition: 0.25s linear;
}
</style>

<style scoped>
</style>
