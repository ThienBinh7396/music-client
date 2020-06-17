<template>
<div class="tb-music-playing-icon" :style="{width: width + 'px', height: equalDimen ? (width)  + 'px' : (width - 4)  + 'px'}">
    <div class="tb-music-playing-icon-container">
        <div :style="{background: color}"></div>
        <div :style="{background: color}"></div>
        <div :style="{background: color}"></div>
        <div :style="{background: color}"></div>
    </div>

</div>
</template>

<script>
export default {
    props: {
        width: {
            type: String,
            default: '42'
        },
        color: {
            type: String,
            default: '#029cff',
            required: false
        }, 
        equalDimen: {
            type: Boolean,
            default: true,
            required: false
        }
    }
}
</script>

<style>

</style>
