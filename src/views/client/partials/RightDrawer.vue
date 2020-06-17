<template>
<transition name="fade">

    <v-navigation-drawer id="right-app-drawer" right v-model="inputValue" app color="#1D1D1D" dark floating mobile-break-point="1200" persistent width="320" class="text-left">
        <template v-slot:img="attrs">
            <v-img v-bind="attrs" gradient="to top, rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)" />
        </template>

        <template v-slot:append>
            <v-list-item class="my-2">
                <v-list-item-avatar class="relative mr-3">
                    <v-img :src="user ? user.thumbnail: '/img/placeholder.png'" width="24"></v-img>
                    <v-icon size="12" color="#1fff28" class="absolute u_status">mdi-record</v-icon>
                </v-list-item-avatar>

                <v-list-item-title>
                    <p class="ma-0 mb-1 mt-1 text---lightColor fs-15">{{user ? user.name : 'Username'}}</p>
                    <p class="ma-0 text---blurColor fs-12">{{user ? user.email : 'Email'}}</p>
                </v-list-item-title>
                <v-list-item-icon>
                    <v-hover v-slot:default="{hover}">
                        <v-icon size="22" @click="logout" :class="{'text---blurColor': !hover, 'text---lightColor': hover}">mdi-arrow-right-bold-box-outline</v-icon>
                    </v-hover>
                </v-list-item-icon>
            </v-list-item>
        </template>
        <v-divider class="mx-3" />

        <div style="height: calc(100% - 12px); overflow: hidden">
            <div class="friend-online ">
                <div class="mx-4">
                    <div class="friend-online-header my-2 fs-14 text---lightColor">
                        Friends Online(0/{{interaction ? interaction.accept.length : 0}})
                    </div>
                    <v-divider class="mb-3" />
                </div>
                <div class="px-4">
                    <v-tabs v-model="friendInteractionWindow.tab" background-color="transparent" color="activeColor" :show-arrows="false" class="no-arrow" grow>
                        <v-tab v-for="(item, index) in friendInteractionWindow.tabs" :key="`interaction-${item.text}`">
                            <div v-if="index == 2">
                                <v-badge overlap class="tb-badge-overlap" color="red">
                                    <template v-slot:badge>{{interaction ? checkOverRangeNumber(interaction.pending.filter(it => it.request != user.id).length ) : 0}}</template>
                                    <v-icon size="20">{{item.icon}}</v-icon>
                                </v-badge>
                            </div>
                            <div v-if="index == 3">
                                <v-badge overlap class="tb-badge-overlap" color="red">
                                    <template v-slot:badge>{{interaction ? checkOverRangeNumber(interaction.pending.filter(it => it.request == user.id).length) : 0}}</template>
                                    <v-icon size="20">{{item.icon}}</v-icon>
                                </v-badge>
                            </div>
                            <div v-if="index <= 1">
                                <v-icon size="20">{{item.icon}}</v-icon>
                            </div>
                        </v-tab>

                    </v-tabs>
                </div>

                <v-tabs-items v-model="friendInteractionWindow.tab" style="height: calc(100% - 78px)">
                    <v-tab-item class="full-height pt-5">
                        <div class="tab-window-community-chat full-height pl-4 pr-2">
                            <div class="fs-14">Connected to Chat room!</div>
                            <div class="community-chat-area mt-4">
                                <perfect-scrollbar class="full-height pb-4 pr-4" id="container-public-chat">
                                    <loading-icon w="64" margin="60px auto 0" v-if="publicChat.loading"></loading-icon>
                                    <div v-if="!publicChat.loading">
                                        <div class="overflow-x-hidden">
                                            <transition-group name="list" mode="in-out" tag="div">

                                                <div class="community-chat-content" v-for="(item, index) in publicChat.chats" :key="`public-chat-${index}`">
                                                    <strong class="fs-14 mr-1" :style="{color: item.User.color}">{{item.User.name}}:</strong>
                                                    <div class="d-inline" v-html="item.content">
                                                    </div>
                                                </div>
                                            </transition-group>
                                        </div>
                                    </div>
                                </perfect-scrollbar>
                            </div>
                            <div class="user-message-interactive background-transparent pt-3" ref="message_area">
                                <emoji v-bind:show="showPublicChatEmoji.value" :target="'publicChatMessage'" v-on:addMessageEmoji="addEmoji" />
                                <div class="user-message-interactive-image mr-2 background-transparent">
                                    <v-img :src="user ? user.thumbnail : '/img/placeholder.png'" aspect-ratio="1" class="rounded"></v-img>
                                </div>
                                <div class="comment-user-input full-width pr-1">
                                    <div class="simple-form-control append-icon two-icon">
                                        <v-textarea ref="message_textarea" @keyup.enter.prevent="sendPublicChat" outlined solo rows="1" auto-grow class="simple-form-input small-size" color="#379DDF" label="Type something..." v-model="publicChatMessage">
                                        </v-textarea>
                                        <div class="append-icon-content">
                                            <div class="ic">

                                                <v-icon :color="`${showPublicChatEmoji.value ? '#00b8ff' : '#dedede'}`" @click="toggleEmoji('showPublicChatEmoji')" size="18">mdi-sticker-emoji</v-icon>
                                            </div>
                                            <div class="ic">
                                                <v-icon size="18" v-if="!publicChat.sending" @click="sendPublicChat">mdi-send</v-icon>
                                                <v-progress-circular width="2" size="18" indeterminate v-if="publicChat.sending" color="primary"></v-progress-circular>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-tab-item>
                    <v-tab-item class="full-height pt-4">
                        <div class="tab-window-friend full-height">
                            <v-menu top offset-y>
                                <template v-slot:activator="{ on }">

                                    <v-tabs-items v-model="tabWindow" class="full-height">

                                        <v-tab-item class="full-height">
                                            <loading-icon w="64" margin="60px auto 0" v-if="!interaction"></loading-icon>
                                            <div class="px-4" v-if="interaction">
                                                <v-text-field label="Search..." @keyup="searchFriendInList" v-model="searchInListFriend" clearable prepend-inner-icon="mdi-magnify" dense flat solo rounded></v-text-field>
                                            </div>

                                            <perfect-scrollbar class="friend-chat pr-2 ml-2" v-if="interaction">
                                                <div class="friend-chat-list">
                                                    <div class="no-friend" v-if="interaction && interaction.accept.length == 0">
                                                        <div class="text-center">
                                                            <div class="mb-2 mt-4 fs-15 text---lessDarkColor">You have no friends</div>
                                                            <v-btn small color="#3BBD40" @click="friendInteractionWindow.tab = 3">Add new</v-btn>
                                                        </div>
                                                    </div>
                                                    <div class="no-search-result text-center mt-4" v-if="searchInListFriend && searchInListFriend.length != 0 && resultSearchList.length == 0">
                                                        <div class="fs-14 text---lightColor">Nothing found</div>
                                                        <div class="fs-12 text---blurColor">We couldn't find any matches for "{{searchInListFriend}}"</div>
                                                    </div>
                                                    <div v-for="(item, index) in interaction.accept" :key="`fr-${index}`">
                                                        <div class="friend-chat-item py-2 px-1 px-3 mb-2" v-if="!searchInListFriend || searchInListFriend.length == 0 || (searchInListFriend.length != 0 && resultSearchList.findIndex(it => it.id == item.id)) >= 0" @click="switchChatWindow('open', item, index)">
                                                            <div class="friend-chat-item-status offline">
                                                                <v-icon size="8" :color="`${item.state == 'online' ? '#1fff28' : '#ff0000'}`">mdi-checkbox-blank-circle</v-icon>
                                                            </div>
                                                            <div class="friend-chat-item-info py-1">
                                                                <div class="friend-chat-item-title text---lightColor text-truncate fs-15">{{item.user.name}}</div>
                                                                <div class="friend-chat-item-content text-truncate text---blurColor fs-14">{{item.lastMessage && item.lastMessage != '' ? item.lastMessage : 'No message...'}}</div>
                                                            </div>
                                                            <div class="friend-chat-item-reactive">
                                                                <div class="friend-chat-item-image">
                                                                    <v-img size="100%" aspect-ratio="1" :src="item.user.thumbnail" class="rounded"></v-img>
                                                                </div>
                                                                <div class="friend-chat-item-control" v-on="on" @click.stop="actionTarget = item">
                                                                    <v-icon size="18" color="#111" class="d-block">mdi-dots-horizontal</v-icon>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </perfect-scrollbar>
                                        </v-tab-item>

                                        <v-tab-item class="full-height">
                                            <div class="friend-chat-presentation pl-4 pr-2">
                                                <div class="user-message-area" :style="{height: getHeight()}">
                                                    <div class="message-header" v-if="chat.user">
                                                        <div class="message-header-info">
                                                            <div class="message-header-info-image ">
                                                                <v-img size="100%" aspect-ratio="1" :src="chat.user.thumbnail" class="rounded"></v-img>
                                                                <v-icon size="14" :color="`${interaction.accept[chat.index].state == 'online' ? '#1fff28' : '#ff0000'}`" class="absolute u_status">mdi-record</v-icon>
                                                            </div>
                                                            <div class="message-header-info-wrapper ml-2">
                                                                <div class="fs-16 text---lightColor text-truncate">{{chat.user ? chat.user.name : 'Username'}}</div>
                                                                <div class="fs-13 text---blurColor text-truncate">{{getState()}}</div>
                                                            </div>
                                                        </div>
                                                        <div class="message-header-close">
                                                            <div class="tb-icon-click small">
                                                                <v-icon size="24" @click="switchChatWindow('close', null, -1)" color="#9a9a9a">mdi-close</v-icon>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <perfect-scrollbar class="message-content mt-6" id="message_content_container">
                                                        <loading-icon w="64" margin="40px auto 0" v-if="chat.loading"></loading-icon>
                                                        <div v-if="!chat.loading">
                                                            <div v-if="chat.chats.length == 0">
                                                                <div class="no-message">
                                                                    <div class="no-message-image">
                                                                        <v-img src="/img/image2.png" size="100%"></v-img>
                                                                    </div>
                                                                    <div class="mt-10 fs-15 text---lessDarkColor">No message</div>
                                                                    <v-btn class="mt-2" color="#2ab730" @click="focusToMessage()">News</v-btn>
                                                                </div>
                                                            </div>
                                                            <div class="overflow-x-hidden">
                                                                <transition-group name="list" mode="in-out" tag="div">
                                                                    <div v-for="(item, index) in chat.chats" :key="`msc-${index}`">
                                                                        <div class="message-content-time" v-if="!checkDiffDate(item, index)">{{formatDateTime(item.time, 6).format}}</div>
                                                                        <div class="message-content-response" v-if="item.fromId != user.id">

                                                                            <div class="d-flex align-end">
                                                                                <div class="message-content-image">
                                                                                    <v-img :src="chat.user ? chat.user.thumbnail : '/img/placeholder.png'" aspect-ratio="1" class="rounded"></v-img>
                                                                                </div>
                                                                                <div class="message-content-text fs-14" v-html="item.content">
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="message-content-send" v-if="item.fromId == user.id">
                                                                            <div class="message-content-text fs-14" v-html="item.content">
                                                                            </div>
                                                                            <div class="clearfix"></div>
                                                                        </div>
                                                                    </div>
                                                                </transition-group>
                                                            </div>
                                                        </div>
                                                    </perfect-scrollbar>
                                                </div>
                                                <div class="user-message-interactive background-transparent" ref="message_area">
                                                    <emoji v-bind:show="showMessageEmoji.value" :target="'message'" v-on:addMessageEmoji="addEmoji" />
                                                    <div class="user-message-interactive-image mr-2 background-transparent">
                                                        <v-img :src="user ? user.thumbnail : '/img/placeholder.png'" aspect-ratio="1" class="rounded"></v-img>
                                                    </div>
                                                    <div class="comment-user-input full-width pr-1">
                                                        <div class="simple-form-control append-icon two-icon">
                                                            <v-textarea ref="message_textarea" @keyup.enter="send" outlined solo rows="1" auto-grow class="simple-form-input small-size" color="#379DDF" label="Type something..." v-model="message">
                                                            </v-textarea>
                                                            <div class="append-icon-content">
                                                                <div class="ic">

                                                                    <v-icon :color="`${showMessageEmoji.value ? '#00b8ff' : '#dedede'}`" @click="toggleEmoji('showMessageEmoji')" size="18">mdi-sticker-emoji</v-icon>
                                                                </div>
                                                                <div class="ic">
                                                                    <v-icon size="18" v-if="!sendingMessage" @click="send">mdi-send</v-icon>
                                                                    <v-progress-circular width="2" size="18" indeterminate v-if="sendingMessage" color="primary"></v-progress-circular>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-tab-item>
                                    </v-tabs-items>

                                </template>

                                <v-list>
                                    <v-list-item v-for="(item, index) in actions" :key="`action-${index}`">
                                        <v-list-item-title @click="doAction(item.action)">{{ item.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-tab-item>
                    <v-tab-item class="full-height pt-6">
                        <div class="tab-window-response full-height">
                            <perfect-scrollbar class="full-height px-4">
                                <loading-icon w="64" margin="60px auto 0" v-if="!interaction"></loading-icon>
                                <div class="pending-interaction" v-if="interaction">
                                    <div class="header-text text---lightColor">Friend Request</div>
                                    <div class="response-interaction text-center text---lessDarkColor py-2 fs-15" v-if="(interaction.pending.filter(it => it.request != user.id)).length == 0">No received friend request</div>
                                    <div v-for="(item, index) in interaction.pending.filter(it => it.request != user.id)" :key="`pending-interaction-${index}`">
                                        <div class="response-interaction">
                                            <div class="response-interaction-image ">
                                                <v-img :src="item.user.thumbnail" class="rounded"></v-img>
                                            </div>
                                            <div class="response-interaction-content pl-2">
                                                <div class="d-flex">
                                                    <div class="response-interaction-infor">
                                                        <div class="fs-15 text---lightColor text-truncate">{{item.user.name}}</div>
                                                        <div class="fs-13 text---blurColor">Want to be your friend</div>
                                                    </div>
                                                    <div class="time fs-13 text---lessBlurColor text-truncate">
                                                        {{interactionTime(item.time)}}
                                                    </div>
                                                </div>
                                                <div class="mt-2">
                                                    <v-btn class="tb-btn-small mr-2" @click="updateInteraction(item, 'accept')">Accept</v-btn>
                                                    <v-btn outlined color="#ccc" class="tb-btn-small" @click="updateInteraction(item, 'decline')">Decline</v-btn>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </perfect-scrollbar>
                        </div>
                    </v-tab-item>
                    <v-tab-item class="full-height pr-1">
                        <div class="tab-window-search full-height" v-if="interaction">
                            <div class="tab-window-search-content py-2">
                                <perfect-scrollbar class="full-height pl-4 pr-3 pt-6">
                                    <loading-icon w="64" margin="60px auto 0" v-if="!interaction"></loading-icon>

                                    <div class="friend-interaction-container " v-if="interaction">
                                        <div class="header-text text---lightColor">Send Request</div>
                                        <div class="response-interaction text-center text---lessDarkColor py-2 fs-15" v-if="(interaction.pending.filter(it => it.request == user.id)).length == 0">No received friend request</div>
                                        <div class="overflow-hidden">
                                            <transition-group name="list" mode="in-out" tag="div">
                                                <div v-for="(item, index) in interaction.pending.filter(it => it.request == user.id)" :key="`request-interaction-${index}`">
                                                    <div class="friend-interaction">
                                                        <v-btn icon @click="cancelRequestFriend(item)" color="activeColor" class="btn-small friend-interaction-checkbox mt-0">
                                                            <v-icon size="18">mdi-close</v-icon>
                                                        </v-btn>
                                                        <div class="friend-interaction-image ml-1">
                                                            <v-img :src="item.user.thumbnail" class="rounded"></v-img>
                                                        </div>
                                                        <div class="friend-interaction-content pl-2 text-truncate pr-2">
                                                            <div class="fs-15 text---lightColor text-truncate">{{item.user.name}}</div>
                                                            <div class="fs-13 text---blurColor text-truncate">{{item.user.email}}</div>
                                                        </div>
                                                        <div class="friend-interaction-time fs-13">
                                                            {{interactionTime(item.time)}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition-group>
                                        </div>
                                    </div>
                                    <div class="suggest-interaction-container mt-6">
                                        <div class="d-flex justify-space-between align-center">
                                            <div class="header-text text---lightColor">Suggestion</div>
                                            <div class="tb-icon-click small">
                                                <v-icon size="18" color="#ababab" @click="getSuggest">mdi-reload</v-icon>
                                            </div>
                                        </div>
                                        <loading-icon w="64" margin="30px auto 0" v-if="loadingSuggest"></loading-icon>
                                        <div class="response-interaction text-center text---lessDarkColor py-2 fs-15" v-if="interaction.suggest.length == 0 && !loadingSuggest">No suggestion friend </div>

                                        <div class="overflow-x-hidden">
                                            <transition-group name="list" mode="in-out" tag="div">
                                                <div v-for="(item, index) in interaction.suggest" :key="`request-interaction-${index}`">
                                                    <div class="friend-interaction">
                                                        <div class="friend-interaction-image no-border">
                                                            <v-img :src="item.thumbnail" class="rounded"></v-img>
                                                        </div>
                                                        <div class="friend-interaction-content pl-2 text-truncate pr-2">
                                                            <div class="fs-15 text---lightColor text-truncate">{{item.name}}</div>
                                                            <div class="fs-13 text---blurColor text-truncate">{{item.email}}</div>
                                                        </div>
                                                        <div class="friend-interaction-time fs-13 ">
                                                            <v-btn icon small @click="sendRequest(item)">
                                                                <v-icon size="18">mdi-account-plus</v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </div>
                                                </div>

                                            </transition-group>
                                        </div>
                                    </div>
                                </perfect-scrollbar>
                                <div class="search-result-container" v-if="searchFriendByName && searchFriendByName.length != 0">

                                    <perfect-scrollbar class="full-height pl-4 pr-2 pt-6">
                                        <div class="header-text text---lightColor">Search Results: {{searchResult.length}} results</div>
                                        <loading-icon w="56" margin="52px auto 0" v-if="loadingSearch"></loading-icon>
                                        <div class="text-center" v-if="!loadingSearch && searchResult.length == 0">
                                            <div style="width: 60px; height: 60px; margin: 64px auto 12px;">
                                                <v-img src="/img/image3.png"></v-img>
                                            </div>
                                            <div class="text---lightColor fs-14">No search result for "{{searchFriendByName}}"</div>
                                        </div>

                                        <div class="overflow-x-hidden" v-if="!loadingSearch">
                                            <div v-for="(item, index) in searchResult" :key="`request-interaction-${index}`">
                                                <div class="friend-interaction">
                                                    <div class="friend-interaction-image no-border">
                                                        <v-img :src="item.thumbnail" class="rounded"></v-img>
                                                    </div>
                                                    <div class="friend-interaction-content pl-2 text-truncate pr-2">
                                                        <div class="fs-15 text---lightColor text-truncate">{{item.name}}</div>
                                                        <div class="fs-13 text---blurColor text-truncate">{{item.email}}</div>
                                                    </div>
                                                    <div class="friend-interaction-time fs-13 ">
                                                        <v-btn icon small @click="sendRequest(item)">
                                                            <v-icon size="18">mdi-account-plus</v-icon>
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </perfect-scrollbar>
                                </div>
                            </div>
                            <div class="search-container px-4">
                                <v-text-field label="Type something..." @keyup="search" v-model="searchFriendByName" clearable prepend-inner-icon="mdi-magnify" dense flat solo rounded></v-text-field>

                            </div>

                        </div>
                    </v-tab-item>

                </v-tabs-items>

            </div>
        </div>

    </v-navigation-drawer>
</transition>
</template>

<script>
/* eslint-disable */
import {
    mapMutations,
    mapState
} from 'vuex'

export default {
    props: {
        right: {
            type: Boolean,
            default: false
        }
    },
    components: {},
    data: () => ({
        timeOut: null,
        tabWindow: 0,
        friendInteractionWindow: {
            tab: 0,
            tabs: [{
                    icon: 'mdi-google-circles-communities',
                    text: 'chat'
                },
                {
                    icon: 'mdi-account-star',
                    text: 'friend'
                }, {
                    icon: 'mdi-account-arrow-left',
                    text: 'response'
                }, {
                    icon: 'mdi-account-search',
                    text: 'search'
                }
            ]
        },
        windows: ['list', 'message'],
        sendingMessage: false,
        showMessageEmoji: {
            value: false,
            title: 'show'
        },
        message: '',
        interaction: null,
        intervalCheckOnline: null,
        loadingSuggest: true,
        searchFriendByName: '',
        searchResult: [],
        searchInListFriend: '',
        resultSearchList: [],
        loadingSearch: false,
        chat: {
            index: -1,
            loading: true,
            user: null,
            chats: []
        },
        actionTarget: null,
        actions: [{
            title: 'Unfriend',
            action: 'unfriend'
        }],
        publicChat: {
            loading: false,
            sending: false,
            chats: []
        },
        publicChatMessage: '',
        showPublicChatEmoji: {
            value: false,
            title: 'show'
        },

    }),

    computed: {
        ...mapState('app', ['user', 'socket', 'axiosInstance']),
        inputValue: {
            get() {
                return this.$store.state.app.rightDrawer
            },
            set(val) {
                this.setRightDrawer(val)
            }
        }
    },

    methods: {
        ...mapMutations('app', ['setRightDrawer', 'toggleRightDrawer', 'setUser', 'showToast']),
        logout: function () {
            this.setUser(null);
            localStorage.removeItem('_u');
            localStorage.removeItem('_t');

            location.reload();
        },
        toggleEmoji: function (target) {
            this[target].value = !this[target].value;
        },
        addEmoji: function (target, emoji) {
            this[target] += emoji;
        },
        initListen: function () {
            if (this.timeOut != null) {
                clearTimeout(this.timeOut);
                this.timeOut = null;
            }
            this.timeOut = setTimeout(() => {
                if (!this.user) {
                    this.initListen();
                } else {
                    this.initData();

                    this.socket.off(`chat/${btoa(this.user.id)}`);
                    this.socket.on(`chat/${btoa(this.user.id)}`, (data) => {
                        console.log(data);
                        if (this.chat.user && (this.chat.user.id == data.toId || this.chat.user.id == data.fromId)) {
                            this.chat.chats.push(data);
                            this.scrollMessage('bottom');
                        }

                        if (this.user && this.interaction) {
                            let id = this.user.id == data.toId ? data.fromId : data.toId;

                            let index = this.interaction.accept.findIndex(it => it.person2 == id);

                            if (index >= 0) {
                                this.interaction.accept[index].lastMessage = data.content;
                            }

                        }
                    });

                    this.socket.off(`mpong/${btoa(this.user.id)}`);
                    this.socket.on(`mpong/${btoa(this.user.id)}`, (data) => {

                        this.socket.emit('mpong', {
                            from: this.user.id,
                            to: data.from
                        })
                    });

                    this.socket.off(`mping/${btoa(this.user.id)}`);
                    this.socket.on(`mping/${btoa(this.user.id)}`, (data) => {
                        // console.log('response ping');
                        // console.log(data);

                        if (this.interaction) {
                            let index = this.interaction.accept.findIndex(it => it.person2 == data.from);

                            this.interaction.accept[index].user.latestOnline = Date.now();

                            if (this.interaction.accept[index].state == 'offline') {
                                this.showToast({
                                    type: 'info',
                                    text: `${this.interaction.accept[index].user.name} now ONLINE!`
                                })
                            }

                            this.interaction.accept[index].state = 'online';
                        }
                    });

                    this.socket.off(`friend/${btoa(this.user.id)}`);
                    this.socket.on(`friend/${btoa(this.user.id)}`, (data) => {
                        let index = this.interaction.pending.findIndex(it => it.id == data.id);

                        if (index < 0) {
                            this.interaction.pending.push(data);
                        }
                    });

                    this.socket.off(`cancelInteraction/${btoa(this.user.id)}`);
                    this.socket.on(`cancelInteraction/${btoa(this.user.id)}`, (data) => {
                        let index = this.interaction.pending.findIndex(it => it.id == data);

                        if (index >= 0) {
                            this.interaction.pending.splice(index, 1);
                        } else {
                            index = this.interaction.accept.findIndex(it => it.id == data);
                            if (index >= 0) {
                                this.interaction.accept.splice(index, 1);
                            }
                        }
                    });

                    this.socket.off(`acceptInteraction/${btoa(this.user.id)}`);
                    this.socket.on(`acceptInteraction/${btoa(this.user.id)}`, (data) => {
                        let index = this.interaction.pending.findIndex(it => it.id == data);

                        if (index >= 0) {
                            this.showToast({
                                type: 'info',
                                text: `You and ${this.interaction.pending[index].user.name} become friends`
                            });

                            this.interaction.pending[index].status = 'accept';
                            this.interaction.accept.push(this.interaction.pending[index]);
                            this.interaction.pending.splice(index, 1);

                        }
                    });

                    this.socket.off('public-chat');
                    this.socket.on('public-chat', (data) => {
                        let index = this.publicChat.chats.findIndex(it => it.id == data.id);

                        if (index < 0) {
                            this.publicChat.chats.push(data);

                            this.scrollCommentDown('container-public-chat');
                        }
                    });

                }

            }, 300);

        },
        initData: function () {
            this.axiosInstance.post(`client/friend/getInteraction`, {
                    interactId: this.user.id
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.interaction = data.response;

                    console.log(this.interaction);

                    this.getSuggest();
                })

            this.publicChat.loading = true;

            this.axiosInstance.post('client/publicChat/find')
                .then(rs => {
                    let {
                        data
                    } = rs;

                    console.log(data);
                    this.publicChat.loading = false;
                    this.publicChat.chats = data.response;

                })

        },
        switchChatWindow: function (type, item, index) {
            if (type == 'open') {
                this.tabWindow = 1;
                this.chat.user = item.user;
                this.loadingInitChat();

            } else {
                this.tabWindow = 0;
                this.chat.user = null;
            }
            this.chat.index = index;

        },

        loadingInitChat: function () {
            console.log(this.chat);
            this.chat.loading = true;

            this.axiosInstance.post(`client/message/getMessage`, {
                    person1: this.chat.user.id,
                    person2: this.user.id
                })
                .then(rs => {
                    let {
                        data
                    } = rs;
                    this.chat.loading = false;

                    if (data.type == 'success') {
                        this.chat.chats = data.response;

                        this.scrollMessage('bottom');

                    } else {
                        this.chat.chats = [];

                        this.showToast({
                            type: 'error',
                            text: data.message
                        })
                    }

                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong!'
                    })
                })
        },
        scrollMessage: function (pos) {
            setTimeout(() => {
                let objDiv = document.getElementById('message_content_container');

                Velocity(objDiv, "scroll", {
                    offset: pos == 'top' ? 0 : objDiv.scrollHeight,
                    container: objDiv,
                    axis: 'y',
                    duration: 200,
                });
            }, 200);

        },
        focusToMessage: function () {
            this.$refs.message_textarea.focus();
        },
        sendPublicChat: function () {
            this.publicChat.sending = true;

            this.axiosInstance.post('client/publicChat/chat', {
                    content: this.publicChatMessage
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.publicChat.sending = false;
                    this.publicChatMessage = '';
                })
                .catch(err => {
                    this.publicChat.sending = false;

                })
        },
        scrollCommentDown: function (target) {
            setTimeout(() => {
                let objDiv = document.getElementById(target);
                Velocity(objDiv, "scroll", {
                    offset: objDiv.scrollHeight,
                    container: objDiv,
                    axis: 'y',
                    duration: 200,
                });
            }, 100);
        },
        send: function () {
            if (this.message.length == 0) {
                this.showToast({
                    type: 'error',
                    text: 'Type something...'
                });
                return;

            }

            this.sendingMessage = true;

            let ms = this.message;

            this.message = '';

            this.axiosInstance.post('client/message/send', {
                    toId: this.chat.user.id,
                    content: ms
                })
                .then(rs => {
                    let {
                        data
                    } = rs;
                    this.sendingMessage = false;
                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Sending message failingly...'
                    })
                })
        },
        checkDiffDate: function (item, index) {
            if (index == 0) return false;

            let date1 = new Date(Number(item.time));
            var d1 = date1.getDate();
            var m1 = date1.getMonth() + 1;
            var y1 = date1.getFullYear();

            let date2 = new Date(Number(this.chat.chats[index - 1].time));
            var d2 = date2.getDate();
            var m2 = date2.getMonth() + 1;
            var y2 = date2.getFullYear();

            return d1 == d2 && m1 == m2 && y1 == y2;

        },
        formatDateTime: function (str, type) {
            return formatDate(str, type);
        },
        getHeight: function () {
            return this.$refs.message_area ? `calc(100% - ${parseFloat(getComputedStyle(this.$refs.message_area).height) + 16}px)` : 'calc(100% - 64px)';

        },
        getState: function () {
            return this.interaction.accept[this.chat.index].user.latestOnline ? this.interaction.accept[this.chat.index].state == 'online' ? 'Online Now' : `Online ${calculateTime(this.interaction.accept[this.chat.index].user.latestOnline)} ago` : 'Offline'
        },
        interactionTime: function (time) {
            return `${calculateTime(time)}`
        },
        checkOverRangeNumber: function (num) {
            return Number(`${num}`) > 9 ? '9+' : num;
        },
        getSuggest: function () {
            this.loadingSuggest = true;
            this.interaction.suggest = [];

            let ignore = (this.interaction.accept.map(it => {
                return it.user.id
            })).concat(this.interaction.pending.map(it => {
                return it.user.id
            }));

            ignore.push(this.user.id);
            this.axiosInstance.post(`client/users/getSuggest`, {
                    ignore: ignore
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    if (data.type == 'success') {
                        this.interaction.suggest = data.response;

                        console.log(this.interaction.suggest)
                    }

                    this.loadingSuggest = false;

                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Something went wrong'
                    });

                    this.loadingSuggest = false;
                })

        },
        search: function () {
            if (this.searchFriendByName && this.searchFriendByName.length != 0) {
                this.loadingSearch = true;

                let ignore = (this.interaction.accept.map(it => {
                    return it.user.id
                })).concat(this.interaction.pending.map(it => {
                    return it.user.id
                }));

                ignore.push(this.user.id);

                this.searchResult = [];

                this.axiosInstance.post('client/users/search', {
                        q: this.searchFriendByName,
                        ignore: ignore
                    })
                    .then(rs => {
                        let {
                            data
                        } = rs;

                        if (data.type == 'success') {
                            this.searchResult = data.response;
                        }

                        this.loadingSearch = false;
                    })
                    .catch(err => {
                        this.loadingSearch = false;

                        this.showToast({
                            type: 'error',
                            text: 'Looking for friends went wrong!'
                        })
                    })
            }
        },
        searchFriendInList: function () {
            if (this.searchInListFriend.length != 0) {
                let regex = new RegExp(this.searchInListFriend);

                this.resultSearchList = this.interaction.accept.filter(it => regex.test(it.user.name));

                console.log(this.resultSearchList);

            }

        },
        sendRequest: function (item) {
            let index = this.interaction.suggest.findIndex(it => it.id == item.id);

            if (index >= 0) {
                this.interaction.suggest.splice(index, 1);
            }

            this.axiosInstance.post(`client/friend/sendRequest`, {
                    reqId: this.user.id,
                    resId: item.id
                })
                .then(rs => {
                    this.showToast({
                        type: 'success',
                        text: 'Sendding request friend!'
                    })
                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Send request friend failure!'
                    })
                })
        },
        updateInteraction: function (item, type) {
            console.log(item);
            console.log(type);
            this.axiosInstance.post('client/friend/updateInteraction', {
                    id: item.id,
                    type: type
                })
                .then(rs => {
                    let {
                        data
                    } = rs;
                    console.log(data);
                })
                .catch(err => {

                })
        },
        cancelRequestFriend: function (item) {
            this.axiosInstance.post('client/friend/cancelInteraction', {
                    id: item.id
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.showToast({
                        type: data.type,
                        text: data.message
                    })
                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Cancel request failed!'
                    })
                })

        },
        doAction: function (action) {
            console.log(this.actionTarget),
                console.log(action);

            switch (action) {
                case 'unfriend':
                    this.cancelRequestFriend(this.actionTarget);
                    break;
            }
        }
    },
    mounted() {
        this.initListen();

        if (this.intervalCheckOnline) {
            clearInterval(this.intervalCheckOnline);
            this.intervalCheckOnline = null;
        }
        let that = this;

        this.intervalCheckOnline = setInterval(function () {
            if (that.interaction) {

                that.interaction.accept.forEach((it, index) => {
                    if (!it.user.latestOnline) {
                        if (that.interaction.accept[index].state == 'online') {
                            that.showToast({
                                type: 'info',
                                text: `${that.interaction.accept[index].user.name} now OFFLINE`
                            })
                        }
                        that.interaction.accept[index].state = 'offline';
                    } else {
                        let diffTime = Date.now() - it.user.latestOnline;

                        if (diffTime > 4000) {
                            if (that.interaction.accept[index].state == 'online') {
                                that.showToast({
                                    type: 'info',
                                    text: `${that.interaction.accept[index].user.name} now OFFLINE`
                                })
                            }

                            that.interaction.accept[index].state = 'offline';

                        }
                    }

                    that.socket.emit('mping', {
                        from: that.user.id,
                        to: it.person2
                    })

                })
            }

        }, 4000);

    },
    destroyed() {
        if (this.intervalCheckOnline) {
            clearInterval(this.intervalCheckOnline);
            this.intervalCheckOnline = null;
        }
    }
}
</script>

<style>
#right-app-drawer {
    flex-direction: column-reverse;
    z-index: 1100;
}

#right-app-drawer .v-navigation-drawer__content {
    overflow: hidden;
}

#right-app-drawer .vue-scrollbar__wrapper {
    background: none;

}

.u_status {
    width: 12px !important;
    height: 12px !important;
    border: 2px solid #000000;
    border-radius: 100%;
    bottom: -2px;
    right: 0;

}

.drawer-nav-cover {
    padding: 0;
}

.drawer-nav {
    border-radius: 4px !important;
    border-left: 4px solid transparent;
    transition: 0.25s linear;
    padding: 0;
    color: red !important;
}

.drawer-nav .v-list-item__action {
    margin-right: 18px !important;
}

.drawer-nav i {
    font-size: 22px !important;
    color: #ffffffa6 !important;
    transition: 0.25s linear;
}

.drawer-nav .v-list-item__title {
    color: #ffffffa6 !important;
    font-size: 0.94rem;
}

.drawer-nav-content {
    color: rgba(255, 255, 255, .5) !important;

}

.drawer-nav:hover,
.drawer-nav-active {
    border-left-color: #379ddf;
    background: #2e3d50bf;
}

.drawer-nav:hover i,
.drawer-nav:hover .v-list-item__title,
.drawer-nav-active .v-list-item__title {
    color: #fdfdfd !important;
}

.drawer-nav-active i {
    color: #379ddf !important;
    transition: 0.25s linear;
}

.friend-online {
    height: 100%;
}

.friend-chat {
    height: calc(100% - 96px);

}

.friend-chat-presentation,
.friend-chat-list {
    height: 100%;

}
</style><style lang="scss" scoped>
.user-message-area {
    width: 100%;
    flex-grow: 1;

    .message-header {
        width: 100%;
        display: flex;

        .message-header-info {
            width: calc(100% - 30px);
            display: flex;
            flex-grow: 1;

            .message-header-info-image {
                position: relative;
                width: 36px;
                height: 36px;
                overflow: hidden;
                flex: 1 0 auto;
                margin-top: 2px;

            }

            .message-header-info-wrapper {
                width: calc(100% - 36px);
            }
        }

        .message-header-close {
            width: 30px;
            flex: 1 0 auto;
        }

    }

    .message-content {
        height: calc(100% - 90px);
        padding-right: 6px;

        .message-content-time {
            text-align: center;
            font-size: 11px;
            margin: 16px 0 8px;
            color: #ababab;
        }

        .message-content-response {
            width: 100%;
            margin-bottom: 12px;

            .message-content-image {
                display: inline-block;
                width: 28px;
                height: 28px;
            }

            .message-content-text {
                display: inline-block;
                padding: 4px 8px;
                word-break: break-all;
                max-width: calc(100% - 62px);
                background: #cdcdcd;
                color: #000;
                border-radius: 7px 14px 7px 2px;
                margin-left: 8px;

            }
        }

        .message-content-send {
            height: auto;
            margin-right: 8px;
            margin-bottom: 12px;

            .message-content-text {
                float: right;
                display: inline-block;
                padding: 4px 8px;
                word-break: break-all;
                max-width: calc(100% - 62px);
                background: #656262;
                color: #fff;
                border-radius: 14px 7px 2px 7px;
            }
        }
    }
}

.user-message-interactive {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    position: relative;

    .user-message-interactive-image {
        width: 28px;
        height: 28px;
        overflow: hidden;
        margin-top: 2px;
        flex: 1 0 auto;
    }

}

.no-message {
    text-align: center;

    .no-message-image {
        width: 100px;
        margin: auto;
        margin-top: 20px;
    }
}

.header-text {
    color: #ababab;
    font-size: 14px;
    padding-bottom: 1px;
    border-bottom: 1px solid #ababab;
    width: fit-content;
}

.tab-window-search-content {
    height: calc(100% - 80px);
    position: relative;

    .search-result-container {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        position: absolute;
        top: 0;
        left: 0;
        background: #1D1D1D;
    }

}

.search-container {
    height: 60px;
    margin-top: 20px;
}

.response-interaction {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    margin-top: 12px;
    padding: 10px 8px;
    background: #cfc4da21;
    border-radius: 6px;
    border-left: 2px solid #989898;

    .response-interaction-image {
        width: 40px;
        height: 40px;
        flex: 1 0 auto;
    }

    .response-interaction-content {
        width: calc(100% - 40px);
        flex-grow: 2;

        .response-interaction-infor {
            flex-grow: 1;
            padding-right: 8px;
            width: calc(100% - 32px);
        }

        .time {
            width: 32px;
            flex: 1 0 auto;
            text-align: right;
        }
    }
}

.friend-interaction {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 10px 4px 10px 8px;
    margin-top: 12px;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background: #504c4c45;
    }

    .friend-interaction-checkbox {
        width: 32px;
        height: 32px;
    }

    .friend-interaction-image {
        width: 40px;
        height: 40px;
        padding: 2px;
        border: 2px solid #4C62F5;
        border-radius: 100%;

        &.no-border {
            border: none;
            padding: 0;
        }
    }

    .friend-interaction-content {
        flex-grow: 1;
    }

    .friend-interaction-time {
        width: 36px;
        text-align: right;
        color: #ccc9c9;
    }
}

.tab-window-community-chat {
    &>.fs-14 {
        color: #6ad1f9eb;
    }

    .community-chat-area {
        height: calc(100% - 110px);

        .community-chat-content {
            color: #f4f4f4;
            font-size: 13px;
            margin-bottom: 10px;

            .image {
                display: inline-block;
                width: 20px;
                height: 20px;
                border-radius: 100%;
                overflow: hidden;
            }

            .d-inline{
                word-break: break-all;
            }
        }
    }
}
</style>
