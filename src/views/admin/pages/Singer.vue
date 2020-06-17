<template>
  <v-container class="pa-4">
    <v-row class="mt-8">
      <v-dialog v-model="dialog" max-width="640">
        <v-card class="py-4 px-6 text-left relative">
          <div class="singer-header">
            <v-img
              :src="showSinger ? showSinger.bannerHref : '/img/banner-placeholder.png'"
              min-height="180px"
              max-height="200px"
              lazy-src="/img/background-placeholder.png"
            ></v-img>
            <div class="d-flex my-3 align-center">
              <v-img
                class="rounded flex-none"
                width="52"
                aspect-ratio="1"
                :src="showSinger && showSinger.thumbnail ? showSinger.thumbnail : '/img/placeholder.png'"
              ></v-img>
              <div class="ml-2">
                <div class="fs-14">{{ showSinger ? showSinger.name : '' }}</div>
                <div
                  class="fs-13 text---blurColor"
                >{{ showSinger ? `${showSinger.followers} followers` : '' }}</div>
              </div>
            </div>
          </div>
          <h2 class="mb-3">Information</h2>
          <div v-html="showSinger ? showSinger.information : ''" class="fs-14 text---lessDarkColor"></div>
          <v-card-actions class="sticky bottom secondary mx-n3 pa-3">
            <div class="flex-grow-1"></div>

            <v-btn color="green accent-3" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-col cols="12">
        <material-card :offset="0" :fullWidth="false">
          <template v-slot:offset>
            <div class="d-flex grow flex-wrap v-card--material_with_icon">
              <v-card
                slot="offset"
                class="elevation-3 v-card--material__heading v-card--material__heading_icon transition-fast"
                color="indigo"
                dark
              >
                <v-icon size="40">mdi-microphone-variant</v-icon>
              </v-card>
              <div :class="`${ responsive > 2 ? 'ml-3' : 'ml-2'}`">
                <div class="display-5 font-weight-light transition-fast">Singer Tables</div>
              </div>
              <v-btn
                class="mt-4 right"
                absolute
                small
                right
                color="indigo"
                to="/admin/singer/control/eyJ0eXBlIjoiYWRkIn0="
              >
                <v-icon>mdi-plus</v-icon>Add
              </v-btn>
            </div>
          </template>
          <v-card-title class="pt-0 px-0">
            <div class="flex-grow-1"></div>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              dark
              single-line
              hide-details
              class="search"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="singers"
            :search="search"
            :loading="loading"
            loading-text="Loading... Please wait"
          >
            <template v-slot:item.thumbnail="{ item }">
              <v-img
                :src="item.thumbnail ? item.thumbnail : '/img/placeholder.png'"
                width="56"
                class="my-2"
                aspect-ratio="1"
              ></v-img>
            </template>

            <template v-slot:item.followers="{ item }">
              <v-chip
                small
                :color="getColor(item.followers)"
                style="min-width: 50px;height: 26px;font-size: 13px; text-align: center"
              >{{ item.followers }}</v-chip>
            </template>
            <template v-slot:item.createdAt="{ item }">{{ getDate(item.createdAt) }}</template>
            <template v-slot:item.action="{ item }">
              <v-hover v-slot:default="{ hover }">
                <v-btn x-small color="darkColor" outlined class="mr-2" @click="showDialog(item)">
                  <v-icon x-small>mdi-magnify</v-icon>View
                </v-btn>
              </v-hover>
              <v-hover v-slot:default="{ hover }">
                <v-btn x-small color="darkColor" @click="edit(item)" outlined class="mr-2">
                  <v-icon x-small>mdi-pencil</v-icon>Edit
                </v-btn>
              </v-hover>
              <v-hover v-slot:default="{ hover }">
                <v-btn x-small color="#da4949" @click="deleteSinger(item)">
                  <v-icon x-small>mdi-close</v-icon>Delete
                </v-btn>
              </v-hover>
            </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      loading: true,
      search: "",
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: "Thumbnail",
          value: "thumbnail"
        },
        {
          text: "Follower",
          value: "followers"
        },
        {
          text: "Create_at",
          value: "createdAt"
        },
        {
          text: "Actions",
          value: "action",
          sortable: false
        }
      ],
      singers: [],
      showSinger: null
    };
  },
  computed: {
    ...mapState("app", ["responsive", "axiosInstance"])
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations("app", ["showToast"]),
    ...mapActions("app", ["showAlert"]),
    getDate: function(date) {
      return window.formatDate(date, 3).format;
    },
    init: async function() {
      this.singers = (await this.getSinger()).map(it => {
        it.followers = JSON.parse(it.followers).length;
        return it;
      });

      this.loading = false;
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
    getColor(followers) {
      if (followers < 1000) return "#c7433a";
      else if (followers < 2000) return "orange";
      else return "green";
    },
    showDialog: function(item) {
      this.showSinger = item;
      this.dialog = true;
    },
    edit: function(item) {
      let dt = {
        type: "edit",
        id: item.id,
        name: item.name,
        thumbnail: item.thumbnail,
        bannerHref: item.bannerHref
      };
      dt = JSON.stringify(dt);
      dt = btoa(unescape(encodeURIComponent(dt)));

      this.$router.push(`/admin/singer/control/${dt}`);
    },
    deleteSinger: function(item) {
      this.showAlert({
        title: "Are you sure?",
        html: `Delete information of ${item.name}!<br><strong>Note: </strong> You can delete if this don't have record of music, ex...`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(rs => {
        if (rs.value) {
          this.axiosInstance
            .post("admin/singers/delete", {
              id: item.id
            })
            .then(rs => {
              if (rs.data.type == "success") {
                this.singers.splice(
                  this.singers.findIndex(it => it.id == item.id),
                  1
                );
                this.showToast({
                  text: "Delete successful!",
                  type: "success"
                });
              } else {
                this.showToast({
                  text: "Delete failure!",
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.showToast({
                text: "Delete failure!",
                type: "error"
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.search {
  width: 240px;
  flex: none;
  margin-top: 16px;
}
</style>
