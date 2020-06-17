<template>
<v-container class="pa-4 mt-8">
    <v-row>
        <v-dialog v-model="dialog" max-width="640">
            <v-card class=" text-left relative">
                <div class="music-header relative py-4 px-6">
                    <div class="blur-container" :style="{'background-image': `url(${showMusic ? showMusic.thumbnail : '/img/banner-music.png'})`}"></div>
                    <div class="d-flex">
                        <div class=" music-thumbnail" style="height: 160px" :class="{'show-icon': play && showMusic.id == currentMusic.id}">
                            <v-img class="flex-none tb-music-thumbnail" :class="{'play': showMusic && play && currentMusic.id == showMusic.id}" :src="showMusic ? showMusic.thumbnail : '/img/banner-music.png'" aspect-ratio="1" width="160" height="160" lazy-src="/img/banner-music.png"></v-img>
                            <div class=" music-icon" @click="switchStatus(showMusic)">
                                <v-icon v-if=" play && showMusic.id == currentMusic.id" size="21" color="indigo">mdi-pause</v-icon>
                                <v-icon v-if="!( play && showMusic.id == currentMusic.id)" size="25" color="indigo">mdi-play</v-icon>
                            </div>
                        </div>

                        <div class="music-info title pl-4 relative width-100">
                            <div class="fs-24">{{ showMusic ? showMusic.title : ''}}</div>
                            <div class="fs-15 ">{{ showMusic ? showMusic.singers.map(it => it.name).join(',') : ''}}</div>
                            <div class="fs-15 mt-2 text---darkColor">Genres: {{ showMusic ? showMusic.genres.map(it => it.title).join(',') : ''}}</div>
                            <div class="text-right statistic mt-2">
                                <v-icon>mdi-headphones</v-icon> {{showMusic ? JSON.parse(showMusic.views).length : 0}}
                                <v-icon size="19" class="ld ld-heartbeat">mdi-heart</v-icon> {{showMusic ? JSON.parse(showMusic.likes).length : 0}}

                            </div>
                        </div>

                    </div>

                </div>
                <div class="music-content py-4 px-6">

                    <h2 class="mb-3 mt-12">Lyric</h2>
                    <p class="text---blurColor">Contributed by {{showMusic ? showMusic.lyricContributed : ''}}</p>
                    <div class="music-lyric">
                        <div v-html="showMusic ? showMusic.lyric : ''" class="fs-14 text---lessDarkColor"></div>
                    </div>
                </div>
                <v-card-actions class="sticky bottom secondary pa-3 width-100">
                    <div class="flex-grow-1"></div>

                    <v-btn color="green accent-3" text @click="dialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-col cols="12">
            <material-card :offset="0" :fullWidth="false">
                <template v-slot:offset>
                    <div class="d-flex grow flex-wrap v-card--material_with_icon">
                        <v-card slot="offset" class="elevation-3 v-card--material__heading v-card--material__heading_icon transition-fast" color="indigo darken-2" dark>
                            <v-icon size="40">
                                mdi-music-note-outline
                            </v-icon>
                        </v-card>
                        <div :class="`${ responsive > 2 ? 'ml-3' : 'ml-2'}`">
                            <div class="display-5 font-weight-light transition-fast">
                                Music Tables
                            </div>
                        </div>
                        <v-btn class="mt-4" absolute right color="indigo darken-2" to="/admin/music/control/eyJ0eXBlIjoiYWRkIn0=">
                            <v-icon>mdi-plus</v-icon>Add
                        </v-btn>
                    </div>

                </template>
                <div class="audio-container ">
                    <audio :src="currentMusic.href" ref="music" @error="error"></audio>
                </div>

                <v-card-title class="pt-0 px-0">
                    <div class="flex-grow-1"></div>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" dark single-line hide-details class="search"></v-text-field>
                </v-card-title>
                <v-data-table :headers="headers" :items="musics" :search="search" :loading="loading" loading-text="Loading...Please wait">
                    <template v-slot:item.title="{item}">
                        <div style="max-width: 160px" class="text-truncate">
                            {{item.title}}
                        </div>
                    </template>
                    <template v-slot:item.duration="{item}">
                        {{formatMusicTime(item.duration)}}
                    </template>
                    <template v-slot:item.thumbnail="{ item }">
                        <div class="d-flex align-center justify-center  list-music-icon relative" style="width: 52px" @click="switchStatus(item)">
                            <v-img lazy-src="/img/music-placeholder-square.png" :src="item.thumbnail" width="56" aspect-ratio="1"></v-img>
                            <div class="icon-background" :style="{background: play && item.id == currentMusic.id ? '#1f1e1e8c' : '#2724246b'}"></div>
                            <div class="music-icon" :class="{'play': play && item.id == currentMusic.id}">
                                <v-icon v-if="play && item.id == currentMusic.id" size="21" color="darkColor">mdi-pause-circle-outline</v-icon>
                                <v-icon v-if="!(play && item.id == currentMusic.id)" size="25">mdi-play-circle-outline</v-icon>
                            </div>
                        </div>

                    </template>
                    <template v-slot:item.active="{ item }">
                        <v-switch v-model="item.active" @change="switchActive(item)" inset color="success"></v-switch>
                    </template>
                    <template v-slot:item.scope="{ item }">
                        <v-chip color="success" class="pb-1" small>
                            {{ item.scope }}
                        </v-chip>
                    </template>
                    <template v-slot:item.createdAt="{ item }">
                        {{ getDate(item.createdAt) }}
                    </template>
                    <template v-slot:item.action={item}>
                        <div class="my-2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn x-small fab class="mr-1" color="indigo darken-2" raised @click.stop="preview(item)" v-on="on">
                                        <v-icon size="18">mdi-magnify</v-icon>
                                    </v-btn>
                                </template>
                                <span>Preview</span>
                            </v-tooltip>
                            <v-tooltip bottom>

                                <template v-slot:activator="{ on }">

                                    <v-btn x-small fab class="mr-1" color="success" raised @click.stop="edit(item)" v-on="on">
                                        <v-icon size="14">mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">

                                    <v-btn x-small fab raised color="error" @click.stop="deleteItem(item)" v-on="on">
                                        <v-icon size="14">mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Delete</span>
                            </v-tooltip>
                        </div>

                    </template>
                </v-data-table>
            </material-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapState,
    mapMutations,

} from 'vuex'

export default {
    data() {
        return {
            search: '',
            headers: [{
                    text: 'Title',
                    align: 'left',
                    sortable: false,
                    value: 'title',
                },
                {
                    text: 'Thumbnail',
                    value: 'thumbnail'
                },
                {
                    text: 'Length',
                    value: 'duration'
                },
                {
                    text: 'Active',
                    value: 'active'
                },
                {
                    text: 'Scope',
                    value: 'scope'
                },
                {
                    text: 'Create At',
                    value: 'createdAt'
                },
                {
                    text: 'Actions',
                    value: 'action',
                    sortable: false
                },
            ],
            musics: [],
            currentMusic: {
                id: -1,
                href: null,
            },
            play: false,
            dialog: false,
            loading: true,
            showMusic: {
                active: 1,
                createdAt: "2019-11-15T07:42:01.346Z",
                duration: "279",
                genres: [],
                href: "https://res.cloudinary.com/do1xjyyru/video/upload/v1573803717/xxx/hi472x9lg8k07rbhdlec.mp3",
                id: 3,
                likes: "[]",
                lyric: "<p>2132</p>",
                lyricContributed: "admin",
                scope: "public",
                singers: [],
                size: 11210534,
                thumbnail: "https://res.cloudinary.com/do1xjyyru/image/upload/v1573803719/test/yaehxearpyav46ulseka.jpg",
                title: "test / && hào ah ạ 091 100 12",
                updatedAt: "2019-11-15T07:42:01.346Z",
                uploadId: -1,
                views: "[]"
            }
        }
    },
    computed: {
        ...mapState('app', ['responsive', 'axiosInstance']),
    },
    watch: {
        play: function (val) {
            if (val) {
                this.$refs.music.play();
            } else {
                this.$refs.music.pause();

            }

        }

    },
    created() {
        this.axiosInstance.post('admin/musics/all')
            .then(rs => {
                this.loading = false;
                this.musics = rs.data.response;

            })

    },
    methods: {
        ...mapMutations('app', ['showToast', 'showDialogProcess']),
        getDate: function (date) {
            return window.formatDate(date, 3).format
        },
        formatMusicTime: function (time) {
            let t = Number(`${time}`);

            let h = parseInt(t / 60 / 60);

            let m = parseInt((t % (60 * 60)) / 60);

            let s = parseInt(((t % (60 * 60)) % 60));

            return `${h != 0 ? `${h}:`  : ''}${m}:${window.formatNumber(s)}`;

        },
        switchStatus: function (item) {
            try {
                if (item.id != this.currentMusic.id) {
                    this.currentMusic.id = item.id;
                    this.currentMusic.href = item.href;

                    let that = this;

                    setTimeout(function () {
                        that.$refs.music.load();

                        that.play = true;
                        that.$refs.music.play()
                    }, 300)
                } else {
                    this.play = !this.play;
                }
            }catch{
                this.showToast({
                    type: 'error',
                    text: 'Trying...'
                })
            }

        },
        preview: function (item) {
            this.dialog = true;
            this.showMusic = item;
            return;

        },
        edit: function (item) {
            let input = {
                type: 'edit',
                id: item.id,
            }
            this.$router.push(`/admin/music/control/${btoa(JSON.stringify(input))}`);

        },
        switchActive: function (item) {
            let newActive = item.active;
            let index = this.musics.findIndex(it => it.id == item.id);

            let that = this;
            setTimeout(() => that.musics[index].active = !item.active, 10);

            this.showDialogProcess(true);

            this.axiosInstance.post('admin/musics/edit', {
                    id: item.id,
                    active: newActive ? 1 : 0
                })
                .then(() => {
                    this.showDialogProcess(false);
                    this.showToast({
                        type: 'success',
                        text: 'Activing is successful'
                    });

                    this.musics[index].active = newActive;
                })
                .catch(() => {
                    this.showDialogProcess(false);
                    this.showToast({
                        type: 'error',
                        text: 'Activing is faidure'
                    });
                })

            return;
        },

        deleteItem: function (item) {
            this.axiosInstance.post('admin/musics/delete', {
                id: item.id
            })
            .then(rs => {
                let {data} = rs;

                if(data.type == 'success'){
                    let index = this.musics.findIndex(it => it.id == item.id);

                    this.musics.splice(index, 1);

                }
                this.showToast({
                    type: data.type,
                    text: data.message
                });


            })
        },
        error: function () {
            this.showToast({
                text: 'Loaded faild. Try to play next music!',
                type: 'error'
            })
        },

    }
}
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

.list-music-icon {
    position: relative;
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin: 4px;
    cursor: pointer;

    .icon-background {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        z-index: 1;
        opacity: 1;
        transition: 0.2s;

    }

    .music-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        transition: 0.2s;

    }

    .music-icon.play {
        top: 45%;
        left: 50%;
        transform: translate(0, 0);
    }

}

.search {
    width: 240px;
    flex: none;
    margin-top: 16px;
}
</style>
