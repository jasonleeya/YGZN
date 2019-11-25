var app= getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    var pages=getCurrentPages()
    var splitData = pages[pages.length - 2].data.splitOrderData
    console.log(splitData)
  },
})