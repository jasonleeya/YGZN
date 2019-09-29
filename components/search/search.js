let app=getApp()
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
      //初始化搜索组件使不显示type bug解决方法,监听types的变化
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
    },
    ready() { 
     
    }
  },



  methods: {
    //二维码扫描
    scan() {
      let that = this
      wx.scanCode({
        success(data) { 
          if (data.result.search(/taskId/)>-1){
            wx.showModal({
              title: '确定取货吗',
              content: '',
              success: (res)=>{
                  if(res.cancel){
                    app.http("notTake", { taskId: data.result.match(/taskId:(\d*)/)[1]}).then(()=>{
                      app.showToast("取消取货成功")
                    }).catch(err=>{
                      app.showToast(err)
                    })
                  }
                  if(res.confirm){
                    app.http("take", { taskId: data.result.match(/taskId:(\d*)/)[1] }).then(() => {
                      app.showToast("取货成功")
                    }).catch(err => {
                      app.showToast(err)
                    })
                  }
              }
            })
          }else{
            that.setData({
              barCode: data.result
            })
          }
        
        }
      })
    },
    //展开搜索类型下拉选择
    toggleSearchType() {
      if (this.data.justLink) {
        return
      }
      this.setData({
        isShowDorpdown: !this.data.isShowDorpdown
      })
    },
    //选择搜索类型
    selectSearchType(e) {
      this.setData({
        ["searchTypes.select"]: e.currentTarget.dataset.index,
        isShowDorpdown: false
      })
      this.triggerEvent("searchType", this.data.searchTypes.list[e.currentTarget.dataset.index])
    },
    //限制input触发事件,500毫秒内不能重复
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