<template>
<v-container :class="`${embed ? 'ma-0 pa-0' : 'pa-4'}`">
    <v-row>

        <v-col cols="12" class="pb-0">
            <v-card class="text-left pa-4 px-6">
                <v-breadcrumbs :items="breadcums" class="pa-0 mb-5">
                    <template v-slot:divider>
                        <v-icon>mdi-forward</v-icon>
                    </template>
                </v-breadcrumbs>
                <v-row :class="{'flex-wrap-reverse': responsive <= 1}">
                    <v-col cols="12" sm="8">
                        <div class="simple-form-control">
                            <div class="simple-form-label">
                                <label for="name">Name:</label>
                            </div>
                            <v-text-field outlined solo class="simple-form-input" color="#379DDF" v-model="name" name="title" label="Name..."></v-text-field>

                        </div>
                        <div class="simple-form-control">
                            <div class="simple-form-label">
                                <label for="banner">Banner:</label>
                            </div>
                            <v-card class="mb-4 relative overflow-hidden">
                                <div class=" change-thumbnail relative">
                                    <input type="file" id="banner" class="input-file-hidden" @change="changeImage($event, 'banner')" accept="image/*">

                                </div>
                                <v-img :src="banner" max-height="220"></v-img>
                            </v-card>
                            <div class="d-flex align-center">
                                <v-switch v-model="bannerTypeFile" style="transform: rotate(90deg)" label="" color="primary" hide-details></v-switch>

                                <div class="relative pt-1">
                                    <input class="simple-form-input mt-1 animate slideInUp" style="width: 240px" v-show="!bannerTypeFile" id="bannerUrl" placeholder="Url..." @change="updateBanner">
                                    <v-btn class="mt-1 slideInUp text-capitalize" outlined color="primary" v-show="bannerTypeFile" small @click="targetFile('banner')">
                                        <v-icon size="20">mdi-upload</v-icon>
                                        Upload
                                    </v-btn>
                                </div>
                            </div>

                        </div>
                        <div class="simple-form-control mt-6">
                            <div class="simple-form-label">
                                <label for="information">Information:</label>
                            </div>

                            <quill-editor class="ql-customize" v-model="information" ref="myQuillEditor" :options="editorOption" id="information">

                            </quill-editor>
                        </div>
                        <v-btn color="primary" class="text-capitalize mt-6" small @click="add">Save</v-btn>
                    </v-col>
                    <v-col cols="12" sm="4" md="3" class="mx-auto">
                        <div class="pa-1 mx-auto d-flex justify-center align-center relative" style="width: 200px; height: 200px;border: 3px solid #9E9E9E; border-radius: 5px;">
                            <v-icon size="160px" color="#9E9E9E" v-if="!thumbnailFile && type == 'add'">mdi-account</v-icon>
                            <div class="full-width full-height" v-if="thumbnailFile || type == 'edit'">

                                <v-img :src="thumbnail ? thumbnail : '/img/placeholder.png'" aspect-ratio="1"></v-img>
                            </div>
                            <input type="file" id="thumbnail" class="input-file-hidden" @change="changeImage($event, 'thumbnail')" accept="image/*">
                        </div>
                        <v-btn outlined color="#9E9E9E" small class="mt-6 mx-auto d-block text-capitalize" @click="targetFile('thumbnail')">
                            <v-icon size="20">mdi-upload</v-icon>
                            Choose picture
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapMutations,
    mapState,
    mapActions
} from 'vuex';
import {
    async
} from 'q';

import {
    quillEditor
} from 'vue-quill-editor'

export default {
    props: {
        embed: {
            type: Boolean,
            default: false
        },
    },
    components: {
        quillEditor
    },
    data() {
        return {
            editorOption: {
                theme: 'snow',
                placeholder: 'Enter information of singer',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        ['blockquote', 'code-block'],

                        [{
                            'list': 'ordered'
                        }],
                        [{
                            'color': []
                        }, {
                            'background': []
                        }],
                        [{
                            'align': []
                        }],
                        ['clean'],
                    ],
                    clipboard: {
                        matchVisual: false // https://quilljs.com/docs/modules/clipboard/#matchvisual
                    }
                }
            },
            name: '',
            thumbnail: 'https://res.cloudinary.com/do1xjyyru/image/upload/v1569645689/test/hk0cfzlr4fr2lpfvs7dq.jpg',
            thumbnailFile: null,
            banner: '/img/banner-placeholder.png',
            bannerFile: null,
            bannerTypeFile: true,
            urlBanner: '',
            information: '',
            type: 'add',
            id: -1,
            breadcums: [],
        }
    },
    computed: {
        ...mapState('app', ['axiosInstance', 'responsive'])
    },
    created() {
        if (!this.embed) {
            try {
                let data = JSON.parse(decodeURIComponent(escape(atob(this.$route.params.data))));
                let that = this;

                this.type = data.type;

                if (data.type == 'edit') {
                    this.name = data.name;

                    this.thumbnail = data.thumbnail;
                    this.banner = data.bannerHref;

                    this.id = data.id;

                    this.axiosInstance.post('admin/singers/findById', {
                        id: data.id
                    }).then(rs => {
                        that.information = rs.data.response.information;
                    })
                }

                console.log(data);
            } catch (err) {
                this.showToast({
                    type: 'error',
                    text: 'Url is invalid!'
                });

                this.$router.push('/admin/dashboard')

            }
        }

        this.breadcums = [{
                text: 'Singer',
                disabled: false,
                href: '#/admin/singer',
            },
            {
                text: this.toCapitalize(this.type),
                disabled: true,
                href: '',
            },
        ]

    },
    methods: {
        ...mapMutations('app', ['setAlert', 'setToast', 'showToast', 'showDialogProcess']),
        toCapitalize: function (str) {
            return `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`
        },
        checkImage: async function (url) {
            return new Promise(res => {
                let timeout = 5000;
                var timedOut = false,
                    timer;
                var img = new Image();
                img.onerror = img.onabort = function () {
                    if (!timedOut) {
                        clearTimeout(timer);

                        res(false);
                    }
                };
                img.onload = function () {
                    if (!timedOut) {
                        clearTimeout(timer);
                        res(true);
                    }
                };
                img.src = url;
                timer = setTimeout(function () {
                    timedOut = true;
                    res(false);
                }, timeout);

            })
        },
        updateBanner: async function (e) {

            let check = await this.checkImage(e.target.value);

            this.banner = check ? e.target.value : '/img/banner-placeholder.png';

            if (!check) {

                this.bannerTypeFile = true;
                this.showToast({
                    type: 'error',
                    text: 'Can\'t load image. Try again!!!'
                })
            }

        },
        targetFile: function (target) {
            document.getElementById(target).click();
        },
        changeImage: function (e, target) {
            if (!e.target.files[0]) {

                this.showToast({
                    type: 'error',
                    text: 'File choose is invalid...'
                })
                return;
            }

            console.log(URL.createObjectURL(e.target.files[0]));

            target == 'banner' ?
                this.bannerFile = e.target.files[0] :
                this.thumbnailFile = e.target.files[0];

            target == 'banner' ?
                this.banner = URL.createObjectURL(e.target.files[0]) :
                this.thumbnail = URL.createObjectURL(e.target.files[0]);

            if (target == 'banner') this.bannerTypeFile = true;
        },
        uploadFile: async function (file) {
            return new Promise(res => {

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
                }).then(async rs => {
                    if (rs.data[0].type == 'faild') {
                        res(await this.uploadFile(file));
                    } else {
                        res(rs.data);

                    }

                }).catch(err => {
                    res(null);
                })

            })
        },

        add: async function () {
            console.log(this.information);

            if (this.name == "" || this.name.trim() == "") {
                this.showToast({
                    type: 'error',
                    text: 'Type name is required...'
                })

                return;
            }

            let formData = new FormData();

            let thumbnailUrl = null,
                bannerUrl = null;

            this.showDialogProcess(true);

            if (this.bannerTypeFile) {
                if (!this.bannerFile && this.type == 'add') {
                    console.log("Add: ");
                    this.showToast({
                        type: 'error',
                        text: 'Choose banner from computer or type url...'
                    })

                    this.showDialogProcess(false);
                    return;
                }
                if (this.bannerFile) {
                    bannerUrl = await this.uploadFile(this.bannerFile);
                }
            } else {
                if (!await this.checkImage(this.banner) || this.banner == '/img/banner-placeholder.png' && this.type == 'add') {
                    this.showToast({
                        type: 'error',
                        text: 'Url of banner is invalid. Type again...'
                    })
                    this.showDialogProcess(false);
                    return;
                }
                console.log("Upload banner url: " + this.banner)

                if (await this.checkImage(this.banner) && this.banner != '/img/banner-placeholder.png') {
                    bannerUrl = await this.uploadFile(this.banner);
                }
            }

            if (bannerUrl) {

                if (bannerUrl[0].type == 'error') {
                    this.showToast({
                        type: 'error',
                        text: 'Upload banner error!'
                    });

                    this.showDialogProcess(false);
                    return;
                }

                bannerUrl = bannerUrl[0].url;
            }

            if (!this.thumbnailFile && this.type == 'add') {
                this.showToast({
                    type: 'error',
                    text: 'Choose thumbnail from computer!'
                })

                this.showDialogProcess(false);
                return;
            } else {
                if (this.thumbnailFile) {
                    thumbnailUrl = await this.uploadFile(this.thumbnailFile);
                }

            }
            if (thumbnailUrl) {
                if (thumbnailUrl[0].type == 'error') {
                    this.showToast({
                        type: 'error',
                        text: 'Upload thumbnail error!'
                    });

                    this.showDialogProcess(false);
                    return;
                }
                thumbnailUrl = thumbnailUrl[0].url;

                this.showDialogProcess(false);

            }

            formData.append('name', this.name);
            console.log(this.information)
            formData.append('information', this.information.replace(`<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`, ''));

            bannerUrl && formData.append('banner', bannerUrl);
            thumbnailUrl && formData.append('thumbnail', thumbnailUrl);

            this.type == 'edit' && formData.append('id', this.id);

            this.axiosInstance.post('admin/singers/' + this.type, formData).
            then(rs => {
                    this.showDialogProcess(false);

                    let data = rs.data;

                    if (data.type == 'error') {
                        this.setAlert({
                            type: 'error',
                            title: 'Oops...',
                            html: data.message
                        })
                    } else {
                        this.setAlert({
                                type: 'success',
                                title: 'Successful...',
                                html: `${this.type.charAt(0).toUpperCase() + this.type.substring(1, this.type.length)} singer ${this.name} successful`
                            })

                            !this.embed && this.$router.push('/admin/singer');
                    }

                    console.log(rs);
                })
                .catch(err => {
                    this.showDialogProcess(false);

                    console.log(err);
                })

        }
    }

}
</script>

<style>

</style>
