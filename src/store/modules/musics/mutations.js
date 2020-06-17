import {set } from '@/utils/vuex'

function setMusicByIndex(state, index) {
    if (state.playList.length != 0) {

        if (index >= state.playList.length) index = 0;
        if (index < 0) index = state.playList.length - 1;

        state.music = state.playList[index];
        state.lastTime = 0;
    } else {
        state.music = {
            id: -1,
            title: 'There is no music in the playlist',
            singers: [],
            "lyric": "<p><strong>eqweqeqweqweqweeqweqw</strong></p>",
            "lyricContributed": "admin",
            "size": 7436357,
            "active": 1,
            "scope": "public",
            "views": "[]",
            "likes": "[]",
            "uploadId": -1,
            "createdAt": "2020-01-01T09:46:54.902Z",
            "updatedAt": "2020-01-01T09:46:54.902Z",
            href: null,
            thumbnail: '/img/music-placeholder-square.png',
            lastTime: 0,
            duration: 0

        }
    }
}

function updatePlaylistInLocalStorage(state) {
    localStorage.setItem('playlist', JSON.stringify(state.playList));
}

export default {
    playControlMusic: (state, music) => {
        if (!state.playList) state.playList = [];
        if (state.playList.findIndex(it => it.id == music.id) < 0) {
            state.playList.push(music);
            updatePlaylistInLocalStorage(state);
        }
        state.music = music;

        state.playing = true;

    },
    updateControlMusic: (state, music) => {
        if (!state.playList) state.playList = [];
        if (state.playList.findIndex(it => it.id == music.id) < 0) {
            state.playList.push(music);
            updatePlaylistInLocalStorage(state);

            state.music = music;
        }

        state.playing = !state.playing;
    },
    setReplay: set('replay'),
    setPlaying: set('playing'),
    setCurrentMusic: set('music'),
    setPlaylistId: set('playlistId'),
    setPlayList: (state, playlist) => {
        state.playList = playlist;
        updatePlaylistInLocalStorage(state);
    },
    addMusicIntoPlaylist: (state, music) => {
        if (!state.playList) state.playList = [];
        if (state.playList.findIndex(it => it.id == music.id) < 0) {
            state.playList.push(music);
            updatePlaylistInLocalStorage(state);

        }
    },
    setMusicByIndex: setMusicByIndex,
    updateMusic: (state, music) => {
        let { title, singers, href, thumbnail, lastTime, duration } = music;

        state.music = {
            id: state.music.id,
            title: title || state.music.title,
            singers: singers || state.music.singers,
            href: href || state.music.href,
            thumbnail: thumbnail || state.music.thumbnail,
            lastTime: lastTime || state.music.lastTime,
            duration: duration || state.music.duration
        }
    },
    removeMusicAt: (state, index) => {
        var next = state.music.id == state.playList[index].id;
        state.playList.splice(index, 1);

        if (next) {
            setMusicByIndex(state, index);
            state.replay = true;
        }
    },
    swapMusicInPlayList: (state, pos) => {
        let temp = state.playList[pos[0]];

        state.playList[pos[0]] = state.playList[pos[1]];
        state.playList[pos[1]] = temp;


    }
}