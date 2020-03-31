module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')
        ]
      }
    }
  }
}
