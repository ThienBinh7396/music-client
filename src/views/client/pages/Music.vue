<template>
  <v-container class="pa-8 pt-4 text-left">
    <v-row>
      <v-col cols="12">
        <v-dialog v-model="dialog" max-width="640">
          <v-card class="text-left relative">
            <v-card-title>
              <div class="d-inline-block mr-3" style="width: 32px;">
                <v-img src="/img/music-placeholder.png"></v-img>
              </div>
              <span class="headline">Comments</span>
            </v-card-title>
            <v-divider class="mx-6"></v-divider>
            <div class="d-flex px-6 mb-6 mt-1 justify-space-between">
              <div>{{getTotalComments()}} Comments</div>
            </div>
            <div class="px-6">
              <div
                v-if="getTotalComments() == 0"
                class="text---darkColor text-center"
              >Comment is empty</div>
              <div v-if="comments">
                <perfect-scrollbar class="comment-container mt-4" id="comment-container">
                  <div class="overflow-x-hidden">
                    <transition-group name="list" mode="in-out" tag="div">
                      <div v-for="(item, index) in comments" :key="`_comment-${index}`">
                        <div class="comment-container-item mb-2 pr-5">
                          <div class="comment-user-image mr-2">
                            <v-img
                              :src="item.User.thumbnail"
                              width="100%"
                              aspect-ratio="1"
                              class="rounded"
                            ></v-img>
                          </div>
                          <div class="comment-center">
                            <div class="user-infor">
                              <span
                                class="fs-14 font-weight-bold mr-1"
                                style="font-f"
                              >{{item.User.name}}</span>
                              <div
                                class="text---lessDarkColor fs-14 d-inline comment-text"
                                v-html="item.content"
                              ></div>
                            </div>
                            <div class="comment-interactive">
                              <a
                                class="fs-12 mr-2 d-inline-block tb-link text---activeColor"
                                @click="activeSubComment(item.id)"
                              >Reply</a>
                              <span class="fs-12 text---darkColor">{{getCalculateTime(item.time)}}</span>
                              <div class="mt-2"></div>
                              <div
                                class="sCm"
                                v-for="(sComment, subID) in item.subs"
                                :key="`sCm-${subID}`"
                              >
                                <div class="comment-container-item sub-comment-item pb-3 pl-2">
                                  <div class="sub-comment-user-image mr-2">
                                    <v-img
                                      :src="sComment.User.thumbnail"
                                      width="100%"
                                      aspect-ratio="1"
                                      class="rounded"
                                    ></v-img>
                                  </div>
                                  <div class="comment-center">
                                    <div class="user-infor">
                                      <span
                                        class="fs-14 mr-2 font-weight-bold"
                                        style="font-f"
                                      >{{sComment.User.name}}</span>
                                      <div
                                        class="d-inline text---lessDarkColor comment-text fs-14"
                                        v-html="sComment.content"
                                      ></div>
                                    </div>
                                    <div class="comment-interactive">
                                      <a
                                        class="fs-12 mr-2 d-inline-block tb-link text---activeColor"
                                        @click="activeSubComment(item.id)"
                                      >Reply</a>
                                      <span
                                        class="fs-12 text---darkColor"
                                      >{{getCalculateTime(sComment.time)}}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="sub-comment mt-4" v-if="subComment.id == item.id">
                                <div class="user-comment-area background-transparent">
                                  <div
                                    class="sub-user-comment-area-image mr-2 background-transparent"
                                  >
                                    <v-img :src="user.thumbnail" aspect-ratio="1" class="rounded"></v-img>
                                  </div>
                                  <div class="comment-user-input">
                                    <div class="simple-form-control append-icon two-icon">
                                      <v-textarea
                                        outlined
                                        solo
                                        rows="1"
                                        auto-grow
                                        class="simple-form-input small-size"
                                        color="#379DDF"
                                        label="Type something..."
                                        v-model="subComment.content"
                                      ></v-textarea>
                                      <div class="append-icon-content">
                                        <div class="ic">
                                          <v-icon
                                            size="18"
                                            v-if="!subComment.sendingComment"
                                            @click="send(item.id)"
                                          >mdi-send</v-icon>
                                          <v-progress-circular
                                            width="2"
                                            size="18"
                                            indeterminate
                                            v-if="subComment.sendingComment"
                                            color="primary"
                                          ></v-progress-circular>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition-group>
                  </div>
                </perfect-scrollbar>
              </div>
              <loading-icon w="64" margin="-10px auto 0" v-if="loadingComment.load"></loading-icon>
              <div v-if="comments">
                <div class="user-comment-area mt-6 background-transparent">
                  <emoji
                    v-bind:show="showCommentEmoji.value"
                    :target="'comment'"
                    v-on:addMessageEmoji="addEmoji"
                  />
                  <div class="user-comment-area-image mr-3 background-transparent">
                    <v-img :src="user.thumbnail" aspect-ratio="1" class="rounded"></v-img>
                  </div>
                  <div class="comment-user-input">
                    <div class="simple-form-control mb-4 append-icon two-icon">
                      <v-textarea
                        outlined
                        solo
                        rows="1"
                        auto-grow
                        class="simple-form-input small-size"
                        color="#379DDF"
                        label="Type something..."
                        v-model="sendContent"
                      ></v-textarea>
                      <div class="append-icon-content">
                        <div class="ic">
                          <v-icon
                            :color="`${showCommentEmoji.value ? '#00b8ff' : '#dedede'}`"
                            @click="toggleEmoji('showCommentEmoji')"
                            size="18"
                          >mdi-sticker-emoji</v-icon>
                        </div>
                        <div class="ic">
                          <v-icon size="18" v-if="!sendingComment" @click="send(0)">mdi-send</v-icon>
                          <v-progress-circular
                            size="18"
                            width="2"
                            indeterminate
                            v-if="sendingComment"
                            color="primary"
                          ></v-progress-circular>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="12">
        <loading-icon w="100" margin="100px auto 0" v-if="loading"></loading-icon>
        <div class="content" v-if="!loading">
          <div class="text-left relative overflow-hidden">
            <div class="music-header relative py-4 px-6">
              <div
                class="blur-container"
                :style="{'background-image': `url(${musics ? musics.thumbnail : '/img/banner-music.png'})`}"
              ></div>
              <div class="d-flex">
                <div class="music-thumbnail show-icon" style="height: 160px">
                  <v-img
                    class="flex-none tb-music-thumbnail"
                    :class="{'play': playing && musics.id == music.id}"
                    :src="musics ? musics.thumbnail : '/img/banner-music.png'"
                    aspect-ratio="1"
                    width="160"
                    height="160"
                    lazy-src="/img/banner-music.png"
                  ></v-img>
                  <div class="music-icon" @click="play">
                    <!-- <v-icon v-if=" play && music.id == currentMusic.id" size="21" color="indigo">mdi-pause</v-icon> -->
                    <v-icon
                      size="25"
                      color="indigo"
                    >{{playing && musics.id == music.id ? 'mdi-pause': 'mdi-play' }}</v-icon>
                  </div>
                </div>

                <div class="music-info title pl-4 relative width-100">
                  <div class="fs-24">{{ musics ? musics.title : ''}}</div>
                  <div class="fs-15">
                    <span v-if="musics">
                      <span
                        class="tb-link"
                        @click="toSinger(item.id)"
                        v-for="(item, index) in musics.singers.map(it => {return {id : it.id, name: it.name}})"
                        :key="`singer-${index}`"
                      >
                        {{item.name}}
                        <span v-if="index == 0">,</span>
                      </span>
                    </span>
                  </div>
                  <div
                    class="fs-15 mt-2 text---darkColor"
                  >Genres: {{ musics ? musics.genres.map(it => it.title).join(',') : ''}}</div>
                  <div class="text-right statistic mt-2">
                    <v-icon>mdi-headphones</v-icon>
                    {{musics ? countListener() : 0}}
                    <v-icon size="19" class="ld ld-heartbeat">mdi-heart</v-icon>

                    {{musics ? JSON.parse(musics.likes).length : 0}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="music-interaction mt-6">
            <v-btn color="#15ca15" class="mr-6 px-8" @click="play">
              <v-icon>{{playing && musics.id == music.id ? 'mdi-pause': 'mdi-play' }}</v-icon>
              {{playing && musics.id == music.id ? 'Pause' : 'Play'}}
            </v-btn>
            <transition mode="out-in" name="fade">
              <v-btn text v-if="tab != 0" @click="tab = 0">
                <v-icon>mdi-card-text</v-icon>Lyrics
              </v-btn>
            </transition>
            <v-btn text class="mr-4" @click="like">
              <span>
                <v-progress-circular
                  width="2"
                  size="18"
                  indeterminate
                  v-if="processLike"
                  color="primary"
                ></v-progress-circular>
                <v-icon
                  v-if="!processLike"
                  :color="checkLike() ? '#fb2626' : 'white'"
                >{{checkLike() ? 'mdi-heart': 'mdi-heart-outline'}}</v-icon>
              </span>
              Like
            </v-btn>

            <v-btn text class="mr-4" @click="showComment">
              <v-badge left overlap color="#ff0000">
                <template v-slot:badge>{{comments ? getTotalComments(): 0}}</template>
                <v-icon>mdi-message-reply-text</v-icon>
              </v-badge>Comment
            </v-btn>
            <v-btn text @click="addToPlaylist">
              <v-icon>mdi-plus</v-icon>Add to playlist
            </v-btn>
            <v-btn text @click="download">
              <v-icon>mdi-download</v-icon>Download
            </v-btn>
            <v-divider class="mx-2 mt-4"></v-divider>
          </div>

          <div class="music-content py-4 background-transparent">
            <div class="fs-19 mt-12">Lyric</div>
            <div
              class="fs-14 text---blurColor"
            >Contributed by {{musics ? musics.lyricContributed : ''}}</div>
            <div
              v-html="musics ? musics.lyric : ''"
              class="mt-4 fs-14 text---lessDarkColor music-lyric"
            ></div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      loading: true,
      processLike: false,
      musics: {
        id: 1
      },
      tab: 0,
      tabItem: ["lyric", "comment"],
      loadingComment: {
        load: true,
        first: true
      },
      comments: null,
      sendContent: "",
      sendingComment: false,
      subComment: {
        id: 0,
        content: "",
        sendingComment: false
      },
      showSubCommentEmoji: {
        value: false,
        title: "show"
      },
      showCommentEmoji: {
        value: false,
        title: "show"
      }
    };
  },
  watch: {
    $route() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState("app", ["axiosInstance", "user", "imagePlaceholder"]),
    ...mapState("musics", ["music", "playing"])
  },

  methods: {
    ...mapMutations("app", ["showToast"]),
    ...mapMutations("musics", [
      "playControlMusic",
      "addMusicIntoPlaylist",
      "updateControlMusic"
    ]),
    init: function() {
      try {
        let data = JSON.parse(atob(this.$route.params.data));

        this.musics.id = data.musicId;
      } catch (error) {
        this.showToast({
          type: "error",
          text: "Url is invalid!"
        });
        this.$router.push("/home");
        return;
      }

      this.loading = true;
      this.loadingComment.first = true;

      this.axiosInstance
        .post("/client/music/findOne", {
          id: this.musics.id
        })
        .then(rs => {
          let { data } = rs;

          if (data.type == "error") {
            this.$router.push("/home");

            this.showToast({
              type: "error",
              text: "Something went wrong. Try again!"
            });
          } else {
            this.musics = data.response;

            this.loading = false;
          }
        });

      if (this.loadingComment.first) {
        this.loadingComment.first = false;

        this.loadComment();
      }
    },
    countListener: function() {
      let total = 0;
      JSON.parse(this.musics.listeners).forEach(it => {
        total += it.amount;
      });

      return total;
    },
    toSinger: function(id) {
      let data = {
        singerId: id
      };
      this.$router.push(`/singer/${btoa(JSON.stringify(data))}`);
    },
    toggleEmoji: function(target) {
      this[target].value = !this[target].value;
    },
    addEmoji: function(target, emoji) {
      if (target == "comment") {
        this.sendContent += emoji;
      } else {
        this.subComment.content += emoji;
      }
    },
    loadComment: function() {
      this.axiosInstance
        .post("/client/music/getCommentByMusicId", {
          musicId: this.musics.id
        })
        .then(rs => {
          let { data } = rs;

          if (data.type == "error") {
            this.showToast({
              type: "error",
              text: `Can't load comments. Reloading!`
            });
          } else {
            this.comments = data.response;

            this.loadingComment.load = false;
          }
        });
    },
    play: function() {
      if (this.musics.id == this.music.id) {
        this.updateControlMusic(this.musics);
      } else {
        this.playControlMusic(this.musics);
      }
    },
    showComment: function() {
      this.dialog = true;
    },
    checkLike: function() {
      return (
        JSON.parse(this.musics.likes).findIndex(it => it == this.user.id) >= 0
      );
    },
    like: function() {
      this.processLike = true;
      let like =
        JSON.parse(this.musics.likes).findIndex(it => it == this.user.id) >= 0;

      this.axiosInstance
        .post("/client/music/like", {
          musicId: this.musics.id,
          like: !like
        })
        .then(rs => {
          let { data } = rs;

          if (data.type == "error") {
            this.showToast({
              type: "error",
              text: data.message
            });
          } else {
            this.musics.likes = data.response.likes;
            this.showToast({
              type: "success",
              text: "Acction successful!"
            });
          }

          this.processLike = false;
        });
    },
    diffDate(time1, time2) {
      if (!time2) {
        return false;
      }

      var date1 = new Date(time1);
      var d1 = date1.getDate();
      var m1 = date1.getMonth() + 1;
      var y1 = date1.getFullYear();

      var date2 = new Date(time2);
      var d2 = date2.getDate();
      var m2 = date2.getMonth() + 1;
      var y2 = date2.getFullYear();

      return d1 == d2 && m1 == m2 && y1 == y2;
    },

    send: function(parentId) {
      this.sendContent = this.sendContent.trim();

      this.subComment.content = this.subComment.content.trim();

      if (
        (parentId == 0 && this.sendContent.length == 0) ||
        (parentId != 0 && this.subComment.content.length == 0)
      ) {
        this.showToast({
          type: "error",
          text: "Type somethings..."
        });
        return;
      }

      parentId != 0
        ? (this.subComment.sendingComment = true)
        : (this.sendingComment = true);

      this.axiosInstance
        .post("/client/music/comment", {
          musicId: this.musics.id,
          content: parentId != 0 ? this.subComment.content : this.sendContent,
          parentId: parentId || 0
        })
        .then(rs => {
          this.sendingComment = false;
          this.subComment.sendingComment = false;

          parentId != 0
            ? (this.subComment.content = "")
            : (this.sendContent = "");

          let { data } = rs;

          data.response.User = this.user;
          data.response.subs = [];
          if (data.type == "success") {
            if (data.response.parentId == 0) {
              this.comments.push(data.response);
              this.scrollCommentDown();
            } else {
              let index = this.comments.findIndex(
                it => it.id == data.response.parentId
              );

              this.comments[index].subs.push(data.response);
            }
          } else {
            this.showToast({
              type: "error",
              text: data.message
            });
          }
        })
        .catch(() => {
          this.showToast({
            type: "error",
            text: "Something went wrong"
          });
        });
    },
    activeSubComment: function(parentId) {
      this.subComment.id = parentId;
    },
    scrollCommentDown: function() {
      setTimeout(() => {
        let objDiv = document.getElementById("comment-container");
        window.Velocity(objDiv, "scroll", {
          offset: objDiv.scrollHeight,
          container: objDiv,
          axis: "y",
          duration: 200
        });
      }, 100);
    },
    addToPlaylist: function() {
      this.addMusicIntoPlaylist(this.musics);
    },
    download: function() {
      let element = document.createElement("div");
      let a = `<a href="${this.musics.href}" target="_blank" download>${this.musics.title}</a>`;
      element.innerHTML = a;

      document.body.appendChild(element);

      element.children[0].click();

      this.axiosInstance.post("client/download/userDownload", {
        id: this.musics.id
      });
    },
    getTotalComments: function() {
      let t = 0;
      if (!this.comments) return 0;
      this.comments.forEach(it => {
        t += 1 + it.subs.length;
      });
      return t;
    },
    getCalculateTime: time => window.calculateTime(time)
  }
};
</script>

<style lang="scss" scoped>
.music-header {
  width: 100%;

  .blur-container {
    transform: scaleY(1.1);
  }

  .music-thumbnail {
    position: relative;

    .music-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      background: #fdfdfd;
      width: 42px;
      height: 42px;
      line-height: 40px;
      text-align: center;
      border-radius: 100%;
      transform: translate(-50%, -50%);
      cursor: pointer;
      opacity: 0;
      transition: 0.24s ease-out;
    }

    &.show-icon .music-icon,
    &:hover .music-icon {
      opacity: 1;
    }
  }
}

.comment-container {
  max-height: 280px;

  .comment-container-item {
    display: flex;
    flex-wrap: nowrap;
    line-height: 18px;

    &.sub-comment-item {
      border-left: 3px solid #0fa2dae6;
    }

    .sub-comment-user-image {
      width: 24px;
      height: 24px;
      margin-top: 2px;
    }

    .comment-user-image {
      width: 32px;
      height: 32px;
      margin-top: 1px;
    }

    .comment-center {
      flex-grow: 1;
    }

    .comment-text {
      line-height: 1.45;
    }
  }
}

.user-comment-area {
  display: flex;
  position: relative;

  .sub-user-comment-area-image {
    width: 24px;
    height: 24px;
  }

  .user-comment-area-image {
    width: 32px;
    height: 32px;
  }

  .comment-user-input {
    flex-grow: 1;
  }
}
</style>
