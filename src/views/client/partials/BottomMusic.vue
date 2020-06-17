<template>
<v-content class="bottom-music pt-0">
  <transition name="slide-fade-center">
    <v-card class="bottom-play-list relative " v-if="showPlayList && showMusicBar">
      <div class="bottom-play-list-background">
        <v-img :src="music.thumbnail" contain></v-img>
      </div>
      <div class="bottom-play-list-wrapper" />

      <!-- <div class="bottom-play-list-header px-4">
        <div class="d-flex flex-row-reverse">

          <v-icon color="white" @click="showPlayList = false">arrow_drop_down</v-icon>
        </div>
      </div> -->
      <v-row class="ma-0" style="height: 280px; overflow: hidden;">
        <v-col xs="12" col="7" class="d-flex flex-column view-height-max py-2">
          <div class="bottom-play-list-toolbar mb-2" @dragover.prevent @drop="drop(-1, $event)" @dragenter="dragEnterIntoRemove($event)" @dragleave="dragLeaveOutRemove($event)">
            <div class="bottom-play-list-toolbar-item px-4 d-flex align-center justify-space-between" v-show="!dragging" :style="{opacity: !dragging ? 1 : 0}">
              <div class="text---blurColor fs-13">
                Playlist ({{ playList.length }})
              </div>
              <v-btn v-if="detectMobile" depressed fab class="btn-control-music mr-1 text---blurColor relative " :class="{'text---activeColor': shortMobile}" @click="shortMobile = !shortMobile">
                <v-icon size="17">mdi-sort-variant-lock-open</v-icon>
              </v-btn>
            </div>
            <div class="bottom-play-list-toolbar-item px-4" v-show="dragging">
              <div class="fs-12 drop-music-place text-center d-flex justify-center" id="touch-trash-target-playlist" :class="{'text---activeColor': overTrash}">

                <v-icon class="mr-1 none-transition" :class="{'text---activeColor': overTrash}" size="14">mdi-delete-outline</v-icon>Remove
              </div>
            </div>
          </div>
          <perfect-scrollbar style="height: calc(100% - 48px);width: 100%;background: transparent; overflow: hidden">

            <v-menu absolute v-model="showMenu" :position-x="x" :position-y="y">

              <v-list>
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <div class="bottom-play-list-content">

              <v-list class="background-transparent pa-0 " flat>
                <transition-group name="flip-list" tag="div" class="pr-3">
                  <v-hover v-for="(item, index) in playList" :key="item.id + 'x'" v-slot:default="{hover}">
                    <v-list-item-group class="v-list-item-group-playlist" :id="'v-list-playlist-' + index" :class="{'playlist-active': item.id == music.id}" :style="{'background-color': index % 2 == 0 ? '#4747471a' : '#ffffff07', 'line-height': shortMobile ? '48px': 'normal'}">
                      <v-list-item class="touch-playlist-end-detect d-flex justify-space-between align-center" :class="{'flex-row-reverse': shortMobile, 'px-8': !detectMobile, 'px-6': detectMobile, 'pr-4': detectMobile && shortMobile}" :detect-index="index" @click.stop="selectPlaylist(item, index)" @dragover.prevent @drop="drop(index, $event)">
                        <v-list-item-icon class="d-block" :class="{'mr-1 mr-sm-3': !shortMobile, 'ma-0': shortMobile}">
                          <div class="fs-12" v-if="!shortMobile">{{index + 1}}</div>
                          <div class="fs-12" v-if="shortMobile" @touchstart="touchstart(index, $event)" @touchmove.prevent.stop="touchmove" @touchend="touchend(index, $event)">
                            <v-icon size="17" :style="{transform: music.id != item.id ? 'translateY(-2px)' : 'none'}">mdi-arrow-all</v-icon>
                          </div>
                        </v-list-item-icon>

                        <v-list-item-content :class="{'pr-8': hover}" style="transition: 0.2s ease" draggable="true" @drag="drag(index, $event)" @dragstart="dragstart(index, $event)" @dragend="dragend(index, $event)">
                          <v-list-item-title class="fs-12 text-left text---blurColor d-flex flex-nowrap align-center">
                            <music-playing-icon v-if="music.id == item.id" :equalDimen="false" width="22" class="mr-1" :class="{stop: !playing}" />
                            <div class="text-truncate">
                              <span class="text---lightColor">{{item.title}}</span> - <span> {{item.singers.map(it => it.name).toString()}}
                              </span>
                            </div>
                          </v-list-item-title>

                          <div class="view-hover" v-show="hover" v-if="!detectMobile">
                            <v-btn depressed fab class="btn-control-music mr-1 text---activeColor relative" @click.stop.prevent="showMenuPlaylist">
                              <v-icon size="19">mdi-dots-horizontal</v-icon>
                            </v-btn>

                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-hover>
                </transition-group>
              </v-list>

            </div>
          </perfect-scrollbar>
        </v-col>
        <v-col cols="5" xs="12" v-if="responsive >= 2">

          <v-img :src="music.thumbnail" aspect-ratio="1" class="rounded tb-music-thumbnail mx-auto mt-1" :class="`${playing ? 'play' : 'pause'}`" width="160px"></v-img>
          <div class="d-flex background-transparent mt-4 justify-center">
            <v-btn depressed fab class="btn-control-music mr-1 text---blurColor relative " @click.stop.prevent="showMenuPlaylist">
              <v-icon size="19" color="#ccc">mdi-download</v-icon>
            </v-btn>
            <v-btn depressed fab class="btn-control-music mr-1 text---blurColor relative" @click.stop.prevent="showMenuPlaylist">
              <v-icon size="19" color="red" class="ld ld-heartbeat">mdi-heart</v-icon>
            </v-btn>
            <v-btn depressed fab class="btn-control-music mr-1 text---blurColor relative" @click.stop.prevent="showMenuPlaylist">
              <v-icon size="19" class="fa-bounce">mdi-dots-horizontal</v-icon>
            </v-btn>
          </div>
          <v-card class="text-center fs-12 background-transparent mt-1" elevation="0">
            <span class="ma-0  text---blurColor text-truncate"><strong class="text---lightColor"><span class="tb-link" @click="toMusic(music.id)">{{music.title}}</span></strong> -

              <span class="tb-link" @click="toSinger(singerItem.id)" v-for="(singerItem, singerIndex) in music.singers.map(it => {return {id : it.id, name: it.name}})" :key="`singer-${singerIndex}`">
                {{singerItem.name}}<span v-if="singerIndex == 0">,</span>
              </span>

            </span>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </transition>
  <transition name="slide-fade">
    <v-card class="bottom-side bounce" color="#212121" v-show="showMusicBar">
      <v-progress-linear :active="loading" absolute indeterminate value="0%" color="#5dade0"></v-progress-linear>

      <audio ref="main_music" class="d-none" @play="play" @pause="musicPlaying(false)" @playing="musicPlaying(true)" @loadstart="loadstart" @loadeddata="loadeddata" @ended="ended()" @waiting="waiting" @canplaythrough="canplaythrough" @error="errorLoad" @timeupdate="timeUpdate">
      </audio>
      <v-row>
        <v-col lg="6" sm="5" cols="12" class="pa-2 pb-xs-1">
          <div class="d-flex mx-4 mr-sm-0">

            <v-img :src="music.thumbnail" aspect-ratio="1" :lazy-src="music_placeholder" class="grey lighten-2 flex-none mr-3" width="54" height="54">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular width="3" style="width: 24px;" indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <div class="pa-0 pt-1 ma-0 full-width relative" id="music-details">
              <div class="music-title d-flex px-1">
                <div class="m-title pa-0 ml-1 mr-3">
                  <div class="d-none" ref="container_css"></div>
                  <span class="cover" ref="music_title">

                    <span class="ma-0 mr-20 text---blurColor"><strong class="text---lightColor"><span class="tb-link" @click="toMusic(music.id)">{{music.title}}</span></strong> -
                      <span class="tb-link" @click="toSinger(singerItem.id)" v-for="(singerItem, singerIndex) in music.singers.map(it => {return {id : it.id, name: it.name}})" :key="`singer--${singerIndex}`">
                        {{singerItem.name}}<span v-if="singerIndex == 0">,</span>
                      </span>
                    </span>
                    <span class="copy ma-0 mr-20 text---blurColor"><strong class="text---lightColor"><span class="tb-link" @click="toMusic(music.id)">{{music.title}}</span></strong> -
                      <span class="tb-link" @click="toSinger(singerItem.id)" v-for="(singerItem, singerIndex) in music.singers.map(it => {return {id : it.id, name: it.name}})" :key="`singer--${singerIndex}`">
                        {{singerItem.name}}<span v-if="singerIndex == 0">,</span>
                      </span>
                    </span>
                    <span class="copy ma-0 text---blurColor"><strong class="text---lightColor"><span class="tb-link" @click="toMusic(music.id)">{{music.title}}</span></strong> -
                      <span class="tb-link" @click="toSinger(singerItem.id)" v-for="(singerItem, singerIndex) in music.singers.map(it => {return {id : it.id, name: it.name}})" :key="`singer--${singerIndex}`">
                        {{singerItem.name}}<span v-if="singerIndex == 0">,</span>
                      </span>
                    </span>
                  </span>
                </div>
                <p class="ma-0 m-count text---blurColor"><span class="text---lightColor">{{formatTime(music.lastTime)}}</span> / {{ formatTime(music.duration) }}</p>
              </div>
              <v-slider hide-details v-model="timeMusic" color="#379ddf" :max="max" :disabled="!loaded" @change="changeTimeMusic($event)"></v-slider>
            </div>
          </div>

        </v-col>
        <v-col lg="6" sm="7" cols="12" class="px-4 pl-sm-0 py-0 mt-2 pb-xs-2 d-flex control-music">
          <v-btn depressed fab class="btn-control-music mr-1 mr-sm-2" @click="toggleShuffe">
            <svg :style="{fill: settings.shuffe ? '#379ddf' : '#495471'}" enable-background="new 0 0 515.555 515.555" height="18" viewBox="0 0 515.555 515.555" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="m143.16 194.119 34.301 39.2 42.805-48.918-28.615-32.7c-30.602-34.991-74.797-55.036-121.243-55.036h-70.408v64.444h70.408c27.864.001 54.39 12.022 72.752 33.01z" />
              <path d="m418.89 354.444h-5.963c-27.864 0-54.391-12.02-72.752-33.009l-55.704-63.658 55.704-63.658c18.361-20.989 44.888-33.009 72.752-33.009h5.963v64.444l96.665-96.669-96.665-96.663v64.444h-5.963c-46.445 0-90.641 20.044-121.243 55.036l-148.525 169.733c-18.361 20.988-44.888 33.009-72.752 33.009h-70.407v64.444h70.408c46.445 0 90.641-20.045 121.243-55.036l50.017-57.16 50.017 57.16c30.602 34.991 74.797 55.036 121.243 55.036h5.963v64.444l96.665-96.665-96.666-96.667z" /></svg>
          </v-btn>
          <v-btn depressed fab class="btn-control-music mr-1 mr-sm-2" @click="toggleRepeat">
            <v-icon size="20" :color="settings.repeat.color">{{settings.repeat.icon}}</v-icon>
          </v-btn>
          <v-menu top v-if="responsive >= 2">
            <template v-slot:activator="{ on }">
              <v-btn depressed fab class="btn-control-music mr-1 mr-sm-2 text---activeColor" v-on="on">
                {{settings.speed}}
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="(item, i) in speeds" :key="i" @click="toggleSpeed(item)">
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-item-group class="mr-sm-2">
            <v-btn depressed fab class="btn-control-music " @click="previous">
              <img width="23" src="/img/btn-control-music.svg">
            </v-btn>
            <v-btn depressed fab class="btn-control-music btn-larger-control mx-3" @click="controlMusic(!playing)">
              <transition name="fade" mode="out-in">
                <v-icon v-if="playing && !loading" key="pause">mdi-pause</v-icon>
                <v-icon v-if="!playing && !loading" key="play">mdi-play</v-icon>

                <v-progress-circular size="20" width="2" v-if="loading" key="load" indeterminate color="white"></v-progress-circular>

              </transition>
            </v-btn>
            <v-btn depressed fab class="btn-control-music " @click="next(true)">
              <img width="23" src="/img/btn-control-music.svg" class="rotate-reserve">
            </v-btn>
          </v-item-group>

          <v-menu top>
            <v-list>
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <template v-slot:activator="{ on }">
              <v-btn depressed fab class="btn-control-music mr-1 text---activeColor" v-on="on">
                <v-icon size="19">mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

          </v-menu>
          <v-btn color="#653e3e14" class="ml-4 ml-xs-1 px-3 queue_music_btn" :class="{active: showPlayList, 'queue_music_btn_pluse':  !showPlayList}" style="font-size: 12px;" @click="showPlayList = playList.length == 0 ? false :  !showPlayList">
            <v-icon size="22">mdi-playlist-music-outline</v-icon>({{playList.length}})
          </v-btn>

        </v-col>
      </v-row>

    </v-card>
  </transition>

  <v-item-group fixed direction="top" class="center-fixed" :style="{right: !rightDrawer ? '16px': '316px'}">
    <v-item class="d-block my-2 mt-5" v-if="responsive <= 4">
      <v-btn fab dark class="btn-medium uavatar pulse-animation" @click="toggleRightDrawer" :style="{'background-image': `url('${user ? user.thumbnail: '/img/placeholder.png'}')`}" color="indigo">
        <v-img style="border-radius: 100%" :src="user ? user.thumbnail: '/img/placeholder.png'" width="34"></v-img>
      </v-btn>
    </v-item>
  </v-item-group>
</v-content>
</template>

<script>
/* eslint-disable */
import {
  mapMutations,
  mapState
} from "vuex";
import {
  clearTimeout
} from 'timers';

import VueScrollbar from "vue2-scrollbar";
require("vue2-scrollbar/dist/style/vue2-scrollbar.css");

export default {
  components: {
    VueScrollbar
  },
  data() {
    return {
      shortMobile: false,
      showMenu: false,
      x: 0,
      y: 0,
      showPlayList: false,
      loaded: false,
      music_placeholder: "/img/music-placeholder.png",
      loading: false,
      timeOutLoad: null,
      countLoadError: 0,
      loopAnim: null,
      items: [{
          title: 'Click Me'
        },
        {
          title: 'Click Me'
        },
        {
          title: 'Click Me'
        },
        {
          title: 'Click Me 2'
        },
      ],
      repeats: [{
          icon: 'mdi-repeat',
          color: '#495471',
          type: 1
        },
        {
          icon: 'mdi-repeat',
          color: '#379ddf',
          type: 2
        },
        {
          icon: 'mdi-repeat-once',
          color: '#379ddf',
          type: 3
        }
      ],
      speeds: ['0.5', '0.7', '1.0', '1.5', '2.0'],
      settings: {
        shuffe: false,
        repeat: {
          icon: 'mdi-repeat',
          color: '#495471',
          type: 1
        },
        speed: '1.0'

      },
      intervalRotateThumbnail: null,
      dragging: false,
      overTrash: false,
      indexDragStart: -1,
      startTouch: false,
      startTouchHtml: '',
      currentId: -1
    }
  },
  mounted() {

    this.setKeyframeCssScrollText()

    // var that = this;

    // this.loopAnim = function () {

    //   Velocity(that.$refs.music_title, {
    //     left: ["-100%", "100%"],
    //   }, {
    //     duration: 25000,
    //     sequenceQueue: false,
    //     easing: 'linear',
    //     complete: that.loopAnim
    //   })
    // }
    // this.loopAnim();

  },

  computed: {
    ...mapState('musics', ['music', 'playList', 'replay', 'user', 'playing']),
    ...mapState('app', ['axiosInstance', 'rightDrawer', 'responsive', 'detectMobile', 'showMusicBar']),
    max: function () {
      return this.music.duration ? this.music.duration <= 100 ? parseInt(this.music.duration) : 100 : 100;
    },
    timeMusic: {
      get: function () {
        var a = this.music.lastTime && this.music.duration ? parseInt(parseInt(this.music.lastTime / this.music.duration * 100) / 100 * (this.max)) : 0;
        return a;
      },
      set: function (newValue) {}
    }
  },
  watch: {
    replay: function (val) {

      if (val) {
        this.replayMusic();
      }
    },
    playing: function (val) {
      this.controlMusic(val);
    },
    music: function (val) {
      if (val.id != this.currentId) {
        console.log("update id: " + this.currentId + " " + val.id)
        this.currentId = val.id;

        this.playMusicAt(this.playList.findIndex(it => it.id == val.id));

        this.updateListenToMusic();
      }
    }

  },
  methods: {
    ...mapMutations('musics', ['setMusicByIndex', 'updateMusic', 'setPlayList', 'setPlaying', 'setReplay', 'removeMusicAt', 'swapMusicInPlayList']),
    ...mapMutations('app', ['toggleRightDrawer', 'showToast']),
    toMusic: function (id) {
      this.$router.push(`/music/${btoa(JSON.stringify({musicId: id}))}`);
    },
    updateListenToMusic: function () {
      this.axiosInstance.post('client/music/updateListenerToMusic', {
          id: this.music.id
        })
        .then(rs => {
          let {
            data
          } = rs;

          console.log(data);
        })
    },
    toSinger: function (id) {
      let data = {
        singerId: id
      };
      this.$router.push(`/singer/${btoa(JSON.stringify(data))}`);
    },
    touchstart: function (index, e) {
      console.log("Touch: " + index);
      this.indexDragStart = index;
      console.log(e.targetTouches);
      this.startTouchHtml = `<div class="${e.targetTouches[0].target.classList.toString()}">${e.targetTouches[0].target.innerHTML}</div>`
      let doc = document.createElement('div');
      doc.id = "cloneTouchEvent";
      doc.className = "fixed-auto d-flex flex-row-reverse";
      doc.innerHTML = document.getElementById('v-list-playlist-' + index).innerHTML;
      doc.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      doc.style.border = '1px dashed #0068ff7a';
      doc.style.width = document.getElementById('v-list-playlist-0').offsetWidth + 'px';
      document.body.appendChild(doc);

      console.log(e.targetTouches[0].target);
    },
    touchmove: function (e) {
      this.startTouch = true;
      this.dragging = true;

      let a = document.getElementById('cloneTouchEvent');

      if (e.targetTouches.length != 0) {
        a.style.top = e.targetTouches[0].pageY + 'px';
        a.style.left = e.targetTouches[0].pageX - 280 + 'px';
      }

      let element = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

      if (element) {

        if (element.id == "touch-trash-target-playlist") {

          this.overTrash = true;

          return;
        }
      }

      this.overTrash = false;
    },
    touchend: function (index, e) {
      this.startTouch = false;
      this.dragging = false;

      document.getElementById('cloneTouchEvent').remove();
      console.log(index, "TOuch end");

      let element = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

      if (element) {

        if (element.id == "touch-trash-target-playlist") {
          this.removeMusicAt(this.indexDragStart);

          return;
        }

        let check = false;
        let id = -1;

        if (this.detectClass(element.classList, 'touch-playlist-end-detect')) {
          check = true;
          id = element.getAttribute('detect-index');
        }
        if (this.detectClass(element.parentElement.classList, 'touch-playlist-end-detect')) {
          check = true;
          id = element.parentElement.getAttribute('detect-index');
        }
        if (this.detectClass(element.parentElement.parentElement.classList, 'touch-playlist-end-detect')) {
          check = true;
          id = element.parentElement.parentElement.getAttribute('detect-index');
        }

        if (this.detectClass(element.parentElement.parentElement.parentElement.classList, 'touch-playlist-end-detect')) {
          check = true;
          id = element.parentElement.parentElement.parentElement.getAttribute('detect-index');
        }

        if (check) {
          this.swapMusicInPlayList([id, this.indexDragStart]);
        }
      }
    },
    detectClass: function (classList, className) {
      for (var i = 0; i < classList.length; i++) {
        if (classList[i] == className) {
          return true;
        }

      }
      return false;
    },
    drag: function (indexStart, e) {},
    dragstart: function (indexStart, e) {
      this.dragging = true;
      this.indexDragStart = indexStart;
    },
    dragEnterIntoRemove: function (e) {
      this.overTrash = true;
    },
    dragLeaveOutRemove: function (e) {
      this.overTrash = false;
    },
    dragend: function (index, e) {
      this.dragging = false;
      this.overTrash = false;
    },
    drop: function (indexEnd, e) {

      if (indexEnd == -1) {
        this.removeMusicAt(this.indexDragStart);
      } else {
        this.swapMusicInPlayList([indexEnd, this.indexDragStart]);
      }
    },
    delay: async function (time) {
      return new Promise(res => {
        setTimeout(function (e) {
          return res();
        }, time);
      });
    },
    rotateThumnail: function () {
      let rt = getComputedStyle(document.getElementById('music_thumbnail')).transform;

      var values = rt.split('(')[1],
        values = values.split(')')[0],
        values = values.split(',');

      var a = values[0];
      var b = values[1];
      var c = values[2];
      var d = values[3];

      var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
      angle = angle < 0 ? 360 + angle : angle;

      if (angle == 359) {
        angle = 0;
      } else {
        angle++;
      }
      document.getElementById('music_thumbnail').style.transform = `rotate(${angle}deg)`
      console.log(angle, `rotate(${angle}deg)`);
    },
    showMenuPlaylist: function (e) {
      this.showMenu = false;

      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true
      })
    },

    toggle: function (val) {
      val = !val;
    },
    toggleShuffe: function () {
      this.settings.shuffe = !this.settings.shuffe;
    },
    toggleRepeat: function () {
      let self = this;
      let index = this.repeats.findIndex(it => it.type == self.settings.repeat.type);

      index = index + 1 >= this.repeats.length ? 0 : index + 1;
      this.settings.repeat = this.repeats[index];
    },
    toggleSpeed: function (val) {
      this.settings.speed = val;

      this.$refs.main_music.playbackRate = Number(val);
    },
    loadMusic: function () {
      if (this.playList.length == 0) {

        this.showToast({
          text: 'There is no music in playlist!',
          type: 'error'
        })

      }

      if (!this.loaded) {
        this.loaded = true;
        this.$refs.main_music.src = this.music.href;

        this.$refs.main_music.load();
      }
    },
    replayMusic: function () {
      this.loaded = false;
      this.controlMusic(true);
    },
    fullNumber: function (num) {
      return num >= 10 ? num : `0${num}`;
    },
    formatTime: function (time) {
      let t = Number(`${time ? time : '0'}`);

      let h = parseInt(t / 60 / 60);

      let m = parseInt((t % (60 * 60)) / 60);

      let s = parseInt(((t % (60 * 60)) % 60));

      return `${h != 0 ? `${h}:`  : ''}${m}:${this.fullNumber(s)}`;

    },

    hideBottomSidebar: function () {
      this.toggleIsPlaying()
    },
    loadstart: function () {

      this.musicLoading(true);
    },
    loadeddata: function () {
      this.musicLoading(false);

      this.updateMusic({
        duration: this.$refs.main_music.duration
      })

    },
    waiting: function () {
      this.musicLoading(true);
    },
    canplaythrough: function () {
      console.log("canplaythrough");
      this.musicLoading(false);
      this.setReplay(false);
    },
    musicLoaded: function () {
      this.loaded = true;
    },
    musicNotLoaded: function () {
      this.loaded = false;
    },
    setKeyframeCssScrollText: function () {
      if (!this.$refs.music_title) return;
      var width = "-" + getComputedStyle(this.$refs.music_title).width;

      var cssAnimation = document.createElement('style');
      cssAnimation.type = 'text/css';

      var keyFramePrefixes = ["-webkit-", ""];
      var keyFrames = [];
      var textNode = null;

      for (var i in keyFramePrefixes) {

        keyFrames = '@' + keyFramePrefixes[i] + 'keyframes scroll-text {' +
          'from {' + keyFramePrefixes[i] + 'transform: translateX(' + (this.$refs.music_title.parentElement.clientWidth - 20) + 'px);}' +
          'to {' + keyFramePrefixes[i] + 'transform: translate(' + width + ');}}';

        textNode = document.createTextNode(keyFrames);

        cssAnimation.appendChild(textNode);

        this.$refs.container_css.innerHTML = "";
        this.$refs.container_css.appendChild(cssAnimation);
      }
    },
    play: function () {

      document.title = `${this.music.title} - ${this.music.singers.map(it => it.name).toString()}`;

      this.setKeyframeCssScrollText()

      this.musicPlaying(true);
    },
    musicLoading: function (bool) {
      this.loading = bool;
    },
    musicPlaying: function (bool) {
      this.setPlaying(bool);
    },
    getPositionInPlayList: function (id) {
      return this.playList.findIndex(it => it.id == id);
    },
    next: function (bool) {
      let index = this.settings.shuffe && !bool ? parseInt(Math.random() * this.playList.length) : this.getPositionInPlayList(this.music.id) + 1;

      this.playMusicAt(index);
    },
    previous: function () {
      var index = this.getPositionInPlayList(this.music.id);
      this.playMusicAt(index - 1);
    },
    timeUpdate: function () {
      this.updateMusic({
        lastTime: this.$refs.main_music ? this.$refs.main_music.currentTime : 0
      })
    },
    changeTimeMusic: function (event) {
      this.$refs.main_music.currentTime = event / 100 * this.music.duration;

    },
    ended: function () {
      switch (this.settings.repeat.type) {
        case 1:
          if (this.music.id != this.playList[this.playList.length - 1].id) {
            this.next();
          }

          break;

        case 2:
          this.next();
          break;
        case 3:
          this.$refs.main_music.load();
          this.$refs.main_music.play();
          break;
      }
    },
    playMusicAt: function (index) {
      this.setMusicByIndex(index);

      this.loaded = false;
      this.controlMusic(true);
    },
    selectPlaylist: function (item, index) {
      if (item.id == this.music.id) {
        this.controlMusic(!this.playing);
      } else {
        this.playMusicAt(index);
      }
    },
    errorLoad: function (err) {
      var that = this;
      this.loaded = false;
      this.setPlaying(false);

      this.countLoadError++;

      if (this.timeOutLoad != null || !this.music.href) {
        window.clearTimeout(this.timeOutLoad);
        this.timeOutLoad = null;

      }
      if (!this.music.href) {
        this.setPlaying(false);
        this.loaded = false;
        this.loading = false;
        this.showPlayList = false;

        return;
      }

      if (this.countLoadError == 3) {
        this.countLoadError = 0;

        this.playMusicAt(this.getPositionInPlayList(this.music.id) + 1);

        this.loading = false;

        this.showToast({
          text: 'Loaded faild. Try to play next music!',
          type: 'error'
        })

        return;

      }

      this.timeOutLoad = setTimeout(function (e) {
        console.log("Try reload music....");

        that.$refs.main_music.load();
      }, 1000);

    },
    controlMusic: function (bool) {
      this.loadMusic();
      this.setPlaying(bool);
      if (this.playing) {

        this.$refs.main_music.play();
      } else {
        this.$refs.main_music.pause();
      }
    }
  }
}
</script>

<style scoped>
.flex-none {
  flex: none;
}

.bottom-music {
  position: fixed;
  bottom: 0;
  width: calc(100% - 8px);
  z-index: 1000;
  margin-left: 4px;
}

.center-fixed {
  position: fixed;
  right: 16px;
  bottom: 20%;
  transition: 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.music-title {
  height: 24px;
}

.music-title .m-title {
  position: relative;
  width: calc(100% - 90px);
  overflow: hidden;
}

.music-title .m-title .cover {
  width: auto;
  position: absolute;
  white-space: nowrap;
  left: 0;
  font-size: 14px;
  animation: scroll-text 20s linear infinite;

}

.music-title:hover .m-title .cover {
  animation-play-state: paused;
}

.music-title .m-count {
  position: absolute;
  right: 9px;
  font-size: 12px;
}

.mr-20 {
  margin-right: 80px !important;
}

.control-music {
  align-items: center;
  justify-content: center;
}

.btn-control-music {
  width: 30px !important;
  height: 30px !important;
  background: transparent !important;
}

.btn-larger-control {
  width: 32px !important;
  height: 32px !important;
  color: white;
  background: #59678c !important;
  overflow: hidden;
}

.btn-larger-control:hover {
  background: #515b77 !important;
}

.playlist-active * {
  color: var(--v-activeColor-base) !important;
}

.btn-larger-control i {
  font-size: 26px !important;
}

.btn-control-music:focus:before {
  opacity: 0 !important;
}

.rotate-reserve {
  transform: rotate(180deg)
}

.bottom-play-list {
  width: 98%;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  position: absolute;
  bottom: 1%;
  transform: translateX(-50%);
  left: 50%;
  z-index: 100;
}

.bottom-play-list-background {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-filter: blur(60px);
  filter: blur(60px);
  top: 0;
  z-index: -1;
  opacity: 0.4;
}

.bottom-play-list-wrapper {
  background-color: rgba(0, 0, 0, .65);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}

.bottom-play-list-header {
  width: 100%;
  height: 32px;
  position: absolute;
  top: 0;
}

.bottom-play-list-toolbar {
  width: 100%;
  height: 30px;
  position: relative;
}

.bottom-play-list-toolbar-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;

}

.drop-music-place {
  width: 100%;
  border: 1px dashed;
  line-height: 28px;
  color: var(--v-lightColor-base);
}

.bottom-play-list-content .v-list-item-group-playlist {}

.bottom-play-list-content .v-list-item-group-playlist:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.bottom-play-list-content .view-hover {
  position: absolute;
  right: 0;
}

.bottom-side {
  width: 100%;
  margin: auto;
  z-index: 101;
}

.queue_music_btn_pluse {
  animation: pulse 1.3s cubic-bezier(0.24, 0, 0.38, 1) infinite;
}

.queue_music_btn:focus::before {
  opacity: 0 !important;
}

.queue_music_btn.active::before {
  opacity: 0.3 !important;
}

#music_thumbnail {
  margin: auto;
  margin-top: 16px;

}

@keyframes pulse {
  0% {

    box-shadow: 0 0 0 0 rgba(55, 157, 223, 0.4);
  }

  70% {

    box-shadow: 0 0 0 5px rgba(55, 157, 223, 0);
  }

  100% {

    box-shadow: 0 0 0 0 rgba(55, 157, 223, 0);
  }
}

@media only screen and (max-width: 600px) {
  .pb-xs-2 {
    padding-bottom: 8px !important;
  }

  .pb-xs-1 {
    padding-bottom: 4px !important;
  }

  .ml-xs-1 {
    margin-left: 4px !important;
  }

}
</style>
