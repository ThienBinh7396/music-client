<template>
<div>
    <v-snackbar v-model="toast" :timeout="time">
        <div class="d-flex align-center">
            <div class="block ml-3">
                <v-icon :color="getIcon().color" size="24">{{ getIcon().icon }}</v-icon>
            </div>
            <span class="block ml-2 fs-15">

                {{ configToast.text }}
            </span>
        </div>
        <v-hover v-slot:default="{ hover }">

            <v-icon @click="close" :color="`${hover ? '#999' : '#aaa' }`" class="ml-4">mdi-close</v-icon>
        </v-hover>
    </v-snackbar>
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex'

export default {
    name: 'Toast',
    data() {
        return {
            time: 5000,
            timeoutIn: null,
            timeoutOut: null,
            animate: 'bounceInUp',
            toast: false
        }
    },
    computed: {
        ...mapState('app', ['configToast', 'pressToast']),

    },
    watch: {
        pressToast: function (val) {
                this.show();
        },

    },
    methods: {
      ...mapMutations('app', ['setPressToast']),
        close: function () {
          this.toast = false;
        },
        show: function () {
          this.toast = true;
                this.setPressToast(false);
        },
        getIcon() {
            switch (this.configToast.type) {
                case 'success':
                    return {
                        icon: 'mdi-check',
                            color: '#26d05b'
                    }
                    case 'warning':
                        return {
                            icon: 'mdi-message-alert-outline',
                                color: '#F89406'
                        }
                    case 'info':
                        return {
                            icon: 'mdi-information',
                                color: '#0091EA'
                        }

                        case 'error':
                            return {
                                icon: 'mdi-shield-alert',
                                    color: '#ef190e'
                            }

            }
        }
    }
}
</script>

<style >

</style>
