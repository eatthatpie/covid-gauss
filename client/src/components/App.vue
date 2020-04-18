<template>
  <div :class="['__root p-20', { 'is-ready': isReady }]">
    <Toolbar class="mb-40" />
    <Transition mode="out-in" name="activity">
      <RouterView :key="$route.fullPath" />
    </Transition>
    <Footer class="mt-20" />
  </div>
</template>

<script>
import '@/assets/styles/_styles.scss'
import Footer from './Footer'
import Toolbar from './Toolbar'

export default {
  components: { Footer, Toolbar },
  data() {
    return {
      isReady: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.isReady = true
    }, 1000)
  }
}
</script>
