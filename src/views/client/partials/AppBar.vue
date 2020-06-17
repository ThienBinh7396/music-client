<template>
<v-app-bar id="core-app-bar"  v-if="responsive <= 3" absolute  color="transparent" app height="58" dark prominent style="color:#fff"  elevation="0"
      scroll-target="#scrolling-techniques-7">

  <v-app-bar-nav-icon v-if="responsive <= 3" dark icon @click.stop="onClick"></v-app-bar-nav-icon>

  <v-toolbar-title> {{ title }}</v-toolbar-title>

  <v-spacer />

  <div class="flex-grow-1"></div>

  <!-- <v-btn icon>
    <v-icon>mdi-magnify</v-icon>
  </v-btn>

  <v-btn icon>
    <v-icon>mdi-heart</v-icon>
  </v-btn>

  <v-btn icon>
    <v-icon>mdi-dots-vertical</v-icon>
  </v-btn> -->
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
    title: "Home",
  }),

  watch: {
    '$route'(val) {

      this.title = val.name
    }
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClick() {
      console.log(this.setDrawer)

      this.setDrawer(!this.$store.state.app.drawer)
    }
  },
  computed: {
    ...mapState('app', ['responsive'])
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
