<template>
  <div :class="['loader', { 'is-active': isActive }]">
    <div class="flex">
      <span
        v-for="i in 5"
        :key="i"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
.loader {
  transition: opacity 0.1s ease-in-out;
  background-color: #fff;
  opacity: 0;
  top: 25px;
  height: 50px;
  left: 0;
  right: 0;
  z-index: 0;
  pointer-events: none;
  display: flex;
  align-content: center;
  justify-content: center;

  span {
    transform-origin: 0 100%;
    background-color: var(--color-primary);
    width: 10px;
    
    &:nth-child(1) { height: 50px; animation: dance 1s 0s infinite; }
    &:nth-child(2) { height: 50px; animation: dance 1.2s 0.1s infinite; }
    &:nth-child(3) { height: 50px; animation: dance 0.6s 0.2s infinite; }
    &:nth-child(4) { height: 50px; animation: dance 1s 0.3s infinite; }
    &:nth-child(5) { height: 50px; animation: dance 0.9s 0.4s infinite; }
  }

  &.is-active {
    opacity: 1;
    pointer-events: all;
  }
}

@keyframes dance {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
  100% { transform: scaleY(1); }
}
</style>
