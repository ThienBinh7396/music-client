<template>
<v-sheet id="scrolling-techniques-7" class="overflow-y-auto ui-view" color="backgroundContainer" min-height="100vh">
     <perfect-scrollbar id="main_content" class="max-view-height max-view-width" >
        <v-content class="min-full-view-height admin">
            <div class="main-content-container">

                <transition name="fade" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
                    <router-view />
                </transition>
            </div>
           
        </v-content>
    </perfect-scrollbar>
</v-sheet>
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    name: "CoreView",
    components: {},

    metaInfo() {
        return {
            title: "My Music"
        };
    },
    computed: {
        ...mapState("app", ["responsive"])
    },
    watch: {
        $route(val) {
            document.getElementById("main_content").scrollTop = 0;
        }
    },
    methods: {
        beforeLeave(element) {
            this.prevHeight = getComputedStyle(element).height;
        },
        enter(element) {
            const {
                height
            } = getComputedStyle(element);

            element.style.height = this.prevHeight;

            setTimeout(() => {
                element.style.height = '100vh';
            });
        },
        afterEnter(element) {
            element.style.height = "auto";
        }
    }
};
</script>

<style>
.main-content-container {
    min-height: calc(100% - 56px);
}
</style>
