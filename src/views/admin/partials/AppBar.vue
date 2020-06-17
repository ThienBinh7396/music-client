<template>
<v-app-bar id="core-app-bar" absolute color="transparent" app height="58" dark  style="color:#fff"  elevate-on-scroll scroll-target="#scrolling-techniques-7">

  <v-app-bar-nav-icon v-if="responsive <= 3" dark icon @click.stop="onClick"></v-app-bar-nav-icon>

  <v-toolbar-title class="text-capitalize"> {{ title }}</v-toolbar-title>

  <v-spacer />

  <div class="flex-grow-1"></div>

  <v-toolbar-items style="margin-top: -6px">
    <v-row align="center" class="mx-0">

      <v-btn icon class="btn-small" @click="logout">
        <v-icon color="blurColor" size="20">
          mdi-arrow-right-bold-box-outline
        </v-icon>
      </v-btn>
    </v-row>
  </v-toolbar-items>
</v-app-bar>
</template>

<script>
/* eslint-disable */
import {
  mapMutations,
  mapState
} from 'vuex'

export default {

  data: () => ({
    notifications: [

    ],
    title: "Dashboard",
  }),

  watch: {
    '$route'(val) {

      this.title = val.path.split('/')[2]
    }
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClick() {
      console.log(this.setDrawer)

      this.setDrawer(!this.$store.state.app.drawer)
    },
     logout: function () {
            localStorage.removeItem('_atk');
            localStorage.removeItem('_a');

            location.reload();
        },
  },
  computed: {
    ...mapState('app', ['responsive'])
  },
  created(){
    this.title = this.$route.path.split('/')[2]
  }
}
</script>

<style>
/* Fix coming in v2.0.8 */
#core-app-bar {
  width: auto;
}

#core-app-bar a {
  text-decoration: none;
}
</style>
