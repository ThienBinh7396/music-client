<template>
<v-sheet id="scrolling-techniques-7" class="overflow-y-auto  ui-view" color="backgroundContainer" min-height="100vh">
    <perfect-scrollbar id="main_content" class="max-view-height max-view-width" style="background:linear-gradient(rgba(41, 40, 40, 0.78), rgb(12, 12, 12) 40%) rgb(20, 49, 115);">

        <v-content class="min-full-view-height" :style="{'padding-bottom': showMusicBar ?  responsive > 2 ? '70px' : '124px' : '0'}">

            <transition name="fade" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">

                <router-view />

                

            </transition>
        </v-content>
    </perfect-scrollbar>

</v-sheet>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    name: 'CoreView',
    components: {},

    metaInfo() {
        return {
            title: 'My Music'
        }
    },
    computed: {
        ...mapState('app', ['showMusicBar', 'responsive'])
    },
    watch: {
        '$route'() {
            setTimeout(() => {
                document.getElementById('main_content').scrollTop = 0;
            }, 200)

        }
    },
    methods: {
        beforeLeave(element) {
            this.prevHeight = getComputedStyle(element).height;
        },
        enter(element) {
            element.style.height = this.prevHeight;

            setTimeout(() => {
                element.style.height = '100vh';
            });
        },
        afterEnter(element) {
            element.style.height = "auto";
        }
    }

}
</script>
