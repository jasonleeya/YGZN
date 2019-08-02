// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    link:{
      type:String,
    }
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toSearch(){
      if (this.data.link) {
        wx.navigateTo({
          url: this.properties.link,
        })
      }  
    },
    scan(){
      wx.scanCode({
        success(res) {
          console.log(res)
        }
      })
    }
  }
})
