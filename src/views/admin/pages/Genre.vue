<template>
<v-container :class="`${embed ? 'ma-0 pa-0' : 'pa-4'}`">
    <v-row>
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
                            <v-text-field outlined solo class="simple-form-input" color="#379DDF" v-model="tempGenre.title" name="title" label="Title..."></v-text-field>

                        </div>

                        <div class="simple-form-control">
                            <div class="simple-form-label">
                                <label for="information">Href param:</label>
                            </div>
                            <v-text-field outlined solo disabled class="simple-form-input" color="#379DDF" v-model="tempHrefParam" name="href" label="Href params..."></v-text-field>

                        </div>

                        <v-btn color="deep-orange accent-3" class="text-capitalize mr-3 animated zoomIn faster" small @click="cancel" v-if="type == 'edit'">Cancel</v-btn>
                        <transition mode="out-in" name="bounce">

                            <v-btn color="primary" class="text-capitalize " small @click="control">{{ type }}</v-btn>
                        </transition>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="12" sm="8" class="mx-auto" v-if="!embed">
            <v-card class="text-left pa-4 px-6">
                <v-data-table :headers="headers" :items="genres" :footer-props="itemsPerPageOptions" :items-per-page="6" :search="search" :loading="loading" loading-text="Loading... Please wait">
                    <template v-slot:item.title={item}>
                        <div class="text-truncate" style="width: 80px">{{ item.title }}</div>
                    </template>
                    <template v-slot:item.href_params={item}>

                        <div class="text-truncate" style="width: 80px">{{ item.href_params}}</div>
                    </template>
                    <template v-slot:item.action={item}>
                        <div class="my-2">
                            <v-btn x-small fab class="mr-1" color="success" raised @click="edit(item)">
                                <v-icon size="14">mdi-pencil</v-icon>
                            </v-btn>

                            <v-btn x-small fab raised color="error" @click="deleteItem(item)">
                                <v-icon size="14">mdi-delete</v-icon>
                            </v-btn>
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
    mapState,
    mapMutations
} from 'vuex';
export default {
    props: {
        embed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            breadcums: [{
                text: 'Genre'
            }],

            tempGenre: {
                id: -1,
                title: ''
            },
            type: 'add',
            loading: true,
            search: '',
            itemsPerPageOptions: {
                'items-per-page-options': [6, 16, 36, 56, 'All'],
            },
            headers: [{
                    text: 'Title',
                    value: 'title'
                },
                {
                    text: 'Href-params',
                    value: 'href_params'
                }, {
                    text: 'Create at',
                    value: 'createdAt'
                },
                {
                    text: 'Actions',
                    value: 'action',
                    sortable: false
                },
            ],
            genres: []
        }
    },
    computed: {
        ...mapState('app', ['axiosInstance']),
        tempHrefParam: function () {
            return this.deleteAccent(this.tempGenre.title);
        }
    },
    created() {
        this.init();
    },
    methods: {
        ...mapMutations('app', ['showToast', 'showDialogProcess']),
        formatDate: function () {

        },
        deleteAccent(str) {
            str = str ? str.trim() : '';

            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            str = str.replace(/\s+/g, "-");
            str = str.replace(/[^A-Za-z0-9\\-]/gim, '');
            return str;
        },
        init: async function () {

            this.genres = (await this.getData()).map(it => {
                it.createdAt = window.formatDate(it.createdAt, 3).format
                return it;
            });
            this.loading = false;
        },
        getData: function () {
            return new Promise(res => {
                this.axiosInstance.post('admin/genres/all')
                    .then(rs => {
                        res(rs.data.response);
                    })
                    .catch(() => {
                        res([]);
                    })
            })
        },
        edit: function (item) {
            this.tempGenre = item;
            this.type = 'edit';
        },
        cancel: function () {
            this.type = 'add';
            this.tempGenre = {
                id: -1,
                title: ''
            }
        },
        deleteItem: function (item) {
            this.axiosInstance.post('admin/genres/delete', {
                    id: item.id
                })
                .then(rs => {
                    if (rs == 0) {
                        this.showToast({
                            type: 'error',
                            text: 'Error: Can\'t delete !'
                        })
                    } else {
                        this.showToast({
                            type: 'success',
                            text: `Delete genre with identity ${item.id} successful!`
                        })

                        let index = this.genres.findIndex(it => it.id == item.id);

                        this.genres.splice(index, 1);
                    }

                })
        },
        control: function () {

            if (this.tempGenre.title.trim() == '') {
                this.showToast({
                    type: 'error',
                    text: 'The field of title is required!'
                })
                return;
            }

            this.showDialogProcess(true);

            if (this.type == 'add') {
                this.axiosInstance.post('admin/genres/add', {
                        title: this.tempGenre.title
                    })
                    .then(rs => {

                        this.showDialogProcess(false);
                        let data = rs.data;

                        if (data.type == 'error') {
                            this.showToast({
                                type: 'error',
                                text: `Error: ${data.message.join(',')}!`
                            })

                        } else {

                            this.showToast({
                                type: 'success',
                                text: `Add ${this.tempGenre.title} successful!`
                            })
                            this.cancel();
                            data.response.createdAt = window.formatDate(data.response.createdAt, 3).format
                            this.genres.splice(0, 0, data.response);
                        }

                    })
                    .catch(() => {
                        this.showToast({
                            type: 'error',
                            text: `Error: Something went wrong}!`
                        })
                    })
            }

            if (this.type == 'edit') {
                this.axiosInstance.post('admin/genres/update', {
                        title: this.tempGenre.title,
                        id: this.tempGenre.id
                    })
                    .then(rs => {

                        this.showDialogProcess(false);

                        let data = rs.data;

                        if (data.type == 'error') {
                            this.showToast({
                                type: 'error',
                                text: `Error: ${data.message.join(',')}!`
                            })

                        } else {

                            this.showToast({
                                type: 'success',
                                text: `Edit ${this.tempGenre.title} successful!`
                            })
                            this.cancel();

                            let index = this.genres.findIndex(it => it.id == data.response.id);
                            this.genres.splice(index, 1, data.response);
                        }

                    })
                    .catch(() => {
                        this.showToast({
                            type: 'error',
                            text: `Error: Something went wrong}!`
                        })
                    })
            }

        }

    }
}
</script>
