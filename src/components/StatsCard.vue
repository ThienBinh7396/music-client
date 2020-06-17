<template>
<material-card class="v-card--material-stats" v-bind="$attrs" v-on="$listeners">
    <v-card slot="offset" :class="`elevation-${elevation}`" :color="color" class="pa-4" dark>
        <v-icon size="40" color="#fff">
            {{ icon }}
        </v-icon>
    </v-card>

    <div class="text-right">
        <p class="body-2 grey--text font-weight-light mb-0" v-text="title" />
        <h3 class="headline font-weight-light text--primary">
            <span>{{value ? value : ''}}</span>
            <count-up v-if="number !== undefined" :endVal="number" />
            <small>{{ smallValue }}</small>
        </h3>
    </div>

    <template slot="actions">
        <div class="full-width no-copy">
            <v-divider />
            <div class="tb-card-action" :class="{'hover': to != undefined}" @click="toHref()">
                <v-icon :color="subIconColor" size="20" class="mx-2">
                    {{ subIcon }}
                </v-icon>
                <span :class="subTextColor" class="caption font-weight-light" v-text="subText" />
                <div class="progress-circular" v-if="loading">
                    <v-progress-circular width="2" size="18" indeterminate color="#dedede"></v-progress-circular>
                </div>
            </div>
        </div>
    </template>
</material-card>
</template>

<script>
import Card from './Card'

export default {
    name: 'MaterialStatsCard',

    inheritAttrs: false,

    props: {
        ...Card.props,
        icon: {
            type: String,
            required: true
        },
        subIcon: {
            type: String,
            default: undefined
        },
        subIconColor: {
            type: String,
            default: undefined
        },
        subTextColor: {
            type: String,
            default: undefined
        },
        subText: {
            type: String,
            default: undefined
        },
        title: {
            type: String,
            default: undefined
        },
        value: {
            type: String,
            default: undefined,
            required: false
        },
        number: {
            type: Number,
            default: undefined,
            required: false
        },
        smallValue: {
            type: String,
            default: undefined
        },
        to: {
            type: String,
            required: false,
            default: undefined

        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    methods: {
        toHref: function () {
            if (this.to !== undefined) {
                this.$router.push(this.to);
            }
        }
    }
}
</script>

<style lang="scss">
.v-card--material-stats {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    text-align: left;

    .v-offset {
        display: inline-block;
        flex: 0 1;
        margin-top: 0;
        margin-left: 0;
        margin-right: auto;
        margin-bottom: 0 !important;
        max-width: auto;
        padding: 0 16px 0;
    }

    .v-card {
        border-radius: 4px;
        flex: 0 1 auto;
    }

    .v-card__text {
        display: inline-block;
        flex: 1 0 calc(100% - 120px);
        position: absolute;
        top: 12px;
        right: 0;
        width: 100%;
    }

    .v-card__actions {
        flex: 1 0 100%;
    }

    .tb-card-action {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        padding-top: 9px;
        padding-bottom: 9px;
        margin-bottom: 6px;
        margin-top: 4px;

        .progress-circular {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(-50%, -50%);
        }
    }

    .hover:hover {
        cursor: pointer;
        border-radius: 2px;
        background: #ffffff21;
    }
}
</style>
