<template>
<div @mousedown="enter" @touchstart="enter" @mouseup="leave" @touchend="leave">
  <div v-if="$slots.header">
    <slot name="header"></slot>
  </div>
  <v-alert v-if="msg != ''" dark border="top" icon="mdi-home" transition="scale-transition">{{msg}}</v-alert>
  <slot></slot>
</div>
</template>

<script>
/* eslint-disable */

export default {
  name: "LongClick",
  props: {
    longPress: {
      type: Function ,
      default: () => {}
    },
    shortPress: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      countTime: null,
      msg: ''

    }
  },
  methods: {
    enter: function (e) {
      console.log(e);
      this.countTime = Date.now()
    },

    leave: function (e) {
      console.log(e);
      var diff = Date.now() - this.countTime;

      this.msg = diff > 250 ? 'Long press' : 'Short press';

      diff > 250 ? this.longPress() : this.shortPress();
      console.log("Diff: " + diff);


    }
  }
}
</script>

<style>

</style>
