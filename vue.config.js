module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '喵喵网管理后台'
        return args
      })
  }
}