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
    todoList: [{
      name: "采购单",
      count: 5,
      color: 'red',
      icon: '',
      link: ''
    }, {
      name: "销售单",
      count: 3,
      color: 'orange',
      icon: '',
      link: ''
    }, {
      name: "调拨单",
      count: 1,
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
        link: ''
      }, {
        name: '信用管理',
        icon: '',
        link: ''
      }, {
        name: '客户管理',
        icon: '',
        link: ''
      }, {
        name: '代理品牌管理',
        icon: '',
        link: ''
      }, ]
    ]
  },

  lifetimes: {
    ready() {
      // console.log(app.globalData.userInfo)
      // console.log(app.globalData.companies)
      var userInfo = app.globalData.userInfo[0] ? app.globalData.userInfo[0] : app.globalData.userInfo;
      var companies = app.globalData.companies
      if (app.globalData.companies) {
        app.globalData.companies.forEach(item => {
          if (item[1] === userInfo.queryNo) {
            userInfo.currentCompany = item[0]
            userInfo.idCopy = JSON.parse(JSON.stringify(userInfo.queryNo))
          }
        })
      }

      this.setData({
        userInfo: userInfo,
        companies: companies
      })
      // console.log(userInfo)
      // console.log(companies)

    },
  },
  methods: {
    logout() {
      wx.removeStorageSync("token")
      wx.redirectTo({
        url: '/pages/login/login',
      })
    },
    showToggleAccountPop() {
      this.setData({
        showToggleAccountPop: true
      })
    },
    toggleAccount(e) {
      this.setData({
        ["userInfo.idCopy"]: e.currentTarget.dataset.id
      })
    },
    toggleAccountCancel() {
      this.setData({
        showToggleAccountPop: false,
        ["userInfo.idCopy"]: this.data.userInfo.queryNo
      })
    },
    toggleAccountConfirm() {
      app.http("toggleAccount", {
        id: this.data.userInfo.idCopy
      }, true)
      var currentCompany = ""
      this.data.companies.forEach(item => {
        if (item[1] === this.data.userInfo.idCopy) {
          currentCompany = item[0]
        }
      })
      this.setData({
        showToggleAccountPop: false,
        ["userInfo.queryNo"]: this.data.userInfo.idCopy,
        ["userInfo.currentCompany"]: currentCompany
      })
    },

  },


})