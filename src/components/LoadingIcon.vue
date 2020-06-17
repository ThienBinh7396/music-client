<template>
<div class="loadingio-spinner-spinner" :style="{'margin': margin}">
    <div class="ldio-479jhicafvm" :style="{'transform': `scale(${scale})`}">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
</template>

<script>
export default {
    name: 'LoadingIcon',
    props: {
        w: {
            required: true,
            type: String,
            default: '200'
        },
        margin: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            scale: 1
        }

    },
    created() {
        this.scale = Number(this.w) / 200
    }
}
</script>
