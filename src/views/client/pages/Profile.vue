<template>
  <v-container class="pa-4 text-left">
    <v-row class="flex-sm-row-reverse">
      <v-col cols="12" md="5">
        <v-card class="card-user">
          <div class="update-image">
            <v-img
              :src="tempUser.banner ?tempUser.banner :'/img/temp-banner-user.jpg' "
              width="100%"
            />
          </div>
          <div class="user-infor-drawer">
            <div class="image mt-0">
              <img
                :src="user ? user.thumbnail : '/img/placeholder.png'"
                lazy-src="/img/placeholder.png"
              />
            </div>
            <div class="greeting">{{tempUser.name}}</div>
            <div
              class="description text-center px-6"
              v-if="tempUser.description"
            >"{{tempUser.description }}"</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card class="card-edit-info px-4 py-4">
          <h3>Edit Profile</h3>
          <form class="mt-4">
            <v-row>
              <v-col cols="12" md="6" class="py-0">
                <div class="simple-form-control">
                  <div class="simple-form-label">
                    <label for="information">Username:</label>
                  </div>
                  <v-text-field
                    outlined
                    solo
                    class="simple-form-input"
                    :color="tempUser.color"
                    v-model="tempUser.name"
                    label="Username..."
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <div class="simple-form-control">
                  <div class="simple-form-label">
                    <label for="information">Color:</label>
                  </div>
                  <v-text-field
                    outlined
                    solo
                    v-mask="mask"
                    hide-details
                    class="simple-form-input"
                    :color="tempUser.color"
                    v-model="tempUser.color"
                    name="color"
                    label="Color..."
                  >
                    <template v-slot:append>
                      <v-menu
                        v-model="menu"
                        top
                        nudge-bottom="105"
                        nudge-left="16"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <div :style="swatchStyle" v-on="on" />
                        </template>
                        <v-card>
                          <v-card-text class="pa-0">
                            <v-color-picker v-model="tempUser.color" flat />
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <div class="simple-form-control">
                  <div class="simple-form-label">
                    <label for="information">Address:</label>
                  </div>
                  <v-text-field
                    outlined
                    solo
                    class="simple-form-input"
                    :color="tempUser.color"
                    v-model="tempUser.address"
                    name="address"
                    label="Address..."
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <div class="simple-form-control">
                  <div class="simple-form-label">
                    <label for="information">Email:</label>
                  </div>
                  <v-text-field
                    outlined
                    solo
                    class="simple-form-input"
                    disabled
                    :color="tempUser.color"
                    :value="tempUser.email"
                    name="address"
                    label="Email..."
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="py-0">
                <div class="simple-form-control">
                  <div class="simple-form-label">
                    <label for="information">Description:</label>
                  </div>
                  <v-textarea
                    filled
                    solo
                    :color="tempUser.color"
                    v-model="tempUser.description"
                    name="description"
                    label="Write something about you..."
                  ></v-textarea>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mt-6">
                <v-btn color="#0b64bbe8" @click="update()">Update profile</v-btn>
              </v-col>
            </v-row>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

import { mask } from "vue-the-mask";

export default {
  directives: {
    mask
  },
  data() {
    return {
      menu: false,
      mask: "!#XXXXXXXX",
      tempUser: {
        color: "#1976D2FF",
        banner: "/img/temp-banner-user.jpg",
        address: "",
        name: "",
        description: "xxx",
        email: ""
      },
      userPassword: {
        value: "",
        type: "password",
        rule: [
          v => !!v || "Password is required",
          v =>
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/.test(v) ||
            "Passwords must be at least 6 characters. It must include numbers and letters."
        ]
      }
    };
  },
  computed: {
    ...mapState("app", ["user"]),
    swatchStyle: function() {
      const { menu } = this;
      return {
        backgroundColor: this.tempUser.color
          ? this.tempUser.color
          : "#1976D2FF",
        cursor: "pointer",
        height: "22px",
        width: "22px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out"
      };
    }
  },
  watch: {
    user: function(val) {
      this.updateTempUser(val);
    }
  },
  methods: {
    updateTempUser: function(val) {
      if (val) {
        Object.keys(val).forEach(it => {
          this.tempUser[it] = val[it];
        });
      }
    }
  },
  mounted() {
    this.updateTempUser(this.user);
  }
};
</script>
