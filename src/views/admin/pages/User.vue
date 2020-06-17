<template>
<v-container class="pa-4 mt-8">
    <v-row>
        <v-col cols="12">
            <material-card :offset="0" :fullWidth="false">
                <template v-slot:offset>
                    <div class="d-flex grow flex-wrap v-card--material_with_icon">
                        <v-card slot="offset" class="elevation-3 v-card--material__heading v-card--material__heading_icon transition-fast" color="indigo darken-2" dark>
                            <v-icon size="40">
                                mdi-account-circle
                            </v-icon>
                        </v-card>
                        <div :class="`${ responsive > 2 ? 'ml-3' : 'ml-2'}`">
                            <div class="display-5 font-weight-light transition-fast">
                                User Tables
                            </div>
                        </div>
                    </div>
                </template>

                <v-card-title class="pt-0 px-0">
                    <div class="flex-grow-1"></div>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" dark single-line hide-details class="search"></v-text-field>
                </v-card-title>
                <v-data-table :headers="headers" :items="users" :search="search" :loading="loading" loading-text="Loading...Please wait">
                    <template v-slot:item.title="{item}">
                        <div style="max-width: 160px" class="text-truncate">
                            {{item.title}}
                        </div>
                    </template>
                    <template v-slot:item.thumbnail="{ item }">
                        <div class="d-flex align-center justify-center ma-2 list-music-icon relative" style="width: 52px">
                            <v-img lazy-src="/img/music-placeholder-square.png" :src="item.thumbnail" width="52" aspect-ratio="1"></v-img>
                        </div>
                    </template>
                    <template v-slot:item.type="{ item }">
                        <v-chip class="pb-1" small>
                            {{ item.type }}
                        </v-chip>
                    </template>
                    <template v-slot:item.createdAt="{ item }">
                        {{ getDate(item.createdAt) }}
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
    mapMutations
} from 'vuex'
export default {
    data() {
        return {
            headers: [{
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                {
                    text: 'Thumbnail',
                    value: 'thumbnail'
                },
                {
                    text: 'Email',
                    value: 'email'
                },
                {
                    text: 'Type',
                    align: 'center',
                    value: 'type'
                },
                {
                    text: 'Time',
                    value: 'createdAt'
                }
            ],
            loading: true,
            users: [],
            search: ''

        }
    },
    computed: {
        ...mapState('app', ['axiosInstance', 'responsive'])
    },
    created() {
        this.init();
    },
    methods: {
        ...mapMutations('app', ['showToast']),
        init: function () {
            this.axiosInstance.post('admin/users/all')
                .then(res => {
                    let data = res.data;
                    if (data.type == 'error') {
                        this.showToast({
                            type: data.type,
                            text: data.message
                        });
                    } else {
                        this.users = data.response;
                    }
                    this.loading = false;
                })
                .catch(() => {
                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong'
                    });
                    this.loading = false;
                })

        },
        getDate: function (date) {
            return window.formatDate(date, 3).format
        },

    }

}
</script>

<style lang="scss">
.search {
    width: 240px;
    flex: none;
    margin-top: 16px;
}
</style>
