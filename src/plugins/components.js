import Vue from 'vue'

Vue.component('AreaChart', () =>
    import ('@/components/Chart/AreaChart'))

Vue.component('BarChart', () =>
    import ('@/components/Chart/BarChart'))

Vue.component('HelperOffset', () =>
    import ('@/components/Offset'))

Vue.component('MaterialCard', () =>
    import ('@/components/Card'))

Vue.component('MaterialStatsCard', () =>
    import ('@/components/StatsCard'))

Vue.component('Toast', () =>
    import ('@/components/Toast'))

Vue.component('DialogProcess', () =>
    import ('@/components/DialogProcess'))

Vue.component('LoadingIcon', () =>
    import ('@/components/LoadingIcon'))

Vue.component('MusicPlayingIcon', () =>
    import ('@/components/MusicPlayingIcon'))

Vue.component('MusicQuaverIcon', () =>
    import ('@/components/MusicQuaverIcon'))

Vue.component('Emoji', () =>
    import ('@/components/Emoji'))

Vue.component('CountUp', () =>
    import ('@/components/CountUp'))