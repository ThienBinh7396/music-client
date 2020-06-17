<template>
<v-container class="pa-8 pt-4 text-left">
    <v-row>
        <v-col cols="12">
            <loading-icon w="100" margin="100px auto 0" v-if="loadingSinger"></loading-icon>
            <div v-if="!loadingSinger">
                <div class="singer-header ">
                    <v-img :src="singer ? singer.bannerHref : '/img/banner-placeholder.png'" min-height="180px" max-height="200px" lazy-src="/img/background-placeholder.png"></v-img>
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex my-3 align-center">
                            <v-img class="rounded flex-none" width="52" aspect-ratio="1" :src="singer && singer.thumbnail ? singer.thumbnail : '/img/placeholder.png'"></v-img>
                            <div class="ml-2 d-inline-block">
                                <div class="fs-14">{{ singer ? singer.name : '' }}</div>
                                <div class="fs-13 text---blurColor">{{ singer ? `${JSON.parse(singer.followers).length} followers` : '' }}</div>
                            </div>
                        </div>
                        <div class="pr-4">
                            <v-btn @click="follows" :color="checkFollow() >=0 ? '#1fb525' : ''">
                                <v-icon v-if="!following">mdi-account-check</v-icon>
                                <v-progress-circular width="2" size="18" indeterminate v-if="following" color="#dedede"></v-progress-circular>
                                {{checkFollow() >= 0 ?  'Following' : 'Follow'}}
                            </v-btn>
                        </div>
                    </div>
                </div>
                <h2 class="mb-3">Information</h2>
                <div v-html="singer ? singer.information : ''" class="fs-14 text---lessDarkColor"></div>
            </div>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex'
export default {
    data() {
        return {
            singer: null,
            loadingSinger: false,
            following: false
        }

    },
    computed: {
        ...mapState('app', ['axiosInstance', 'user', 'imagePlaceholder']),
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        this.init();
    },
    methods: {
        ...mapMutations('app', ['showToast']),
        init: function () {
            try {
                let data = JSON.parse(atob(this.$route.params.data));

                let id = data.singerId;

                this.loadingSinger = true;

                this.axiosInstance.post('/client/singer/findById', {
                        id: id
                    })
                    .then(rs => {
                        let {
                            data
                        } = rs;

                        if (data.type == 'error') {
                            this.$router.push('/home');

                            this.showToast({
                                type: 'error',
                                text: 'Something went wrong. Try again!'
                            })
                        } else {
                            this.singer = data.response;

                            this.loadingSinger = false;
                        }

                    })

            } catch (error) {
                this.showToast({
                    type: 'error',
                    text: 'Url is invalid!'
                });
                this.$router.push('/home');
                return;
            }

        },
        follows: function () {
            let followers = JSON.parse(this.singer.followers);

            if (this.checkFollow() >= 0) {
                followers.splice(this.checkFollow(), 1);
            } else {
                followers.push(this.user.id);
            }
            this.following = true;

            this.axiosInstance.post(`/client/singer/edit`, {
                    id: this.singer.id,
                    followers: JSON.stringify(followers)
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    if (data.type == 'success') {
                        this.singer = data.response;
                    }
                    this.following = false;
                })
        },
        checkFollow: function () {
            return JSON.parse(this.singer.followers).findIndex(it => it == this.user.id);
        }
    },
}
</script>

<style>

</style>
