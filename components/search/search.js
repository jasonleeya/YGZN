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
      wx.redirectTo({
        url: this.properties.link,
      })
    }
  }
})
