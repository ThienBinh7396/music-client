<template>
<v-container :class="`${embed ? 'ma-0 pa-0' : 'pa-4'}`">
    <v-row>
        <v-col class="pa-0">
            <v-dialog eager v-model="dialogPlaylist" max-width="960" content-class="overflow-x-hidden">
                <v-card class="pa-0 text-left relative py-4 px-6">
                    <h2 class="mb-3"> {{ typeControlPlaylist == 'add' ? 'Add playlist' : `Information of ${tempPlaylist.title}` }}</h2>
                    <v-row>
                        <v-col cols="12" sm="4">
                            <div :class="responsive >= 2 ? 'mt-4' : ''" class="pa-1 mx-auto d-flex justify-center align-center relative" style="width: 240px; height: 240px;border: 3px solid #9E9E9E; border-radius: 5px;">
                                <v-icon size="160px" color="#9E9E9E" v-if="!tempPlaylist.thumbnail">mdi-folder-image</v-icon>
                                <div class="full-width full-height" v-if="thumbnailFile || typeControlPlaylist == 'edit'">

                                    <v-img :src="tempPlaylist.thumbnail ? tempPlaylist.thumbnail : '/img/music-placeholder-square.png'" width="100%" aspect-ratio="1"></v-img>
                                </div>
                                <input type="file" ref="thumbnail" class="input-file-hidden" @change="changeImage($event)" accept="image/*">
                            </div>
                            <v-btn outlined color="#9E9E9E" small class="mt-6 mx-auto d-block text-capitalize" @click="$refs.thumbnail.click()">
                                <v-icon size="20">mdi-upload</v-icon>
                                Choose picture
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="8">
                            <div class="simple-form-control">
                                <div class="simple-form-label">
                                    <label for="name">Title:</label>
                                </div>
                                <v-text-field outlined solo class="simple-form-input" color="#379DDF" v-model="tempPlaylist.title" name="title" label="Title..."></v-text-field>

                            </div>
                            <div class="simple-form-control">
                                <div class="simple-form-label">
                                    <label for="name">Description:</label>
                                </div>
                                <v-textarea outlined solo class="simple-form-input" color="#379DDF" v-model="tempPlaylist.description" row-height="80" rows="1" auto-grow name="title" label="Description..."></v-textarea>

                            </div>
                            <div class="simple-form-control">
                                <div class="simple-form-label">
                                    <label for="name">Category:</label>
                                </div>
                                <v-select v-model="tempPlaylist.PlaylistCategory" chips return-object :items="categories" item-text="title" outlined solo class="simple-form-input" label="Outlined style"></v-select>

                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="simple-form-control">
                                <div class="simple-form-label">
                                    <label for="name">Musics:</label>
                                </div>
                                <v-autocomplete :elevation='0' color="#dfdfdf" outlined class="simple-form-input" v-model="tempPlaylist.musics" return-object :items="musics" chips solo item-text="title" item-value="id" multiple placeholder="Choose at least music!" :loading="isMusicLoading">
                                    <template v-slot:selection="data">
                                        <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="removeMusic(data.item)">
                                            <v-avatar left>
                                                <v-img :src="data.item.thumbnail"></v-img>
                                            </v-avatar>
                                            {{ data.item.title }}
                                        </v-chip>
                                    </template>

                                    <template v-slot:item="data">
                                        <template v-if="typeof data.item !== 'object'">
                                            <v-list-item-content v-text="data.item"></v-list-item-content>
                                        </template>
                                        <template v-else>
                                            <div class="d-flex align-center py-2">
                                                <v-img :src="data.item.thumbnail" elevation="2" width="32" aspect-ratio="1" class=" mr-2"></v-img>
                                                <div v-html="data.item.title" class="fs-15 text---lightColor"></div>
                                            </div>
                                        </template>
                                    </template>

                                </v-autocomplete>

                                <div class="d-flex my-4 tb-list-music pa-2 relative" :class="{play: musicPlay.playlist == tempPlaylist.id && musicPlay.id == item.id && play}" @click="controlPlay(item)" v-for="(item) in tempPlaylist.musics" :key="item.id">
                                    <div class="d-flex list-music-content " style="width: calc(100% - 80px)">
                                        <div class="d-flex align-center justify-center  list-music-icon relative">

                                            <v-img :src="item.thumbnail ? item.thumbnail : '/img/music-placeholder-square.png' " class="absolute top" width="48" aspect-ratio="1"></v-img>
                                            <div class="icon-background" :style="{background: musicPlay.playlist == tempPlaylist.id && musicPlay.id == item.id && play ? '#1f1e1e8c' : '#1f1e1e3b'}"></div>
                                            <div class="music-icon" :class="{'play': musicPlay.playlist == tempPlaylist.id && musicPlay.id == item.id && play}">
                                                <v-icon v-if="musicPlay.playlist == tempPlaylist.id && musicPlay.id == item.id && play" size="21">mdi-pause-circle-outline</v-icon>
                                                <v-icon v-if="!(musicPlay.playlist == tempPlaylist.id && musicPlay.id == item.id && play)" size="25">mdi-play-circle-outline</v-icon>
                                            </div>
                                        </div>
                                        <div class="ml-2 mt-n1 list-music-description">
                                            <div class="fs-16 text---lightColor text-truncate">
                                                {{item.title}}
                                            </div>
                                            <div class="fs-12 mt-1 text---blurColor">
                                                {{item.size / 1000}} kB
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text---blurColor fs-13 ml-1 list-music-time " style="width: 80px"><span class="text---lightColor">{{musicPlay.playlist == tempPlaylist.id && musicPlay.id == item.id ? formatMusicTime(musicPlay.currentTime) :'0:00' }} </span>/ {{formatMusicTime(item.duration) }} </div>
                                    <v-btn small icon absolute class="bottom right mr-1 mb-1" @click.stop="removeMusic(item)">
                                        <v-icon size="19">mdi-close-circle</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    <v-card-actions class="sticky bottom secondary mx-n3 pa-3 pr-6 action-close-modal ">
                        <div class="flex-grow-1"></div>

                        <v-btn color="green accent-3" text @click="controlPlaylist">
                            {{ typeControlPlaylist == 'add' ? 'Add' : 'Save'}}
                        </v-btn>
                        <v-btn color="green accent-3" text @click="dialogPlaylist = false">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" class="pa-0">
            <div class="audio-container d-none">
                <audio preload="none" class="d-none" id="ref_music" ref="music" :src="musicPlay.href" @ended="play = false" @timeupdate="timeUpdate"></audio>
            </div>
        </v-col>
        <v-col cols="12" :sm="embed ? 12 : 4" class="pb-0">
            <v-card class="text-left pa-4 px-6">
                <v-breadcrumbs :items="breadcums" class="pa-0 mb-5">
                    <template v-slot:divider>
                        <v-icon>mdi-forward</v-icon>
                    </template>
                </v-breadcrumbs>
                <v-row>
                    <v-col cols="12">
                        <div class="simple-form-control">
                            <div class="simple-form-label">
                                <label for="name">Title:</label>
                            </div>
                            <v-text-field outlined solo class="simple-form-input" color="#379DDF" v-model="tempCategory.title" name="title" label="Title..."></v-text-field>

                        </div>

                        <div class="simple-form-control">
                            <div class="simple-form-label">
                                <label for="information">Description:</label>
                            </div>
                            <v-text-field outlined solo class="simple-form-input" color="#379DDF" v-model="tempCategory.description" name="href" label="Description..."></v-text-field>

                        </div>

                        <v-btn color="deep-orange accent-3" class="text-capitalize mr-3 animated zoomIn faster" small @click="cancelCategory" v-if="type == 'edit'">Cancel</v-btn>
                        <transition mode="out-in" name="bounce">

                            <v-btn color="primary" class="text-capitalize " small @click="control">{{ type }}</v-btn>
                        </transition>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="12" sm="8" class="mx-auto" v-if="!embed">
            <v-card class="text-left pa-4 px-6">
                <v-data-table ref="categoryTable" :headers="headerCategories" :items="categories" :items-per-page="6" :search="search" :loading="loadingCategory" loading-text="Loading... Please wait">
                    <template v-slot:item.createdAt={item}>
                        {{getDate(item.createdAt)}}
                    </template>
                    <template v-slot:item.title={item}>
                        <div class="text-truncate" style="max-width: 120px">{{item.title}}</div>
                    </template>
                    <template v-slot:item.description={item}>
                        <div class="py-2 text-truncate " style="width: 120px" v-html="item.description ? item.description : `<di class='text---blurColor'>Empty</div>`"></div>
                    </template>
                    <template v-slot:item.action={item}>
                        <div class="my-2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" x-small fab class="mr-1" color="success" raised @click="editCategory(item)">
                                        <v-icon size="14">mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit</span>
                            </v-tooltip>

                            <v-tooltip bottom="">
                                <template v-slot:activator="{ on }">

                                    <v-btn v-on="on" x-small fab raised color="error" @click="deleteCategory(item)">
                                        <v-icon size="14">mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Delete</span>
                            </v-tooltip>
                        </div>

                    </template>

                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card class="text-left pa-4 px-6 mt-4">
                <v-breadcrumbs :items="breadcumsPlaylist" class="pa-0 my-2">
                    <template v-slot:divider>
                        <v-icon>mdi-forward</v-icon>
                    </template>
                </v-breadcrumbs>
                <v-btn class="mt-4" absolute right top color="indigo darken-2" @click="showAddPlaylistDialog">
                    <v-icon>mdi-plus</v-icon>Add
                </v-btn>

                <v-card-title class="pt-0 px-0">
                    <div class="flex-grow-1"></div>
                    <v-text-field v-model="searchPlaylist" append-icon="mdi-magnify" label="Search" dark single-line hide-details class="search"></v-text-field>
                </v-card-title>
                <v-data-table :headers="headerPlaylists" :items="playlists" :search="searchPlaylist" :loading="loadingPlaylist" loading-text="Loading...Please wait">
                    <template v-slot:item.title="{item}">
                        <div style="max-width: 160px" class="text-truncate">
                            {{item.title}}
                        </div>
                    </template>

                    <template v-slot:item.thumbnail="{ item }">
                        <v-img class="ma-2" lazy-src="/img/music-placeholder-square.png" :src="item.thumbnail" width="46" aspect-ratio="1"></v-img>
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
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapMutations,
    mapState
} from 'vuex'
import {
    async
} from 'q';
export default {
    data() {
        return {
            play: false,
            musicPlay: {
                playlist: -1,
                id: -1,
                href: null,
                currentTime: 0
            },
            embed: false,
            breadcums: [{
                text: 'Categories',
                disabled: true,
                href: 'admin/playlist',
            }],
            breadcumsPlaylist: [{
                text: 'Playlist',
                disabled: true,
                href: ''
            }],
            tempCategory: {
                id: -1,
                title: '',
                description: ''
            },
            headerCategories: [{
                    text: 'Title',
                    value: 'title'
                }, {
                    text: 'Description',
                    value: 'description'
                }, {
                    text: 'Time',
                    value: 'createdAt'
                },
                {
                    text: 'Action',
                    value: 'action'
                }
            ],
            categories: [],
            search: "",
            loadingCategory: false,
            type: 'add',
            playlists: [],
            typeControlPlaylist: 'add',
            tempPlaylist: {
                "id": -1,
                "title": "",
                "thumbnail": "",
                "ownerId": -1,
                "scope": "public",
                "playlistCategory": -1,
                "views": "[]",
                "createdAt": "2019-11-10T17:11:26.059Z",
                "updatedAt": "2019-11-10T17:11:26.059Z",
                "PlaylistCategory": {},
                "musics": []
            },
            searchPlaylist: "",
            loadingPlaylist: false,
            dialogPlaylist: false,
            headerPlaylists: [{
                    text: 'Title',
                    value: 'title'
                },
                {
                    text: 'Thumbnail',
                    value: 'thumbnail'
                },
                {
                    text: 'Scope',
                    value: 'scope'
                },
                {
                    text: 'Time',
                    value: 'createdAt'
                },
                {
                    text: 'Action',
                    value: 'action'
                }

            ],
            musics: [],
            isMusicLoading: true,
            thumbnailFile: null

        }
    },
    computed: {
        ...mapState('app', ['responsive', 'axiosInstance'])
    },
    watch: {
        play: function (val) {
            console.log(val + ": " + this.musicPlay.id + this.musicPlay.href);

            if (val) {
                this.$refs.music.play();
            } else {
                this.$refs.music.pause();
            }

        }
    },
    created() {
        this.loadingCategory = true;
        this.loadingPlaylist = true;

        this.init();
    },
    methods: {
        ...mapMutations('app', ['showToast', 'showDialogProcess']),
        getDate: function (date) {
            return formatDate(date, 3).format
        },
        init: function () {
            this.axiosInstance.post('admin/musics/all')
                .then(rs => {
                    this.musics = rs.data.response;
                    this.isMusicLoading = false;
                })
                .catch(err => {
                    console.log(err);

                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong!'
                    })
                });

            this.axiosInstance.post('admin/playlistCategory/all', {
                    type: 'withoutUser'
                })
                .then(rs => {
                    this.categories = rs.data.response;

                    console.log(this.categories);

                    this.loadingCategory = false;
                })
                .catch(err => {

                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong'
                    })
                    this.$router.push('/admin')

                })

            this.axiosInstance.post('admin/playlist/all')
                .then(rs => {
                    this.playlists = rs.data.response;

                    this.loadingPlaylist = false;

                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong'
                    })

                    this.$router.push('/admin')
                })

        },
        formatMusicTime: function (time) {
            let t = Number(`${time}`);

            let h = parseInt(t / 60 / 60);

            let m = parseInt((t % (60 * 60)) / 60);

            let s = parseInt(((t % (60 * 60)) % 60));

            return `${h != 0 ? `${h}:`  : ''}${m}:${formatNumber(s)}`;

        },
        timeUpdate: function () {
            this.musicPlay.currentTime = parseInt(`${this.$refs.music.currentTime}`);
        },

        control: function () {

            if (!this.tempCategory.title) {
                this.showToast({
                    type: 'error',
                    text: 'Title of category is required!'
                })
                return;
            }
            if (this.type == 'edit' && this.tempCategory.id == -1) {
                this.showToast({
                    type: 'error',
                    text: 'Error, try again!'
                })

                return;
            }

            this.showDialogProcess(true);

            if (this.type == 'add') {
                this.axiosInstance.post('admin/playlistCategory/add', {
                        title: this.tempCategory.title,
                        description: this.tempCategory.description
                    })
                    .then(res => {
                        this.showDialogProcess(false);

                        let data = res.data;

                        if (data.type == 'success') {
                            this.categories.splice(0, 0, data.response);
                            this.showToast({
                                type: 'success',
                                text: data.message
                            })

                        } else {
                            this.showToast({
                                type: 'error',
                                text: data.message
                            })
                        }
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                        this.showDialogProcess(false);
                        this.showToast({
                            type: 'error',
                            text: 'Something went wrong!'
                        });
                    })

            } else {

                this.axiosInstance.post('admin/playlistCategory/edit', {
                        id: this.tempCategory.id,
                        title: this.tempCategory.title,
                        description: this.tempCategory.description
                    })
                    .then(res => {
                        console.log(res);
                        this.showDialogProcess(false);

                        let data = res.data;

                        this.showToast({
                            type: 'success',
                            text: `${data.message}`
                        })
                        let index = this.categories.findIndex(it => it.id == this.tempCategory.id);
                        this.categories.splice(index, 1, data.response);

                        this.cancelCategory();
                    })
                    .catch(err => {
                        this.showDialogProcess(false);

                        this.showToast({
                            type: 'error',
                            text: `${err}`
                        })
                    })

            }

        },
        editCategory: function (item) {
            this.tempCategory.id = item.id;
            this.tempCategory.title = item.title;
            this.tempCategory.description = item.description;

            this.type = 'edit';

        },
        deleteCategory: function (item) {

            this.axiosInstance.post('admin/playlistCategory/delete', {
                    id: item.id
                })
                .then(res => {
                    let data = res.data;

                    if (data.type == 'success') {
                        this.showToast({
                            type: 'success',
                            text: `${data.message}`
                        })

                        let index = this.categories.findIndex(it => it.id == item.id);
                        this.categories.splice(index, 1);

                    } else {
                        this.showToast({
                            type: 'error',
                            text: `${data.message}`
                        })
                    }

                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: `${err}`
                    });

                })
        },
        cancelCategory: function () {
            this.tempCategory = {
                id: -1,
                title: '',
                description: ''
            }
            this.type = 'add';
        },
        resetTempPlaylist: function () {
            this.tempPlaylist = {
                "id": -1,
                "title": "",
                "thumbnail": "",
                "ownerId": -1,
                "scope": "public",
                "playlistCategory": -1,
                "views": "[]",
                "createdAt": "2019-11-10T17:11:26.059Z",
                "updatedAt": "2019-11-10T17:11:26.059Z",
                "PlaylistCategory": {},
                "musics": []
            };

            this.thumbnailFile = null;

            this.typeControlPlaylist = "add";
        },
        showAddPlaylistDialog: function () {
            this.dialogPlaylist = true;

            this.resetTempPlaylist();

        },
        edit: function (item) {
            this.dialogPlaylist = true;

            this.tempPlaylist = item;

            this.typeControlPlaylist = 'edit';

            console.log(this.tempPlaylist);
        },
        uploadFile: async function (file, count) {
            return new Promise(res => {
                if (!count) count = 0;

                let formData = new FormData();
                if (typeof file == "string") {
                    formData.append('path', JSON.stringify([`${file}`]));

                } else {
                    formData.append('files', file);

                }
                this.axiosInstance.post('uploadImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(rs => {
                    if (rs.data[0].type == 'success') {
                        res(rs.data[0]);
                    } else {
                        if (count == 3) {
                            res(null);
                        } else {
                            count++;
                            this.uploadFile(file, count);
                        }
                    }
                }).catch(err => {
                    res(null);
                })

            })
        },
        controlPlaylist: async function () {
            this.showDialogProcess(true);
            console.log(this.tempPlaylist);

            let url;

            if (this.thumbnailFile) {
                let rs = await this.uploadFile(this.thumbnailFile);
                url = rs ? rs.url : '/img/music-placeholder-square.png';

            } else {
                url = this.tempPlaylist.thumbnail ? this.tempPlaylist.thumbnail : '/img/music-placeholder-square.png';

            }

            if (!this.tempPlaylist.title || !this.tempPlaylist.PlaylistCategory.id) {
                this.showToast({
                    type: 'error',
                    text: 'Tittle or category is\'t empty'
                });
                return;
            }

            let dt = {
                title: this.tempPlaylist.title,
                description: this.tempPlaylist.description,
                thumbnail: url,
                scope: 'public',
                playlistCategory: this.tempPlaylist.PlaylistCategory.id,
                musics: JSON.stringify(this.tempPlaylist.musics.map(it => it.id))
            }

            if (this.typeControlPlaylist == 'edit') {
                dt.id = this.tempPlaylist.id;
            }

            this.thumbnailFile = null;

            this.axiosInstance.post(`admin/playlist/${this.typeControlPlaylist}`, dt)
                .then(rs => {
                    let data = rs.data;
                    console.log(data);

                    this.showDialogProcess(false);
                    this.dialogPlaylist = false;

                    this.showToast({
                        type: data.type,
                        text: data.message
                    });

                    if (this.typeControlPlaylist == 'add') {
                        this.playlists.splice(0, 0, data.response);
                    } else {
                        let index = this.playlists.findIndex(it => it.id == data.response.id);
                        this.playlists.splice(index, 1, data.response);

                    }

                    this.resetTempPlaylist();

                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong!'
                    })
                    this.showDialogProcess(false);

                    this.resetTempPlaylist();
                })

        },
        removeMusic: function (item) {
            console.log(item);
            let index = this.tempPlaylist.musics.findIndex(it => it.id == item.id);

            this.tempPlaylist.musics.splice(index, 1);
        },
        controlPlay: function (item) {
            if (this.musicPlay.playlist != this.tempPlaylist.id || this.musicPlay.id != item.id) {
                this.$refs.music.load();

                this.musicPlay.playlist = this.tempPlaylist.id;

                this.musicPlay.id = item.id;
                this.musicPlay.href = item.href;

                let that = this;

                setTimeout(function (e) {
                    that.$refs.music.load();

                    that.play = true;
                    that.$refs.music.play();

                }, 100);

            } else {
                this.play = !this.play;
            }
        },
        changeImage: function (e) {
            console.log(e.target.files);
            let regex = /^image\/.+/gi;

            if (e.target.files.length > 0) {
                if (!regex.test(e.target.files[0].type)) {
                    this.showToast({
                        type: 'error',
                        text: 'Type thumbnail is invaild'
                    });

                    return;
                }

                let url = URL.createObjectURL(e.target.files[0]);

                this.tempPlaylist.thumbnail = url;
                this.thumbnailFile = e.target.files[0];
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.search {
    width: 240px;
    flex: none;
    margin-top: 16px;
}
</style>
