// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // link: {
    //   type: String,
    // },
    justLink: {
      type: Boolean,
      value: false
    },
    types: {
      type: Array,
      value: [{
        name: "我的仓库"
      }, {
        name: "供方仓库"
      }, {
        name: "全局搜索"
      }],
      observer(v) {
        if (v) {
          this.setData({
            ["searchTypes.list"]: this.data.types
          })}
      
      }
    }
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    barCode: '',
    timer: null,
    isShowDorpdown: false,
    searchTypes: {
      select: 0,
      list: [] 
    }
  },
  
  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      this.setData({
        ["searchTypes.list"]: this.data.types
      })
    
      // this.triggerEvent("searchType", this.data.searchTypes.list[0])
    },
    ready() { 
     
    }
  },



  methods: {
    // toSearch() {
    //   if (this.data.link) {
    //     wx.navigateTo({
    //       url: this.properties.link,
    //     })
    //   }
    // },
    scan() {
      let that = this
      wx.scanCode({
        success(res) {
          that.setData({
            barCode: res.result
          })
        }
      })
    },
    toggleSearchType() {
      if (this.data.justLink) {
        return
      }
      this.setData({
        isShowDorpdown: !this.data.isShowDorpdown
      })
    },

    selectSearchType(e) {
      this.setData({
        ["searchTypes.select"]: e.currentTarget.dataset.index,
        isShowDorpdown: false
      })
      this.triggerEvent("searchType", this.data.searchTypes.list[e.currentTarget.dataset.index])
    },

    input(e) {
      clearTimeout(this.data.timer)
      var timer = setTimeout(() => {
        this.triggerEvent("value", e.detail.value)
      }, 500)
      this.setData({
        timer: timer
      })
    },
    focus(e) {},
    blur(e) {},
  }
})