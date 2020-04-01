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
      name: "销售待确认",
      count: 0,
      color: 'green',
      icon: 'iconqueren',
      link: '/pages/sales/salesOrders/salesOrders?orderStatus=090001',
      type: "xsdd"
    }, {
      name: "销售待发货",
      count: 0,
      color: 'orange',
      icon: 'iconfahuo',
      link: '/pages/sales/salesOrders/salesOrders?orderStatus=090002',
      type: "xsck"
    }, {
      name: "采购待付款",
      count: 0,
      color: 'blue',
      icon: 'iconfukuan',
      link: '/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090003',
      type: "cgdfk"
    }, {
      name: "采购待入库",
      count: 0,
      color: 'red',
      icon: 'iconruku',
      link: '/pages/purchase/purchaseOrders/purchaseOrders?orderStatus=090004',
      type: "cgrk"
    }],
    optionList: [
      [{
        name: '供应商管理',
        icon: 'icongongyingshang1',
        link: '/pages/index/mine/supplierManage/supplierManage'
      }, {
        name: '客户管理',
        icon: 'iconkehu',
        link: '/pages/index/mine/customerManage/customerManage'
      }, {
        name: '信用管理',
        icon: 'iconxinyong',
        link: '/pages/index/mine/creditManage/creditManage'
      }, {
        name: '储存预警',
        icon: 'iconkucunyujing',
        link: '/pages/index/mine/stockWarning/stockWarning'
      },
        //  {
        //   name: '修改密码',
        //   icon: 'iconpassword',
        //   link: '/pages/index/mine/changePassword/changePassword'
        // }, 
      ],
      [
        // {
        //   name: '代理品牌管理',
        //   icon: 'icondaili',
        //   link: '/pages/index/mine/agentBrandManage/agentBrandManage'
        // },
        {
          name: '个人中心',
          icon: 'iconpersonal',
          link: '/pages/index/mine/personalCenter/personalCenter',
        },
        // {
        //   name: '帮助中心',
        //   icon: 'iconbangzhu',
        //   link: '/pages/index/mine/helpCenter/helpCenter'
        // },
        {
          name: '推广',
          icon: 'iconfenxiang',
          type: 'share'
        },]
    ],
    isIphone: false
  },

  lifetimes: {
    attached() {
      app.setTitle("我的")
      wx.getSystemInfo({
        success: (res) => {
          if (res.system.search("iOS") > -1) {
            this.setData({
              isIphone: true
            })
          }
        }
      })


      let that = this
      if (wx.getStorageSync("currentCompanyIndex")) {
        this.setData({
          currentCompanyIndex: wx.getStorageSync("currentCompanyIndex")
        })
      }

      this.setData({
        userInfo: wx.getStorageSync("userInfo")[0],
        companies: app.globalData.companies
      })
      var todoList = that.data.todoList
      app.watchGloabalData("homeMessage", function (value) {
        app.globalData.homeMessage.forEach(item => {
          todoList.forEach(todo => {
            if (todo.type === item.type) {
              todo.count = item.notRead
            }
          })
        })
        that.setData({
          todoList
        })
      })
    },
  },
  methods: {
    jump(e) {
      console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    },
    logout() {
      app.http("delOpenid", {
        userPhone: this.data.userInfo.userPhone
      }).then(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        })
        wx.removeStorage('token')
        wx.removeStorage('userInfo')
        wx.removeStorage('userAuthCodes')
        wx.removeStorage('currentCompanyIndex') 
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
      }, true).then(() => {
        wx.setStorageSync("currentCompanyIndex", this.data.activeIndex)
        app.setTitle()
        this.setData({
          currentCompanyIndex: this.data.activeIndex,
          showToggleAccountPop: false,
        })
        app.http("getUserByCustNo", {
          flag: true
        }).then(data => {
          // console.log(data.list[0].queryNo)
          wx.setStorageSync("userInfo", data.list) 
        })
        app.http("findLabelId").then(data => { 
          wx.setStorageSync('userAuthCodes', data.list)
        })

      })

    },
    share() {
      wx.showShareMenu({
        withShareTicket: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

      // let _this = this;
      // wx.request({
      //   url: 'https://api.weixin.qq.com/cgi-bin/token',
      //   data: {
      //     grant_type: 'client_credential',
      //     appid: 'wx88c183d97ee1aad2',  
      //     secret: 'app秘钥'  
      //   },
      //   success: function (res) {

      //     wx.request({
      //       url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token ,
      //       data: { 
      //         "path": "pages/index/index", 
      //         "width": 430,
      //         // "scene": wx.getStorageSync('uid')
      //       },
      //       responseType: 'arraybuffer', // 这行很重要,转为二进制数组
      //       header: {
      //         'content-type': 'application/json;charset=utf-8'
      //       },
      //       method: 'POST',
      //       success(res) {
      //         //转为base64
      //         let bin64 = wx.arrayBufferToBase64(res.data);

      //         _this.setData({
      //           　　　　　　　　　　//base 64设置到页面上
      //           img: "data:image/png;base64," + bin64
      //         });
      //       }
      //     })
      //   }
      // })

    },
    todoListTap(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    },
  },


})