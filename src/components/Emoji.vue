<template>
<transition name="list" mode="out-in">
    <div class="wrapper-emoji " v-if="show">
        <div class="wrapper-emoji-center">
            <perfect-scrollbar class="wrapper-emoji-content">
                <div class="wrapper-emoji-container">
                    <div class="wrapper-emoji-item" @click="addEmoji(item)" v-for="(item, index) in emojis[currentIndex].items" :key="`emoji-${index}`">
                        <div>
                            {{item}}
                        </div>
                    </div>
                </div>
            </perfect-scrollbar>
            <div class="wrapper-emoji-footer">
                <div class="emoji-category" :class="{active: index == currentIndex}" v-for="(item, index) in emojis" :key="`emoji-category-${index}`">
                    <div class="emoji-category-item" @click="currentIndex = index">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{item.icon}}</span>

                            </template>
                            <span>{{item.title}}</span>
                        </v-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>

</transition>
</template>

<script>
import emoji from '../utils/emojis';

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        target: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentIndex: 0,
            emojis: emoji
        }
    },
    methods: {
        addEmoji: function (item) {
            this.$emit('addMessageEmoji', this.target, item);
        }
    }   

}
</script>
