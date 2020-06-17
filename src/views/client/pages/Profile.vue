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
            <div class="description text-center px-6" v-if="tempUser.description">
              ❛
              <span class="text---lessDarkColor">{{tempUser.description }}</span>❟
            </div>
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
                <v-btn
                  color="#0b64bbe8"
                  :loading="isUpdating"
                  @click="updateInformation()"
                >Update profile</v-btn>
              </v-col>
            </v-row>
          </form>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="card-edit-info px-4 py-4">
          <h3>Update Password</h3>
          <form class="mt-4">
            <v-text-field
              v-model="userPassword.oldValue"
              label="Old Password..."
              class="theme--light mb-4"
              :color="tempUser.color"
              :type="userPassword.showOldPassword ? 'text': 'password'"
              :rules="userPassword.rule"
              :append-icon="userPassword.showOldPassword ? 'mdi-eye': 'mdi-eye-off'"
              @click:append="userPassword.showOldPassword = !userPassword.showOldPassword"
            />
            <v-text-field
              v-model="userPassword.value"
              label="New Password..."
              class="theme--light mb-4"
              :color="tempUser.color"
              :type="userPassword.showNewPassword ? 'text': 'password'"
              :rules="[...userPassword.rule, 
              v => (!!v && v !== userPassword.oldValue )|| `New password must be different from old password!`]"
              :append-icon="userPassword.showNewPassword ? 'mdi-eye': 'mdi-eye-off'"
              @click:append="userPassword.showNewPassword = !userPassword.showNewPassword"
            />
            <v-btn color="#dc6d0e" :loading="userPassword.isUpdating" @click="updatePassword">Change password</v-btn>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import { mask } from "vue-the-mask";

export default {
  directives: {
    mask
  },
  data() {
    return {
      menu: false,
      mask: "!#XXXXXXXX",
      isUpdating: false,
      tempUser: {
        color: "#1976D2FF",
        banner: "/img/temp-banner-user.jpg",
        address: "",
        name: "",
        email: "",
        description: "xxx"
      },
      userPassword: {
        isUpdating: false,
        value: "",
        showNewPassword: false,
        oldValue: "",
        showOldPassword: false,
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
    ...mapState("app", ["user", "axiosInstance"]),
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
    ...mapMutations("app", ["showToast", "setUser"]),
    updateInformation: function() {
      if (this.isUpdating) return;

      this.isUpdating = true;

      this.axiosInstance
        .post("/client/users/updateUser", {
          id: this.user.id,
          ...this.tempUser
        })
        .then(rs => {
          let { type, response, message } = rs.data;
          if (type === "success") {
            this.setUser({
              ...this.user,
              name: response.name,
              thumbnail: response.thumbnail
            });
            this.updateTempUser(response);
          }

          this.showToast({
            type,
            text: message
          });
          this.isUpdating = false;
        })
        .catch(() => {
          this.showToast({
            type: "error",
            text: "Update information faild!"
          });
          this.isUpdating = false;
        });
    },
    updatePassword: function() {
      if (this.userPassword.isUpdating) return;

      this.userPassword.isUpdating = true;

      if (!this.userPassword.oldValue || !this.userPassword.value) {
        this.showToast({
          type: "error",
          text: "Type password!"
        });
        return;
      }
      if (this.userPassword.oldValue === this.userPassword.value) {
        this.showToast({
          type: "error",
          text: "New password must be different from old password!"
        });
        return;
      }

      this.axiosInstance.post("/client/users/updatePassword", {
        oldPassword: this.userPassword.oldValue,
        newPassword: this.userPassword.value
      })
      .then(rs => {
        const {type, message} = rs.data;

        if(type === 'success'){
          this.userPassword.oldValue = ''
          this.userPassword.value = ''
        }

        this.showToast({
          type,
          text: message
        })

        this.userPassword.isUpdating = false
      })
      .catch(() => {
        this.showToast({
          type: 'error',
          text: 'Update password faild!'
        })

        this.userPassword.isUpdating = false
      });
    },
    updateTempUser: function(val) {
      if (val) {
        Object.keys(this.tempUser).forEach(key => {
          if (val[key]) this.tempUser[key] = val[key];
        });
      }
    }
  },
  mounted() {
    this.updateTempUser(this.user);
  }
};
</script>
