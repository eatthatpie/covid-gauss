<template>
  <p>
    <span class="color-gray fs-14">{{ label }}</span><br>
    <span class="fs-18">{{ value }}</span>
  </p>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: String|Number,
      default: null
    }
  }
}
</script>
