<template>
  <v-card
    :style="styles"
    v-bind="$attrs"
    v-on="$listeners"
    class="pa-3 pb-0"
  >
    <helper-offset
      v-if="hasOffset"
      :inline="inline"
      :full-width="fullWidth"
      :offset="offset"
    >
      <v-card
        v-if="!$slots.offset"
        :color="color"
        :elevation="elevation"
        class="v-card--material__header d-flex align-center"
        dark
        min-height="80"
      >
        <slot
          v-if="!title && !text"
          name="header"
        />
        <div
          v-else
          class="px-3"
        >
          <h4
            class="title font-weight-light mb-2 text-left"
            v-text="title"
          />
          <p
            class="category font-weight-thin mb-0"
            v-text="text"
          />
        </div>
      </v-card>

      <slot
        v-else
        name="offset"
      />
    </helper-offset>

    <v-card-text class="pa-0 px-4">
      <slot />
    </v-card-text>


    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'MaterialCard',

    inheritAttrs: false,

    props: {
      color: {
        type: String,
        default: 'secondary'
      },
      elevation: {
        type: [Number, String],
        default: 10
      },
      inline: {
        type: Boolean,
        default: false
      },
      fullWidth: {
        type: Boolean,
        default: false
      },
      offset: {
        type: [Number, String],
        default: 24
      },
      title: {
        type: String,
        default: undefined
      },
      text: {
        type: String,
        default: undefined
      }
    },

    computed: {
      hasOffset () {
        return this.$slots.header ||
          this.$slots.offset ||
          this.title ||
          this.text
      },
      styles () {
        if (!this.hasOffset) return null

        return {
          marginBottom: `${this.offset}px`,
          marginTop: `${this.offset * 2}px`
        }
      }
    }
  }
</script>
