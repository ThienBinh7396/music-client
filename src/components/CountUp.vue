<template>
<span>
    <ICountUp :delay="delay" :endVal="endVal" :options="options" @ready="onReady" />
</span>
</template>

<script>
/* eslint-disable */

export default {
    components: {
      ICountUp: () => import('vue-countup-v2')
    },
    props: {
        delay: {
            type: Number,
            required: false,
            default: 1000
        },
        endVal: {
            type: Number,
            required: true
        },

        options: {
            type: Object / Array,
            required: false,
            default: function () {
                return {
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    decimal: '.',
                    prefix: '',
                    suffix: ''
                }
            }
        },
    },
    data() {
        return {
            instance: null
        }
    },
   
    methods: {
        onReady: function (instance, CountUp) {
            this.instance = instance;
        }
    }
}
</script>
