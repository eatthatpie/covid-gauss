<template>
  <div class="__root">
    <Toolbar />
    <Transition name="activity">
      <RouterView />
    </Transition>
    <Footer />
  </div>
</template>

<script>
import '@/assets/styles/_styles.scss'
import Footer from './Footer'
import Toolbar from './Toolbar'

export default {
  components: { Footer, Toolbar }
}
</script>
