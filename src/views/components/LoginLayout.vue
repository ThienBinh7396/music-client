<template>
<v-app>
    <v-app-bar class="px-4 py-3 align-center" id="core-app-bar" absolute color="transparent" app height="58" dark prominent style="color:#fff" elevation="0">
        <v-toolbar-title class="text-capitalize" v-if="responsive >= 2">{{ type == '' ?  title : 'Admin' }}</v-toolbar-title>

        <v-spacer />

        <div class="flex-grow-1"></div>

        <v-btn class="mr-4 background-transparent " :style="{'font-size' : responsive >= 2 ? '14px' : '12px'}" active-class="active" :to="type + '/login'" min-height="48" elevation="0">
            <v-icon :size="responsive >= 2 ? 20 : 16" class="mr-1">mdi-fingerprint</v-icon>
            Login
        </v-btn>

        <v-btn class="background-transparent " :style="{'font-size' : responsive >= 2 ? '14px' : '12px'}" active-class="active" :to="type + '/register'" min-height="48" elevation="0">
            <v-icon :size="responsive >= 2 ? 20 : 16" class="mr-1">mdi-account-multiple-plus</v-icon>
            Register
        </v-btn>
    </v-app-bar>
    <v-img class="absolute" gradient="to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)" :src="background[title]" width="100vw" height="100vh"></v-img>
    <perfect-scrollbar class="max-view-height max-view-width">
        <v-content class="min-full-view-height">
            <v-container>

                <v-row>
                    <v-col cols="11" lg="4" sm="6" class="ma-auto px-4">
                        <material-card color="success" class="lightColor ">
                            <template v-slot:header>
                                <div class="width-100 text-center pa-4">

                                    <h4 class=" font-weight-bold mb-2 text-capitalize">{{ title }}</h4>
                                    <div class="mt-6">
                                        <v-btn class="background-transparent" elevation="0">

                                            <v-icon>mdi-email</v-icon>
                                        </v-btn>
                                        <v-btn class="background-transparent" elevation="0">

                                            <v-icon>mdi-gmail</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </template>

                            <div class="text-center grey--text body-2 font-weight-light fs-12">
                                Or Be Classical
                            </div>
                            <div class="pa-4">
                                <transition name="transition">
                                    <v-form class="light-theme" ref="form">
                                        <v-text-field v-if="title == 'register'" v-model="name" label="Name..." class=" theme--light mb-2" prepend-icon="mdi-face" color="purple" light type="text" ref="name" :rules="nameRules" required />
                                        <v-text-field v-model="email" name="email" label="Email..." class=" theme--light mb-2" prepend-icon="mdi-email" color="purple" light type="email" ref="email" :rules="emailRules" required />
                                        <v-text-field v-model="password" name="password" label="Password..." class=" theme--light mb-4" prepend-icon="mdi-lock" color="purple" light :type="showPassword ? 'text': 'password'" :rules="passwordRules" :append-icon="showPassword ? 'mdi-eye': 'mdi-eye-off'" @click:append="showPassword = !showPassword" ref="password" />

                                        <v-text-field v-if="title == 'register' && type != ''" v-model="address" label="Address..." class=" theme--light mb-2" prepend-icon="mdi-map-marker" color="purple" light type="text" ref="address" :rules="addressRules" required />
                                        <v-text-field v-if="title == 'register'  && type != ''" v-model="phone" label="Phone..." class=" theme--light mb-2" prepend-icon="mdi-phone" color="purple" light type="text" ref="phone" :rules="phoneRules" required />

                                        <v-btn class="mt-6" color="success" text rounded large @click="submit">{{ title == 'login' ? `Let 's go` : 'Submit' }}</v-btn>
                                    </v-form>
                                </transition>
                            </div>
                        </material-card>
                    </v-col>
                </v-row>
                <v-dialog v-model="dialog" hide-overlay persistent width="300">
                    <v-card color="success" dark>
                        <v-card-text>
                            Logging....
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-container>
        </v-content>
    </perfect-scrollbar>
</v-app>
</template>

<script>
/* eslint-disable */

import axios from 'axios';

import "@/assets/css/main.css";

import {
    mapState,
    mapMutations
} from 'vuex'

export default {
    data() {
        return {
            dialog: false,
            title: "login",
            showPassword: false,
            name: '',
            nameRules: [
                v => !!v || 'Username is required',
            ],
            phone: '',
            phoneRules: [
                v => !!v || 'Phonenumber is required',
            ],
            address: '',
            addressRules: [
                v => !!v || 'Address is required',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail is invalid',
            ],
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
                v => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/.test(v) || 'Passwords must be at least 6 characters. It must include numbers and letters.',
            ],
            type: '',
            background: {
                login: 'https://res.cloudinary.com/do1xjyyru/image/upload/c_scale,q_40,w_1290/v1569172948/public/login.d6d3bb09_nvbklr.jpg',
                register: 'https://res.cloudinary.com/do1xjyyru/image/upload/c_scale,q_46,w_1126/v1569173047/public/0l0kzYB_p1yaxv.jpg'
            },
            instance: axios.create({
                //baseURL: 'http://localhost:3000/api/'
                baseURL: 'https://my-music-serve.herokuapp.com/api/'
            }),
            intervalToken: null

        };
    },
    computed: {
        ...mapState('app', ['responsive']),
    },
    methods: {
        ...mapMutations('app', ['setResponsive', 'showToast']),
        handlerToken: function () {
            if (this.type == '') {
                this.$router.push('/home')
            } else {
                this.$router.push('/admin')
            }

        },
        onResponsiveInverted() {
            this.setResponsive(window.innerWidth);

        },
        checkPath: function () {
            let path = this.$route.path.split('/');

            this.type = path[0] == "admin" || path[1] == "admin" ? "/admin" : "";

            this.title = path[path.length - 1];

        },
        submit: function () {
            let that = this;
            if (this.$refs.form.validate()) {
                this.dialog = true;

                if (this.title == 'login') {
                    this.instance.post(`${this.type == '' ? 'client/users' : 'admin/employees'}/checkLogin`, {
                            email: this.email,
                            password: this.password
                        })
                        .then(res => {
                            that.dialog = false;

                            let {
                                data
                            } = res;

                            if (data.type == "success") {
                                console.log(that.type);
                                if (that.type == '') {
                                    localStorage.setItem('_u', data.response.u);
                                    localStorage.setItem('_t', data.response.token);

                                    this.$router.push('/');
                                } else {
                                    localStorage.setItem('_a', data.response.u);
                                    localStorage.setItem('_atk', data.response.token);

                                    this.$router.push('/admin');
                                }

                            } else {
                                this.showToast({
                                    text: `${data.message}!`,
                                    type: 'error'
                                })

                            }
                        })
                        .catch(err => {
                            that.dialog = false;

                            this.showToast({
                                text: "Login faild!",
                                type: 'error'
                            })

                            console.log(err);
                        })

                } else {

                    this.instance.post(`${this.type != '' ? 'admin/employees' : 'client/users'}/register`, {
                            email: this.email,
                            password: this.password,
                            name: this.name
                        })
                        .then(res => {
                            that.dialog = false;

                            let {
                                data
                            } = res;

                            if (data.type == "success") {

                                this.showToast({
                                    text: `${data.message}!`,
                                    type: 'success'
                                })

                                this.$router.push(`${this.type == '' ? '/login' : '/admin/login'}`);
                            } else {
                                this.showToast({
                                    text: `${data.message}!`,
                                    type: 'error'
                                })

                            }
                        })
                        .catch(err => {
                            that.dialog = false;

                            this.showToast({
                                text: "Register faild!",
                                type: 'error'
                            })

                            console.log(err);
                        })
                }

            } else {
                this.showToast({
                    text: "Fill required field!",
                    type: 'error'
                })

            }
        }
    },
    watch: {
        '$route'(val) {
            this.checkPath();
        }
    },
    created() {
        this.checkPath();

    },
    mounted() {
        var that = this;

        this.onResponsiveInverted();
        window.addEventListener('resize', this.onResponsiveInverted)

        if (this.intervalToken) {
            console.log("xxx");
            window.clearInterval(this.intervalToken);

            this.intervalToken = null;
        }

        this.intervalToken = setInterval(function () {
            console.log(this.type);

            that.instance.post(`${that.type == "/admin" ? 'admin/employees' : 'client/users'}/checkToken`, {
                token: localStorage.getItem(`${that.type == '' ? '_t' : '_atk'}`),
                store: localStorage.getItem(`${that.type == '' ? '_t' : '_atk'}`),
                user: localStorage.getItem(`${that.type == '' ? '_u' : '_a'}`)
            }).then(rs => {
                let {
                    data
                } = rs;

                if (data.type == 'success') {
                    that.$router.push(`${that.type == "/admin" ? '/admin' : '/'}`);
                }
                console.log(data);
            }).catch(err => {})

        }, 5000)

    },
    beforeDestroy() {
        if (this.intervalToken) {
            console.log("yyy");
            window.clearInterval(this.intervalToken);

            this.intervalToken = null;
        }

        window.removeEventListener('resize', this.onResponsiveInverted)
    },
};
</script>

<style>
.active:before {
    opacity: 0.24 !important;
}
</style>
