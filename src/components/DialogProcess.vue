<template>
<v-dialog v-model="dialogProcess" persistent width="300" content-class="z1111">
    <v-card color="success" dark class="pt-2 ">
        <v-card-text>
            Submiting....
            <v-progress-linear indeterminate color="white" class="mb-0 mt-1"></v-progress-linear>
        </v-card-text>
    </v-card>
</v-dialog>
</template>

<script>
/* eslint-disable */

import {
    mapState,
    mapMutations
} from 'vuex'
export default {
    name: 'DialogProcess',
    data() {
        return {

        }
    },
    computed: {
        ...mapState('app', ['dialogProcess'])
    },
    watch: {
        dialogProcess: function (val) {
            console.log(val);
            setTimeout(function () {

                document.querySelector(".z1111") && document.querySelector(".z1111").parentElement.classList.add("z1111");
            }, 100)
        }
    },
    methods: {
        ...mapMutations('app', ['showDialogProcess'])
    },
   

}
</script>
