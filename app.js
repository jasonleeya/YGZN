//app.js
import urls from "./utils/urls.js"
App({
  globalData: {
    token: "",
    userInfo: null,
    interval: null,
    homeMessage: null,
    companies: null,
    //purchase
    purchaseCartList:[],
    purchaseTotalPrice:0,
    purchaseTotalAmount:0,
  },

  onShow: function() {
    this.iniData()
    let that = this
    this.globalData.interval = setInterval(function() {
      let pages = getCurrentPages();
      let currPage = null;
      if (pages.length) {
        currPage = pages[pages.length - 1];
      }
      if (currPage.route !== "pages/login/login") {
        that.http("homeMessage", {}).then(data => {
          that.globalData.homeMessage = data.list
          if (data.infoBody === null) {
            wx.showModal({
              title: '重新登录',
              content: '身份信息已过期,请重新登录',
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
                }  
              }
            })

            wx.removeStorageSync("token")
          }
        })
      }
    }, 5000)
  },
  onHide() {
    clearInterval(this.globalData.interval)
  },

  iniData() {
    
  },

  showToast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  checkLogin() {
    // wx.checkSession({
    //   success: function () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //   },
    //   fail: function () {

    //     wx.redirectTo({
    //       url: '/pages/login/login',
    //     })
    //   }
    // })

    if (!wx.getStorageSync("token")) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },


  watchGloabalData(key, callback) {
    var obj = this.globalData;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        this["_" + key] = value;
        callback(value);
      },
      get: function() {
        return this["_" + key]
      }
    })
  },


  http(alias, data = {}, isShowLogs = false) {
    var token = wx.getStorageSync("token")
    data.token = token

    if (isShowLogs) {
      console.log("%c请求接口:" + alias, "font-weight:bold", data)
    }

    return new Promise(function(resolve, reject) {
      wx.request({
        url: urls(alias),
        method: 'POST',
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          // 'token': token
        },
        success: function(res) {
          if (res.statusCode != 200) {
            reject('服务器忙，请稍后重试');
            return;
          }
          if (res.data.success === false) {
            reject(res.data.info);
            return;
          }
          if (isShowLogs) {
            console.log("%c" + alias, "font-weight:bold", res.data)
          }
          resolve(res.data);
        },
        fail: function(res) {
          reject('网络错误');
        },
        complete: function(res) {}
      })
    })
  }


})
