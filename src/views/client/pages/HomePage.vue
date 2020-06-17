<template>
<v-container class="pa-4 text-left">
    <div class="relative slide-container">
        <hooper @slide="updateCarousel" :wheelControl="false" class="slide-show" ref="carousel" :playSpeed="5000" :autoPlay="true" :infiniteScroll="true">
            <slide v-for="(item, index) in slide" :key="index" style="width: 100%">
                <v-img :src="item.img" :lazy-src="imagePlaceholder" aspect-ratio="1.7" width="100%" class="ma-auto" max-height="280"></v-img>
            </slide>

            <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
        <hooper class="width-auto height-auto  absolute " :wheelControl="false" id="navigation-slide" :itemsToSlide="4" v-if="responsive >= 2">
            <slide v-for="(item, index) in slide" :key="index" class="ma-2 width-auto cursor-pointer navigation-slide-item" :class="{active: currentSlideIndex == index}">
                <v-img :src="item.img" aspect-ratio="1" width="56" height="56" @click="cSlideTo(index + 1)"></v-img>
            </slide>

        </hooper>
    </div>


    <section class="tb-playlist-categories">
        <h5 class="mt-10 mb-0 text---blurColor">Featured</h5>
        <h2 class="mb-2 text---lightColor">Category</h2>
        <div class="mt-5">
            <v-row>
                <v-col cols="12" :md="loadingPlaylistCategories ? 4 : 12">
                    <v-boilerplate :loading="loadingPlaylistCategories" :style="{width: loadingPlaylistCategories? '240px' : 'auto'}" class="elevation-0" type="image, list-item-two-line">
                        <v-skeleton-loader height="160" type="heading" class="elevation-0">
                            <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation px-1">
                                <slide v-for="(item, index) in playListCategories" :key="`_pC-${index}`">
                                    <v-card class="ma-1 mr-3 pa-4" elevation="4" :to="`/playlistCategory/${getUrlPlaylistCategory(item)}`">
                                        <div class=" pb-0">
                                            <div class="icon-playlist-category relative" :style="{background: item.color}">
                                                <div class="wrapper-gradient">

                                                </div>
                                                <svg class="mt-12" width="60" height="60" viewBox="0 0 80 81" xmlns="http://www.w3.org/2000/svg">
                                                    <title>Playlist Icon</title>
                                                    <path d="M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z" fill="currentColor" fill-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <div class="text-truncate fs-16 mt-4 text---lightColor">{{item.title}}</div>
                                        <div class="fs-13 text---darkColor" v-if="item.userPlaylist == 0">By <span class="hearts show">admin</span></div>

                                    </v-card>
                                </slide>
                                <hooper-navigation slot="hooper-addons"></hooper-navigation>
                            </hooper>
                        </v-skeleton-loader>

                    </v-boilerplate>
                </v-col>
                <v-col cols="12" v-if="loadingPlaylistCategories" :md="loadingPlaylistCategories ? 4 : 12">
                    <v-boilerplate  :style="{width: loadingPlaylistCategories? '240px' : 'auto'}" class="elevation-0" type="image, list-item-two-line" />
                </v-col>
                <v-col cols="12" v-if="loadingPlaylistCategories" :md="loadingPlaylistCategories ? 4 : 12">
                    <v-boilerplate  :style="{width: loadingPlaylistCategories? '240px' : 'auto'}" class="elevation-0" type="image, list-item-two-line" />
                </v-col>
            </v-row>

        </div>
    </section>


    <div v-for="(item, index) in randomPlaylistCategory" :key="`pc-${index}`" class="mt-10">
        <section :class="`tb-playlist-category-${index}`">
            <h2 class=" text---lightColor">{{item.title}}</h2>
            <h4 class="mb-0 text---lessDarkColor" v-if="item.description">{{item.description}}</h4>

            <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation mt-4 px-1">
                <slide v-for="(pCategory, i) in item.Playlists" :key="`_pCI-${i}`">

                    <v-card class="ma-1 mr-3 pb-4" elevation="4">

                        <div class="pb-0 tb-playlist-control" @click="playPlaylist(pCategory)">
                            <div class="image">
                                <v-img :src="pCategory.thumbnail" :lazy-src="imagePlaceholder" aspect-ratio="1.7" class="ma-auto" height="180"></v-img>
                            </div>
                            <div class="tb-playlist-control-icon" :class="{show: playlistId == pCategory.id}">
                                <div class="tb-content">
                                    <music-playing-icon :color="'#fff'" v-if="playlistId == pCategory.id && playing" width="22" />
                                    <v-icon size="32" v-else>mdi-play</v-icon>
                                </div>
                            </div>
                        </div>
                        <div class="card-content px-2 mt-1">
                            <div class="text-truncate fs-17 text---lightColor tb-link" @click="toPlaylist(`/playlist/${mBtoa(pCategory.id)}`)">{{pCategory.title}}</div>
                            <div class="fs-14 text---blurColor text-truncate">{{pCategory.description ? pCategory.description : 'Empty'}} </div>
                        </div>
                    </v-card>
                </slide>
                <hooper-navigation slot="hooper-addons"></hooper-navigation>
            </hooper>
        </section>
    </div>

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
} from 'vuex'

import LongClick from '@/components/LongClick';

export default {
    components: {
        Hooper,
        Slide,
        HooperNavigation,
        'long-click': LongClick,
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
            currentSlideIndex: 1,
            color: ['rgb(245, 155, 35)', 'rgb(160, 195, 210)', 'rgb(180, 155, 200)', 'rgb(80, 155, 245)', 'rgb(245, 115, 160)', 'rgb(140, 25, 50)', 'rgb(255, 100, 55)', 'rgb(160, 195, 210)'],
            slide: [{
                    img: 'https://res.cloudinary.com/do1xjyyru/image/upload/v1569003153/public/maxresdefault_yy1m6c.jpg'
                },
                {
                    img: 'https://res.cloudinary.com/do1xjyyru/image/upload/v1569003136/public/33407531_1866368013407293_4406203250999558144_n.jpg_f0uyzq.jpg'
                },
                {
                    img: 'https://res.cloudinary.com/do1xjyyru/image/upload/v1569003113/public/maxresdefault_akjohy.jpg'
                },
                {
                    img: 'https://res.cloudinary.com/do1xjyyru/image/upload/v1569003099/public/maxresdefault_e2fec6.jpg'
                }
            ],
            playList: [{
                    img: 'https://img2.thuthuatphanmem.vn/uploads/2018/12/25/nhung-hinh-anh-gai-xinh-cuc-dep_012909400.jpg'
                },
                {
                    img: 'https://img2.thuthuatphanmem.vn/uploads/2019/01/04/cac-hinh-anh-gai-dep_025102216.jpg'
                },
                {
                    img: 'https://i2.wp.com/photo-1-baomoi.zadn.vn/w1000_r1/2018/09/03/149/27558213/8_98889.jpg?w=696&ssl=1'
                },
                {
                    img: 'http://file.vforum.vn/hinh/2018/02/top-nhung-hinh-anh-gai-dep-gai-xinh-nhat-hien-nay-17.png'
                },
                {
                    img: 'https://hinhanhdep.net/wp-content/uploads/2017/03/girl-xinh-han-quoc-4.jpg'
                }
            ],
            loadingPlaylistCategories: false,
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

        }
    },
    computed: {
        ...mapState('app', ['axiosInstance', 'responsive', 'imagePlaceholder', 'playListCategories']),
        ...mapState('musics', ['playlistId', 'playing']),
        randomPlaylistCategory: function () {
            return this.playListCategories;
        }
    },
    created() {
        this.init();
    },
    methods: {
        ...mapMutations('app', ['showToast', 'setPlayListCategories']),
        ...mapMutations('musics', ['setPlaying', 'setPlayList', 'setPlaylistId', 'setMusicByIndex']),
        init: function () {
            if(this.playListCategories.length == 0){
                this.loadPlaylistCategories();
            }
        },
        loadPlaylistCategories: function(){
            this.loadingPlaylistCategories = true;
            
            this.axiosInstance.post('/client/playlistCategory/find', {
                    random: true,
                    limit: -1
                })
                .then(rs => {
                    this.setPlayListCategories(rs.data.response.map(it => {
                        it.color = this.color[parseInt(Math.random() * this.color.length)];

                        return it;
                    }));

                    this.loadingPlaylistCategories = false;
                    console.log(this.playListCategories);

                })
                .catch(err => {
                    console.log(err);
                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong'
                    })
                })

        },
        mBtoa: function (str) {
            try{
                return btoa(str);
            }catch{
                return ''
            }

        },
        playPlaylist: function (item) {
            if (item.id == this.playlistId) {
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
        toPlaylist: function (href) {
            this.$router.push(href);
        },
        getUrlPlaylistCategory: function (item) {
            let data ={
                id: item.id
            };

            return btoa(JSON.stringify(data));
        },
        longPress: function () {
            alert("Long")
        },
        shortPress: function () {
            alert("Short")
        },
        updateCarousel: function (payload) {
            this.currentSlideIndex = payload.currentSlide;
        },
        cSlideTo: function (index) {
            console.log("Index: " + index);
            this.currentSlideIndex = index;
            this.$refs.carousel.slideTo(this.currentSlideIndex - 1);
        }
    }
}
</script>

<style lang="scss" scoped>
.slide-container {
    overflow: hidden;

    #navigation-slide {
        bottom: 18px;
        right: 30px;
        transform: translateY(120%);
        transition: 0.35s;
    }

    &:hover #navigation-slide {
        transform: translateY(0);
    }

    @media screen and (max-width: 600px) {
        #navigation-slide {
            transform: translateY(0);
        }

    }

}

.navigation-slide-item {
    border: 2px solid transparent;

}

.navigation-slide-item.active {
    border: 2px solid;
}

.icon-playlist-category {
    width: 100%;
    min-height: 160px;
    line-height: 160px;
    text-align: center;
}

.wrapper-gradient {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    background: linear-gradient(0deg, transparent, rgba(0, 0, 0, .4));
}
</style>
