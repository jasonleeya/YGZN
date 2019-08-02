// components/previewImage/previewImage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    w:String,
    h: String,
    src:String
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
    previewImage(){
      wx.previewImage({ 
        urls: [this.data.src],
      })
    }
  }
})
