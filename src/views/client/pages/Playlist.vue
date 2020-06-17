<template>
<v-container class="pa-8 text-left">
    <v-row>
        <v-col cols="12">
            <loading-icon w="100" margin="120px auto 0" v-if="loading"></loading-icon>

            <div v-if="!loading">
                <v-row class="mt-4">
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="3">
                                <div class="pb-0 tb-playlist-control no-scale">
                                    <v-img :src="playlist.thumbnail" :lazy-src="imagePlaceholder" aspect-ratio="1" class="ma-auto"></v-img>
                                    <div class="tb-playlist-control-icon" :class="{show: playlistId == playlist.id}" @click="playPlaylist">
                                        <div class="tb-content">
                                            <music-playing-icon :color="'#fff'" v-if="playlistId == playlist.id && playing" width="22" />
                                            <v-icon size="32" v-else>mdi-play</v-icon>
                                        </div>
                                    </div>
                                </div>

                            </v-col>
                            <v-col cols="9">
                                <div class="text---lightColor font-weight-bold playlist-title">{{playlist.title}}</div>
                                <div class="fs-15 text---blurColor text-truncate">{{playlist.description ? playlist.description : 'No Description'}} </div>

                                <div class="text---lessDarkColor mt-3">{{playlist.musics.length}} musics</div>

                                <div class="d-flex mt-10">
                                    <v-btn color="#15ca15" rounded class="px-12 d-block fs-14 text-uppercase" @click="playPlaylist">
                                        <span class="d-flex align-center" v-if="playlist.id == playlistId && playing ">
                                            <v-icon size="16">mdi-pause</v-icon>&nbsp;Pause
                                        </span>
                                        <span v-else class="d-flex align-center">
                                            <v-icon size="16">mdi-play</v-icon>&nbsp;Play
                                        </span>
                                    </v-btn>

                                    <div>
                                        <v-btn icon class="mx-6" @click="like">
                                            <v-progress-circular width="2" size="18" indeterminate v-if="processing" color="primary"></v-progress-circular>
                                            <v-icon class="ld ld-heartbeat" v-if="checkLike() && !processing" color="#fb2626">mdi-heart</v-icon>
                                            <v-icon v-if="!checkLike() && !processing" color="#fcfcfc">mdi-heart-outline</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon>mdi-dots-horizontal</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-8"></v-divider>
                    </v-col>
                    <v-col cols="12">
                        <div class="music-col">
                            <div v-for="(item, index) in playlist.musics" :key="`ms-${index}`">
                                <v-hover v-slot:default="{ hover }">
                                    <div class="music-col-item d-flex" :class="{'active' : item.id == music.id}">

                                        <div class="music-col-icon" @click="playMusic(item)">
                                            <music-quaver-icon width="16" class="mt-1" color="#c1b9b9" v-if="!hover && item.id != music.id" />
                                            <v-icon v-if="hover || item.id == music.id" :color="item.id == music.id ? '#1ed760' : '#fafafa'" class="mt-n1">{{playing && item.id == music.id ? 'mdi-pause' : 'mdi-play'}}</v-icon>
                                        </div>
                                        <div class="music-col-content text-truncate pr-5">
                                            <div class="music-col-title text-truncate tb-link" @click="getLinkMusic(item.id)">{{item.title}}</div>

                                            <div class="music-col-artist fs-13 text---blurColor text-truncate">

                                                <span v-for="(artist_item, i) in item.singers.map(it => {return {name: it.name, id: it.id}})" :key="`at-${index}-${i}`">
                                                    <span class="tb-link" @click="toSinger(artist_item.id)">{{artist_item.name}}</span>
                                                    <span v-if="!(i == item.singers.length - 1)"> • </span>
                                                </span>&nbsp;&nbsp;
                                            </div>
                                        </div>
                                        <div class="music-col-control pr-5" v-if="hover">
                                            <v-btn icon class="mt-n1">
                                                <v-icon color="#ececec" size="20">mdi-dots-horizontal</v-icon>
                                            </v-btn>
                                        </div>
                                        <div class="music-col-duration  fs-15">{{formatMusicTime(item.duration)}}</div>
                                    </div>
                                </v-hover>
                            </div>
                        </div>

                    </v-col>
                </v-row>
            </div>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
/* eslint-disable */

import {
    Hooper,
    Slide,
    Navigation as HooperNavigation
} from 'hooper';
import {
    mapState,
    mapMutations
} from 'vuex';

export default {
    components: {
        Hooper,
        Slide,
        HooperNavigation,
        VBoilerplate: {
            functional: true,
            render(h, {
                data,
                props,
                children
            }) {
                return h('v-skeleton-loader', {
                    ...data,
                    props: {
                        boilerplate: true,
                        elevation: 2,
                        ...props,
                    },
                }, children)
            },
        },
    },
    data() {
        return {
            loading: true,
            playlist: {},
            processing: false
        }
    },
    computed: {
        ...mapState('app', ['axiosInstance','user', 'imagePlaceholder']),
        ...mapState('musics', ['playlistId', 'playing', 'music'])
    },
    created() {
        this.init();
    },
    methods: {
        ...mapMutations('app', ['showToast']),
        ...mapMutations('musics', ['updateControlMusic', 'playControlMusic', 'setPlaying', 'setPlayList', 'setPlaylistId', 'setMusicByIndex']),

        init: function () {
            try {
                let id = atob(this.$route.params.data);

                this.axiosInstance.post('/client/playlist/findOne', {
                        id: id
                    })
                    .then(rs => {
                        console.log(rs);
                        let {
                            data
                        } = rs;

                        if (data.type == 'error') {
                            this.$router.push('home');

                            this.showToast({
                                type: 'error',
                                text: 'Something went wrong. Try again!'
                            })
                        } else {
                            this.playlist = data.response;
                            this.loading = false;
                        }

                    })
                    .catch(err => {
                        this.$router.push('home');

                        this.showToast({
                            type: 'error',
                            text: 'Something went wrong'
                        })
                    })

            } catch (err) {
                console.log(err);

                this.showToast({
                    type: 'error',
                    text: 'Something went wrong. Try again!'
                })
                this.$router.push('/home');
            }

        },
        playMusic: function (item) {
            if (item.id == this.music.id) {
                this.updateControlMusic(item);
            } else {
                console.log("new play");
                this.playControlMusic(item);
            }
        },
        playPlaylist: function () {
            if(this.playlist.id == this.playlistId){
                this.setPlaying(!this.playing);
                return;
            }

            this.setPlaying(false);
            this.setPlayList([])
            this.axiosInstance.post('client/music/findInList', {
                    list: this.playlist.musics.map(it => it.id)
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.setPlayList(data.response);

                    this.setPlaylistId(this.playlist.id);
                    this.setPlaying(true);

                    if (data.response.length != 0) {
                        this.setMusicByIndex(0);
                    }
                })
        },
        toSinger: function (id) {
            let data = {
                singerId: id
            };
            this.$router.push(`/singer/${btoa(JSON.stringify(data))}`);
        },
        formatMusicTime: function (time) {
            let t = Number(`${time}`);

            let h = parseInt(t / 60 / 60);

            let m = parseInt((t % (60 * 60)) / 60);

            let s = parseInt(((t % (60 * 60)) % 60));

            return `${h != 0 ? `${h}:`  : ''}${m}:${formatNumber(s)}`;

        },
        getLinkMusic: function (id) {
            this.$router.push(`/music/${btoa(JSON.stringify({musicId: id}))}`);
        },
        like: function(){
            this.processing = true;
            this.axiosInstance.post('client/playlist/likePlaylist', {
                id: this.playlist.id
            })
            .then(rs => {
                let {data} = rs;
                if(data.type == 'success'){
                    this.playlist.likes = data.response;
                }
            this.processing = false;
                console.log(rs);
            })
        },
        checkLike: function(){
            return (JSON.parse(this.playlist.likes)).findIndex(it => it == this.user.id) >= 0;
        }
    }

}
</script>

<style lang="scss" scoped>
.playlist-title {
    font-size: 28px;
}
</style>
