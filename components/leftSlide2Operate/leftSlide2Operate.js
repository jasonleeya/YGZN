// components/leftSlide2Operate/leftSlide2Operate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id:String,
    moveItemId:String,
  },

  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },

  data: {
    lsit:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
  }
})
