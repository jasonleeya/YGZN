//app.js
import urls from "./utils/urls.js"
App({
  globalData: {
    token: "",
    userInfo: null,
    interval: null,
    homeMessage: null,
    unreadMsgCount: 0, 
    isShowModal: false,
    //purchase
    purchaseCartList: [],
    purchaseTotalPrice: 0,
    purchaseTotalAmount: 0,
    //sales
    salesCartList: [],
    salesTotalPrice: 0,
    salesTotalAmount: 0,
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
        that.http("homeMessage").then(data => {
          that.globalData.homeMessage = data.list
          that.globalData.unreadMsgCount = data.infoBody
        }).catch(err => {
          console.log(err)
          switch (err) {
            case "无效token":
              wx.removeStorageSync("token")
              console.log(!that.globalData.isShowModal)
              if (!that.globalData.isShowModal) {
                that.globalData.isShowModal = true
                wx.showModal({
                  title: '重新登录',
                  content: '身份信息已过期,请重新登录',
                  showCancel: false,
                  success(res) {
                    that.globalData.isShowModal = false
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/login/login',
                      })
                    }
                  }
                })
              }
              break
            case "网络错误":
            case "服务器忙，请稍后重试":
              if (!that.globalData.isShowModal) {
                that.globalData.isShowModal = true
                wx.showModal({
                  title: '网络请求失败',
                  content: err,
                  showCancel: false,
                  success() {
                    that.globalData.isShowModal = false
                  }
                })
              }

              break

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

  showToast(text, duration = 2000) {
    wx.showToast({
      title: String(text),
      icon: 'none',
      duration: duration
    })
  },
  checkLogin() {
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


  http(alias, data = {}, isShowLogs = false, needToken = true) {
    let that = this
    if (needToken) {
      var token = wx.getStorageSync("token")
      data.token = token
    }

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
            // that.showToast("网络请求失败,请检查网络状态")
            reject('服务器忙，请稍后重试');
            return;
          }
          if (res.data.success === false) {
            reject(res.data.msg || res.data.info);
            return;
          }
          if (isShowLogs) {
            console.log("%c" + alias, "font-weight:bold;color:deeppink", res.data)
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