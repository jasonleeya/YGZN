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
      color: 'green',
      icon: 'iconkaidancaigou',
      link: ''
    }, {
      name: "销售单",
      count: 0,
      color: 'orange',
      icon: 'icondingdan',
      link: ''
    }, {
      name: "调拨单",
      count: 0,
      color: 'blue',
      icon: 'icondiaobodan  ',
      link: ''
    }, {
      name: "库存预警",
      count: 0,
      color: 'red',
      icon: 'iconkucunyujing',
      link: ''
    }],
    optionList: [
      [{
        name: '个人中心',
        icon: 'iconpersonal',
        link: '/pages/index/mine/personalCenter/personalCenter'
      }, {
        name: '帮助中心',
        icon: 'iconbangzhu',
        link: '/pages/index/mine/helpCenter/helpCenter'
      },
      //  {
      //   name: '修改密码',
      //   icon: 'iconpassword',
      //   link: '/pages/index/mine/changePassword/changePassword'
      // }, 
      ],
      [{
        name: '供应商管理',
        icon: 'icongongyingshang1',
        link: '/pages/index/mine/supplierManage/supplierManage'
      }, {
        name: '信用管理',
        icon: 'iconxinyong',
        link: '/pages/index/mine/creditManage/creditManage'
      }, {
        name: '客户管理',
        icon: 'iconkehu',
        link: '/pages/index/mine/customerManage/customerManage'
        }, {
          name: '代理品牌管理',
          icon: 'icondaili',
          link: '/pages/index/mine/agentBrandManage/agentBrandManage'
        }, {
          name: '推广',
          icon: 'iconfenxiang', 
          type:'share'
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
    jump(e) {
      console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    },
    logout() {
      wx.clearStorageSync()
      app.http("delOpenid",{
        userPhone:this.data.userInfo.userPhone
      }).then(()=>{
        wx.redirectTo({
          url: '/pages/login/login',
        })
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
    share(){
   wx.showShareMenu({
     withShareTicket: true,
     success: function(res) {},
     fail: function(res) {},
     complete: function(res) {},
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
    tap(){
      getApp().showToast("该功能尚未完善,敬请期待")
    }
  },
 

})