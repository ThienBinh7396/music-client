<template>
<div class="d-inline-block" :style="{width: width + 'px', height: width + 'px'}">
    <svg :style="{fill: color}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
        <path d="M42.3,16.5C35.9,10.9,32.7,6,32.7,5.9L29,0.1v44.4c-1.9-1.6-4.3-2.5-7-2.5c-6.1,0-11,4.9-11,11s4.9,11,11,11s11-4.9,11-11  V12.8c1.7,1.9,3.9,4.2,6.7,6.7c8,7,6.4,15.7,6.4,16.1l3.9,0.8C50.1,35.9,52.2,25.1,42.3,16.5z M22,60c-3.9,0-7-3.1-7-7s3.1-7,7-7  s7,3.1,7,7S25.9,60,22,60z" />
    </svg>
</div>
</template>

<script>

export default {
    props: {
        width: {
            type: String,
            default: '20'
        },
        color: {
            type: String,
            default: '#ababab'
        }
    },
    mounted() {
    },

}
</script>

<style>

</style>
