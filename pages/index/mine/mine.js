// pages/mine/mine.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
    showToggleAccountPop: false
  },
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    companies: [],
    currentCompanyIndex: 0,
    activeIndex: 0,
    todoList: [{
      name: "采购单",
      count: 0,
      color: 'red',
      icon: '',
      link: ''
    }, {
      name: "销售单",
      count: 0,
      color: 'orange',
      icon: '',
      link: ''
    }, {
      name: "调拨单",
      count: 0,
      color: 'blue',
      icon: '',
      link: ''
    }, {
      name: "库存预警",
      count: 0,
      color: 'green',
      icon: '',
      link: ''
    }],
    optionList: [
      [{
        name: '个人中心',
        icon: '',
        link: ''
      }, {
        name: '帮助中心',
        icon: '',
        link: ''
      }],
      [{
        name: '供应商管理',
        icon: '',
        link: '/pages/index/mine/supplierManage/supplierManage'
      }, {
        name: '信用管理',
        icon: '',
          link: '/pages/index/mine/creditManage/creditManage'
      }, {
        name: '客户管理',
        icon: '',
          link: '/pages/index/mine/customerManage/customerManage'
      }, {
        name: '代理品牌管理',
        icon: '',
        link: ''
      } ]
    ],
    isIphone:false
  },

  lifetimes: {
    attached() {
      app.showToast('该页面功能尚未完善')
      wx.getSystemInfo({
        success:(res)=>{
          if (res.system.search("iOS") > -1){
            this.setData({
              isIphone:true
            })
          } 
        }
      })


      let that = this
      if (wx.getStorageSync("currentCompanyIndex")){
        this.setData({
          currentCompanyIndex: wx.getStorageSync("currentCompanyIndex")
        })
      } 
      
      app.http("getUserByCustNo", {
        flag: true
      }, ).then(data => { 
        that.setData({
          userInfo: data.list[0]
        })

        app.http("queryCompany").then(data => {
          that.setData({
            companies: data.list
          })
        })
      })


    },
  },
  methods: {
    jump(e){
      console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    },
    logout() {
      wx.removeStorageSync("token")
      wx.redirectTo({
        url: '/pages/login/login',
      })
    },
    showToggleAccountPop() {
      this.setData({
        showToggleAccountPop: true,
        activeIndex: this.data.currentCompanyIndex
      })
    },
    toggleAccount(e) {

      this.setData({
        activeIndex: e.currentTarget.dataset.index
      })
    },
    toggleAccountCancel() {
      this.setData({
        showToggleAccountPop: false,
      })
    },
    toggleAccountConfirm() {
      app.http("toggleAccount", {
        id: this.data.companies[this.data.activeIndex][1]
      }, true)
      wx.setStorageSync("currentCompanyIndex", this.data.activeIndex)
      app.setTitle()
      this.setData({
        currentCompanyIndex: this.data.activeIndex,
        showToggleAccountPop: false,
      })
    },

  },


})