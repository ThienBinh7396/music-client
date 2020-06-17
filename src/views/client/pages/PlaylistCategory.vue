<template>
<v-container class="pa-6 text-left" style="min-height: 100vh;" >
    <v-row>
        <v-col cols="12">
            <div class="display-3 tb-title">{{playlistCategory.title}}</div>
            <div class="text---darkColor ml-1 mt-2" v-if="playlistCategory.description">{{playlistCategory.description}}</div>
            <section class="tb-playlist-categories">
                <div class="mt-6">
                    <v-boilerplate :loading="loadingPlaylist" :style="{width: loadingPlaylist ? '260px' : 'auto'}" class="elevation-0" type="image, list-item-two-line">

                        <v-skeleton-loader height="160" type="heading" class="elevation-0">
                            <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation px-1">
                                <slide v-for="(item, index) in playlistCategory.Playlists" :key="`_pC-${index}`">
                                    <v-card class="ma-1 mr-3 pb-4" elevation="4">

                                        <div class="pb-0 tb-playlist-control">
                                            <div class="image">
                                                <v-img :src="item.thumbnail" :lazy-src="imagePlaceholder" aspect-ratio="1.7" class="ma-auto" height="180"></v-img>
                                            </div>
                                            <div class="tb-playlist-control-icon" :class="{show: playlistId == item.id}" @click="playPlaylist(item)">
                                                <div class="tb-content">
                                                    <music-playing-icon :color="'#fff'" v-if="playlistId == item.id && playing" width="22" />
                                                    <v-icon size="32" v-else>mdi-play</v-icon>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-content px-2 mt-1">
                                            <div class="text-truncate fs-17 mt-4 text---lightColor tb-link" @click="toPlaylist(`/playlist/${mBtoa(item.id)}`)">{{item.title}}</div>
                                            <div class="fs-13 text---blurColor text-truncate">{{item.description ? item.description : 'Empty'}} </div>
                                        </div>
                                    </v-card>
                                </slide>
                                <hooper-navigation slot="hooper-addons"></hooper-navigation>
                            </hooper>
                        </v-skeleton-loader>
                    </v-boilerplate>

                </div>
            </section>
        </v-col>
         <v-col cols="12" class="mt-8">
            <v-boilerplate :loading="loadingRandomCategory" :style="{width: loadingRandomCategory ? '260px' : 'auto'}" class="elevation-0" type="image, list-item-two-line">

                <v-skeleton-loader height="160" type="heading" class="elevation-0">

                    <div v-for="(item, index) in randomPlaylistCategory" :key="`pc-${index}`" class="mt-10">
                        <section :class="`tb-playlist-category-${index}`">
                            <h2 class=" text---lightColor">{{item.title}} <span class="text---blurColor">(Random list)</span></h2>

                            <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation mt-4 px-1">
                                <slide v-for="(pCategory, i) in item.Playlists" :key="`_pCI-${i}`">

                                    <v-card class="ma-1 mr-3 pb-4" elevation="4">

                                        <div class="pb-0 tb-playlist-control">
                                            <div class="image">
                                                <v-img :src="pCategory.thumbnail" :lazy-src="imagePlaceholder" aspect-ratio="1.7" class="ma-auto" height="180"></v-img>
                                            </div>
                                            <div class="tb-playlist-control-icon" :class="{show: playlistId == pCategory.id}" @click="playPlaylist(pCategory)">
                                                <div class="tb-content">
                                                    <music-playing-icon :color="'#fff'" v-if="playlistId == pCategory.id && playing" width="22" />
                                                    <v-icon size="32" v-else>mdi-play</v-icon>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-content px-2 mt-1">
                                            <div class="text-truncate fs-17 mt-4 text---lightColor tb-link" @click="toPlaylist(`/playlist/${mBtoa(pCategory.id)}`)">{{pCategory.title}}</div>
                                            <div class="fs-13 text---blurColor text-truncate">{{pCategory.description ? pCategory.description : 'Empty'}} </div>
                                        </div>
                                    </v-card>
                                </slide>
                                <hooper-navigation slot="hooper-addons"></hooper-navigation>
                            </hooper>
                        </section>
                    </div>
                </v-skeleton-loader>
            </v-boilerplate>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapMutations,
    mapState
} from 'vuex';

import {
    Hooper,
    Slide,
    Navigation as HooperNavigation
} from 'hooper';
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
            color: ['rgb(245, 155, 35)', 'rgb(160, 195, 210)', 'rgb(180, 155, 200)', 'rgb(80, 155, 245)', 'rgb(245, 115, 160)', 'rgb(140, 25, 50)', 'rgb(255, 100, 55)', 'rgb(160, 195, 210)'],
            hooperSettings: {
                itemsToShow: 1,
                breakpoints: {
                    576: {
                        itemsToShow: 2
                    },
                    800: {
                        itemsToShow: 3
                    },
                }
            },
            playlistCategory: {
                id: -1,
                title: '',
                description: '',
                Playlists: []
            },
            loadingPlaylist: true,
            randomPlaylistCategory: [],
            loadingRandomCategory: true
        }
    },
    created() {

        try {
            this.playlistCategory = JSON.parse(atob(this.$route.params.data));

            this.init();

        } catch (error) {

            this.showToast({
                type: 'error',
                text: 'Url is invalid'
            });
            this.$router.push('/home');
        }
    },
    computed: {
        ...mapState('app', ['axiosInstance', 'imagePlaceholder']),
        ...mapState('musics', ['playing', 'playlistId']),
    },
    methods: {
        ...mapMutations('app', ['showToast']),
        ...mapMutations('musics', ['setPlaying', 'setPlayList', 'setMusicByIndex', 'setPlaylistId']),
        init: function () {
            this.axiosInstance.post('/client/playlistCategory/findById', {
                    id: this.playlistCategory.id
                })
                .then(res => {
                    let {
                        data
                    } = res;
                    this.playlistCategory = data.response;
                    this.loadingPlaylist = false;
                })
                .catch(() => {
                    this.showToast({
                        type: 'error',
                        text: `Url is invalid`
                    });

                    this.$router.push('/home');

                })

            this.axiosInstance.post('/client/playlistCategory/find', {
                    random: true,
                    limit: 2
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.randomPlaylistCategory = data.response.filter(it => it.id != this.playlistCategory.id);

                    this.loadingRandomCategory = false;
                })
        },
         playPlaylist: function (item) {
               if(item.id == this.playlistId){
                this.setPlaying(!this.playing);
                return;
            }

            this.setPlaying(false);
            this.setPlayList([])
            this.axiosInstance.post('client/music/findInList', {
                    list: item.musics.map(it => it.id)
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.setPlayList(data.response);

                    this.setPlaylistId(item.id);
                    this.setPlaying(true);

                    if (data.response.length != 0) {
                        this.setMusicByIndex(0);
                    }
                })
        },
        mBtoa: function (str) {
            return btoa(str);
        },
        toPlaylist: function (href) {
            this.$router.push(href);
        },
    }
}
</script>

<style lang="scss" scoped>
.tb-title {
    line-height: 56px;
    padding-top: 80px;
}
</style>
