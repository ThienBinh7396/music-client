<template>
  <v-container class="pa-4">
    <v-row>
      <v-dialog v-model="dialogSinger" max-width="960" content-class="overflow-x-hidden">
        <v-card class="pa-0 text-left relative">
          <ControlSinger :embed="true" />
          <v-card-actions class="sticky bottom secondary mx-n3 pa-3 pr-6 action-close-modal">
            <div class="flex-grow-1"></div>

            <v-btn color="green accent-3" text @click="closeDialogSinger">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogGenre" max-width="640" content-class="overflow-x-hidden">
        <v-card class="pa-0 text-left relative">
          <Genre :embed="true" />
          <v-card-actions class="sticky bottom secondary mx-n3 pa-3 pr-6 action-close-modal">
            <div class="flex-grow-1"></div>

            <v-btn color="green accent-3" text @click="closeDialogGenre">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-col cols="12">
        <v-card class="text-left pa-4 px-6">
          <v-breadcrumbs :items="breadcums" class="pa-0 mb-5">
            <template v-slot:divider>
              <v-icon>mdi-forward</v-icon>
            </template>
          </v-breadcrumbs>

          <v-row>
            <v-col cols="12" sm="8">
              <v-form>
                <div
                  class="file-upload d-flex justify-center align-center py-10"
                  :class="{'file-over': fileover}"
                >
                  <div class="caption text-center">
                    <v-hover v-slot:default="{ hover }">
                      <v-btn
                        color="info"
                        :outlined="hover || fileover"
                        @click="$refs.upload.click()"
                      >
                        <v-icon>mdi-cloud-upload-outline</v-icon>Upload
                      </v-btn>
                    </v-hover>
                    <div class="mt-3">Drop file here or click to upload.</div>
                  </div>
                  <input
                    accept="audio/*"
                    type="file"
                    class="input-file-hidden"
                    ref="upload"
                    @dragover="fileover=true"
                    @dragleave="fileover=false"
                    @drop="fileover = false"
                    @change="change($event)"
                  />
                </div>
                <transition name="height" mode="out-in">
                  <div
                    class="d-flex my-4 tb-list-music pa-3"
                    :class="{play: play}"
                    @click="play = !play"
                    v-if="musicFile.href"
                  >
                    <div class="d-flex list-music-content" style="width: calc(100% - 80px)">
                      <div class="d-flex align-center justify-center list-music-icon relative">
                        <audio
                          class="d-none"
                          ref="music"
                          :src="musicFile.href"
                          @ended="play = false"
                          @loadeddata="loadeddata"
                          @timeupdate="timeUpdate"
                        ></audio>
                        <v-img
                          src="/img/music-placeholder-square.png"
                          class="absolute top"
                          width="52"
                          aspect-ratio="1"
                        ></v-img>
                        <div
                          class="icon-background"
                          :style="{background: play ? '#1f1e1e8c' : '#1f1e1e3b'}"
                        ></div>
                        <div class="music-icon" :class="{'play': play}">
                          <v-icon v-if="play" size="21">mdi-pause-circle-outline</v-icon>
                          <v-icon v-if="!play" size="25">mdi-play-circle-outline</v-icon>
                        </div>
                      </div>
                      <div class="ml-2 pt-1 list-music-description">
                        <div class="fs-14 text---lightColor text-truncate">{{musicFile.name}}</div>
                        <div class="fs-13 text---blurColor">{{musicFile.size / 1000}} kB</div>
                      </div>
                    </div>
                    <div class="text---blurColor fs-13 ml-1 list-music-time" style="width: 80px">
                      <span class="text---lightColor">{{formatMusicTime(currentTime) }}</span>
                      / {{ formatMusicTime(duration) }}
                    </div>
                  </div>
                </transition>

                <div class="simple-form-control mt-4">
                  <div class="simple-form-label">
                    <label for="name">Title:</label>
                  </div>
                  <v-text-field
                    clearable
                    outlined
                    solo
                    class="simple-form-input"
                    color="#379DDF"
                    v-model="title"
                    name="title"
                    label="Title..."
                  ></v-text-field>
                </div>

                <div class="simple-form-control">
                  <div class="simple-form-label">
                    <label for="name">Singers:</label>
                  </div>

                  <v-autocomplete
                    name="singer"
                    class="lyric-area fs-13"
                    :search-input.sync="searchSinger"
                    color="#dfdfdf"
                    v-model="singer"
                    :items="singers"
                    chips
                    solo
                    item-text="name"
                    item-value="id"
                    multiple
                    style="z-index: 100"
                    placeholder="Choose at least singer!"
                    :loading="isLoadingSinger"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="removeSingers(data.item)"
                      >
                        <v-avatar left>
                          <v-img :src="data.item.thumbnail"></v-img>
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item"></v-list-item-content>
                      </template>
                      <template v-else>
                        <div class="d-flex align-center py-2">
                          <v-img
                            :src="data.item.thumbnail"
                            elevation="2"
                            width="32"
                            aspect-ratio="1"
                            class="rounded mr-2"
                          ></v-img>
                          <div v-html="data.item.name" class="fs-14 text---lightColor"></div>
                        </div>
                      </template>
                    </template>
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title class="fs-14">
                          <a class="mr-1" @click.stop="dialogSinger = true">Click here</a> to add new singer
                          <strong>{{searchSinger}}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </div>
                <div class="simple-form-control mt-4">
                  <div class="simple-form-label">
                    <label for="name">Genres:</label>
                  </div>

                  <v-autocomplete
                    :elevation="0"
                    class="lyric-area fs-13"
                    :search-input.sync="searchGenre"
                    color="#dfdfdf"
                    v-model="genre"
                    :items="genres"
                    filled
                    chips
                    solo
                    item-text="title"
                    item-value="id"
                    multiple
                    style="z-index: 100"
                    placeholder="Choose at least genre!"
                    :loading="isLoadingGenre"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="removeGenre(data.item)"
                      >#{{ data.item.title }}</v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item"></v-list-item-content>
                      </template>
                      <template v-else>
                        <div class="d-flex align-center pa-0 ma-0">
                          <v-checkbox
                            :input-value="genre.indexOf(data.item.id) >= 0"
                            color="#dfdfdf"
                            label
                            class="pa-0 ma-0"
                            style="height: 24px;"
                          ></v-checkbox>
                          <div v-html="data.item.title" class="fs-14 text---lightColor"></div>
                        </div>
                      </template>
                    </template>
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title class="fs-14">
                          <a class="mr-1" @click.stop="dialogGenre = true">Click here</a> to add new genre
                          <strong>{{searchGenre}}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </div>

                <div class="simple-form-control mt-4">
                  <div class="simple-form-label">
                    <label for="information">Lyric:</label>
                  </div>
                  <quill-editor
                    class="ql-customize"
                    v-model="lyric"
                    ref="myQuillEditor"
                    :options="editorOption"
                    id="lyric"
                  ></quill-editor>
                </div>
                <v-btn color="primary" class="text-capitalize mt-6" small @click="add">Submit</v-btn>
              </v-form>
            </v-col>
            <v-col cols="12" sm="4" md="3" class="mx-auto">
              <div
                class="pa-1 mx-auto d-flex justify-center align-center relative"
                style="width: 200px; height: 200px;border: 3px solid #9E9E9E; border-radius: 5px;"
              >
                <v-icon
                  size="160px"
                  color="#9E9E9E"
                  v-if="!thumbnailFile && type == 'add'"
                >mdi-folder-image</v-icon>
                <div class="full-width full-height" v-if="thumbnailFile || type == 'edit'">
                  <v-img :src="thumbnail ? thumbnail : '/img/placeholder.png'" aspect-ratio="1"></v-img>
                </div>
                <input
                  type="file"
                  ref="thumbnail"
                  class="input-file-hidden"
                  @change="changeImage($event, 'thumbnail')"
                  accept="image/*"
                />
              </div>
              <v-btn
                outlined
                color="#9E9E9E"
                small
                class="mt-6 mx-auto d-block text-capitalize"
                @click="$refs.thumbnail.click()"
              >
                <v-icon size="20">mdi-upload</v-icon>Choose picture
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    ControlSinger: () => import("./ControlSinger"),
    Genre: () => import("./Genre"),
    quillEditor
  },
  data() {
    return {
      rules: {
        required: value => !!value || "Required."
      },
      breadcums: null,
      editorOption: {
        theme: "snow",
        placeholder: "Enter lyric of music",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            ["blockquote", "code-block"],

            [
              {
                list: "ordered"
              }
            ],
            [
              {
                color: []
              },
              {
                background: []
              }
            ],
            [
              {
                align: []
              }
            ],
            ["clean"]
          ],
          clipboard: {
            matchVisual: false // https://quilljs.com/docs/modules/clipboard/#matchvisual
          }
        }
      },
      fileover: false,
      musicFile: {
        href: "",
        file: null,
        name: "",
        size: ""
      },
      duration: 0,
      currentTime: 0,
      play: false,
      thumbnail: "/img/placeholder.png",
      thumbnailFile: null,
      title: "",
      lyric: "",

      singer: [],
      singers: [
        {
          header: "Choose singers:"
        }
      ],
      dialogSinger: false,
      isLoadingSinger: false,
      searchSinger: "",

      genre: [],
      genres: [
        {
          header: "Choose genres:"
        }
      ],
      dialogGenre: false,
      isLoadingGenre: false,
      searchGenre: "",
      type: "add",
      id: -1
    };
  },
  watch: {
    play: function(val) {
      if (val) this.$refs.music.play();
      else this.$refs.music.pause();
    }
  },
  computed: {
    ...mapState("app", ["axiosInstance"])
  },
  created() {
    let that = this;
    let params = this.$route.params.data;

    try {
      params = JSON.parse(atob(params));

      if (params.type == "edit") {
        this.type = params.type;

        this.id = params.id;

        this.axiosInstance
          .post("admin/musics/findById", {
            id: params.id
          })
          .then(rs => {
            let data = rs.data.response;

            this.singer = data.singers.map(it => it.id);
            this.genre = data.genres.map(it => it.id);
            this.lyric = data.lyric;

            this.title = data.title;
            this.thumbnail = data.thumbnail;

            fetch(data.href)
              .then(res => res.blob())
              .then(blob => {
                that.musicFile = {
                  href: data.href,
                  file: null,
                  name: that.getLast(data.href),
                  size: blob.size
                };
              });
          });
      }
    } catch (error) {
      this.showToast({
        type: "error",
        text: "Params is invalid!"
      });
      this.$router.push("/admin/music");
    }

    this.breadcums = [
      {
        text: "Music",
        disabled: false,
        href: "#/admin/music"
      },
      {
        text: this.type,
        disabled: true,
        href: ""
      }
    ];

    this.init();
  },

  methods: {
    ...mapMutations("app", ["showToast", "showDialogProcess"]),
    init: function() {
      this.initSinger();
      this.initGenre();
    },
    getLast: function(href) {
      let regex = /\/?\w+\.\w+/gi;

      let match = href.match(regex);

      return match[match.length - 1].replace("/", "");
    },
    closeDialogSinger: function() {
      this.dialogSinger = false;
      this.initSinger();
    },

    initSinger: async function() {
      this.isLoadingSinger = true;
      this.singers.splice(1, 0, ...(await this.getSinger()));
      this.isLoadingSinger = false;
    },
    getSinger: async function() {
      return new Promise(res => {
        setTimeout(() => {
          this.axiosInstance.post("admin/singers/all").then(rs => {
            if (rs.data.type == "error") {
              res([]);
            } else {
              res(rs.data.response);
            }
          });
        }, 10);
      });
    },
    closeDialogGenre: function() {
      this.dialogGenre = false;
      this.initGenre();
    },
    initGenre: async function() {
      this.isLoadingGenre = true;
      this.genres.splice(1, 0, ...(await this.getGenre()));
      this.isLoadingGenre = false;
    },
    getGenre: async function() {
      return new Promise(res => {
        setTimeout(() => {
          this.axiosInstance.post("admin/genres/all").then(rs => {
            if (rs.data.type == "error") {
              res([]);
            } else {
              res(rs.data.response);
            }
          });
        }, 10);
      });
    },
    removeSingers: function(item) {
      let index = this.singer.findIndex(it => it == item.id);

      this.singer.splice(index, 1);
    },
    removeGenre: function(item) {
      let index = this.genre.findIndex(it => it == item.id);

      this.genre.splice(index, 1);
    },

    changeImage: function(e) {
      if (!e.target.files[0]) {
        this.showToast({
          type: "error",
          text: "File choose is invalid..."
        });
        return;
      }

      this.thumbnailFile = e.target.files[0];

      this.thumbnail = URL.createObjectURL(e.target.files[0]);
    },
    change: function(e) {
      if (e.target.files.length == 0) return;

      let file = e.target.files[0];

      if (!/^(audio\/).*/.test(file.type)) {
        this.showToast({
          type: "error",
          text: "File upload is invalid"
        });

        return;
      }

      this.musicFile = {
        href: URL.createObjectURL(file),
        file: file,
        name: file.name,
        size: file.size
      };
      this.play = false;
    },
    formatMusicTime: function(time) {
      let t = Number(`${time}`);

      let h = parseInt(t / 60 / 60);

      let m = parseInt((t % (60 * 60)) / 60);

      let s = parseInt((t % (60 * 60)) % 60);

      return `${h != 0 ? `${h}:` : ""}${m}:${window.formatNumber(s)}`;
    },
    loadeddata: function() {
      this.duration = this.$refs.music.duration;
    },
    timeUpdate: function() {
      this.currentTime = this.$refs.music.currentTime;
    },
    uploadFile: async function(file) {
      return new Promise(res => {
        let formData = new FormData();
        if (typeof file == "string") {
          formData.append("path", JSON.stringify([`${file}`]));
        } else {
          formData.append("files", file);
        }
        this.axiosInstance
          .post("uploadImage", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(rs => {
            res(rs.data);
          })
          .catch(() => {
            res(null);
          });
      });
    },
    add: async function() {
      this.showDialogProcess(true);

      let rs = null;

      if (this.musicFile.file == null && this.type == "add") {
        this.showToast({
          type: "error",
          text: "Upload music file!"
        });
        this.showDialogProcess(false);
        return;
      }
      if (this.thumbnailFile == null && this.type == "add") {
        this.showToast({
          type: "error",
          text: "Upload thumbnail of music!"
        });

        this.showDialogProcess(false);
        return;
      }

      if (this.singer.length == 0 && this.type == "add") {
        this.showToast({
          type: "error",
          text: "Choose at least a singer!"
        });

        this.showDialogProcess(false);
        return;
      }
      if (this.genre.length == 0 && this.type == "add") {
        this.showToast({
          type: "error",
          text: "Choose at least a genre!"
        });

        this.showDialogProcess(false);
        return;
      }

      rs = this.musicFile.file
        ? await this.uploadFile(this.musicFile.file)
        : null;

      let musicHref = rs ? rs[0].url : "";

      rs = this.thumbnailFile
        ? await this.uploadFile(this.thumbnailFile)
        : null;
      let thumbnailHref = rs ? rs[0].url : "";

      let dt = {
        title: this.title,
        lyric: this.lyric,
        duration: `${parseInt(this.$refs.music.duration)}`,
        size: this.musicFile.size,
        genre: JSON.stringify(this.genre),
        singer: JSON.stringify(this.singer),
        scope: "public"
      };

      if (this.type == "edit") dt.id = this.id;

      if (musicHref) {
        dt.href = musicHref;
      }

      if (thumbnailHref) {
        dt.thumbnail = thumbnailHref;
      }

      this.axiosInstance
        .post(`admin/musics/${this.type}`, dt)
        .then(rs => {
          if (rs.data.type == "success") {
            this.$router.push("/admin/music");
          }

          this.showToast({
            type: "success",
            text: `${rs.data.message}`
          });

          this.showDialogProcess(false);
        })
        .catch(() => {
          this.showToast({
            type: "error",
            text: `${this.type} music failure`
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.file-upload {
  position: relative;
  height: 182px;
  width: 100%;
  border-radius: 5px;
  border: 1px dashed #adadad;

  .caption {
    position: absolute;
    width: 210px;
    height: auto;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.file-upload.file-over {
  border-color: var(--v-activeColor-base) !important;
  border-style: dotted;
}

.action-close-modal {
  border-top: 1.4px solid #8e8585 !important;
  z-index: 10;
}
</style><style lang="scss">
.lyric-area {
  border: 1px solid #8a8787;

  .v-text-field__details {
    display: none;
  }

  .v-input__slot {
    box-shadow: none !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    margin-bottom: 0 !important;
  }
}
</style>
