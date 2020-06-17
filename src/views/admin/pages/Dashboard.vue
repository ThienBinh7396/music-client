<template>
<v-container class="pa-4 ">
    <v-row>

        <v-col cols="12" sm="6" lg="3">
            <material-stats-card color="green" icon="mdi-account-circle" title="Register" :loading="countUser.loading" :number="countUser.value" sub-icon="mdi-bookmark-outline" sub-text="Go more info" to="/admin/user" />
        </v-col>

        <v-col cols="12" sm="6" lg="3">
            <material-stats-card color="orange" icon="mdi-music-note-outline" title="Total Music" :loading="countMusic.loading" :number="countMusic.value" sub-icon="mdi-bookmark-outline" sub-text="Go more info" to="/admin/music" />
        </v-col>

        <v-col cols="12" sm="6" lg="3">
            <material-stats-card color="info" icon="mdi-poll" title="Total Visits" :loading="loadingStatistic" :number="settingStatistic.visits" sub-icon="mdi-calendar" :sub-text="`Statistic in ${new Date().getFullYear()}`" />
        </v-col>

        <v-col cols="12" sm="6" lg="3">
            <material-stats-card color="#E91E63" icon="mdi-cloud-download" title="Total Downloads" :loading="loadingStatistic" :number="settingStatistic.download" sub-icon="mdi-update" sub-text="Just Updated" />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" md="6">
            <v-card class="text-left pa-2 pt-3 chart-statistic" dark>
                <v-chip small class="mb-2">
                    #top-download
                </v-chip>
                <loading-icon w="64" margin="50px auto 0" v-if="topDownload.loading"></loading-icon>
                <bar-chart v-if="!topDownload.loading" :data="topDownload.data" />

            </v-card>

        </v-col>
        <v-col cols="12" md="6">
            <v-card class="text-left pa-2 pt-3 chart-statistic" dark>
                <v-chip small class="mb-2">
                    #top-music-by-listener
                </v-chip>
                <loading-icon w="64" margin="50px auto 0" v-if="topListener.loading"></loading-icon>
                <bar-chart v-if="!topListener.loading" :data="topListener.data" />

            </v-card>

        </v-col>

        <v-col cols="12" md="8">
            <v-card class="text-left pa-2 pt-3 chart-statistic" dark>
                <v-chip small class="mb-2">
                    #chart-in-{{new Date().getFullYear()}}
                </v-chip>
                <loading-icon w="64" margin="50px auto 0" v-if="loadingStatistic"></loading-icon>
                <area-chart v-if="!loadingStatistic" :labels="settingStatistic.labels" :colors="settingStatistic.colors" :datasets="settingStatistic.datasets" />

            </v-card>

        </v-col>

    </v-row>
</v-container>
</template>

<script>
/* eslint-disable */

import {
    mapState
} from 'vuex';
export default {
    data() {
        return {
            countUser: {
                value: 0,
                loading: false
            },
            countMusic: {
                value: 0,
                loading: false
            },
            loadingStatistic: false,
            settingStatistic: {
                visits: 0,
                download: 0,
                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",

                ],
                colors: ['cyan', 'yellow'],
                datasets: []
            },
            topDownload: {
                loading: false,
                data: {
                    labels: [],
                    datasets: [],
                }
            },
            topListener: {
                loading: false,
                data: {
                    labels: [],
                    datasets: [],
                }
            }
        }
    },
    created() {
        this.initStatistic();
    },
    computed: {
        ...mapState('app', ['axiosInstance']),
    },
    methods: {
        loadVisit: async function () {
            return new Promise(res => {
                this.axiosInstance.post('admin/views/statistic', {
                        type: 'year'
                    })
                    .then(rs => {
                        let {
                            data
                        } = rs;
                        let arr = [];

                        let that = this;

                        this.settingStatistic.visits = 0;

                        Object.keys(data.response).map(function (key, index) {
                            arr.push(data.response[key].views);

                            that.settingStatistic.visits += data.response[key].views;

                        });
                        res({
                            label: "Visits",
                            pointBackgroundColor: "white",
                            borderWidth: 1,
                            pointBorderColor: "white",
                            data: arr
                        });

                    })

            })

        },
        loadDownload: async function () {
            return new Promise(res => {

                this.axiosInstance.post('admin/download/statistic', {
                        type: 'year'
                    })
                    .then(rs => {
                        let {
                            data
                        } = rs;
                        let arr = [];

                        let that = this;

                        this.settingStatistic.download = 0;

                        Object.keys(data.response).map(function (key, index) {
                            arr.push(data.response[key].download);

                            that.settingStatistic.download += data.response[key].download;

                        });

                        console.log(arr);

                        res({
                            label: "Downloads",
                            pointBackgroundColor: "white",
                            borderWidth: 1,
                            pointBorderColor: "white",
                            data: arr
                        })

                        this.loadingStatistic = false;
                    })

            })

        },

        truncateText: function (str) {

            return str.length > 9 ? `${str.substring(0, 9)}...` : str;
        },

        initStatistic: async function () {
            this.loadingStatistic = true;
            console.log(this.axiosInstance);

            this.countUser.loading = true;
            this.countMusic.loading = true;
            this.topDownload.loading = true;
            this.topListener.loading = true;

            this.settingStatistic.datasets = [];

            this.axiosInstance.post('admin/users/count')
                .then(rs => {
                    let {
                        data
                    } = rs;

                    if (data.type == 'success') {
                        this.countUser.value = Number(data.response[0].count);
                    }
                    this.countUser.loading = false;

                })
            this.axiosInstance.post('admin/musics/count')
                .then(rs => {
                    let {
                        data
                    } = rs;

                    if (data.type == 'success') {
                        this.countMusic.value = Number(data.response[0].count);
                    }
                    this.countMusic.loading = false;

                })

            this.axiosInstance.post('admin/musics/topDownload')
                .then(rs => {
                    let {
                        data
                    } = rs;

                    let that = this;

                    let labels = data.response.map(it => {
                        return that.truncateText(it.title)
                    });

                    let datasets = [{
                        label: 'Download',
                        backgroundColor: '#2196F3',
                        data: data.response.map(it => it.download)
                    }]

                    this.topDownload.data = {
                        labels,
                        datasets
                    }

                    this.topDownload.loading = false;

                })

            this.axiosInstance.post('admin/musics/topListener')
                .then(rs => {
                    let {
                        data
                    } = rs;

                    let that = this;

                    let labels = data.response.map(it => {
                        return that.truncateText(it.title)
                    });

                    let datasets = [{
                        label: 'Listen',
                        backgroundColor: '#4CAF50',
                        data: data.response.map(it => it.amountListen)
                    }]

                    this.topListener.data = {
                        labels,
                        datasets
                    }

                    this.topListener.loading = false;
                })

            this.settingStatistic.datasets = [
                await this.loadVisit(),
                await this.loadDownload()
            ]

        },

    }
}
</script>

<style lang="scss" scoped>
.chart-statistic {
    min-height: 380px;
}
</style>
