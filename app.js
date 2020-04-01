//app.js
import urls from "./utils/urls.js"

App({
  globalData: {
    token: "",
    userInfo: null,
    companies: [],
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
    salesTotalAmount: 0
  },
  onShow: function () {
    //每过五秒验证token是否过期
    this.globalData.interval = setInterval(() => {
      let pages = getCurrentPages();
      let currPage = null;
      if (pages.length) {
        currPage = pages[pages.length - 1];
      }
      if (currPage.route !== "pages/login/login" && currPage.route !== "pages/welcome/welcome" && currPage.route !== "pages/register/register") {
        this.checkLogin()
      }
    }, 5000)
  },
  onHide() {
    clearInterval(this.globalData.interval)
  },
  checkLogin() {
    return new Promise((resolve, reject) => {
      this.http("homeMessage").then(data => {
        this.globalData.homeMessage = data.list
        this.globalData.unreadMsgCount = data.infoBody
      }).catch(err => {
        reject()
        if (err === 403 || err === '无效token') {
          if (this.globalData.isShowModal) {
            return
          }
          this.globalData.isShowModal = true
          wx.showModal({
            content: '账号凭证已失效,需重新验证',
            showCancel: false,
            success: () => {
              wx.login({
                success: (res) => {
                  // this.globalData.isShowModal = false
                  if (res.code) {
                    this.http2("loginAuthenticate", {
                      username: res.code,
                      loginType: 2
                    }, false).then(data => {
                      console.log(data)

                      wx.setStorageSync("token", data.info)
                      this.globalData.token = data.info
                      wx.redirectTo({
                        url: '/pages/welcome/welcome'
                      })

                    }).catch(data => {
                      wx.showModal({
                        title: '',
                        content: '请先绑定/注册账号',
                        showCancel: false,
                        success: (res) => {
                          wx.navigateTo({
                            url: '/pages/login/login?openId=' + data.info,
                          })
                        }
                      })
                    })
                  } else {
                    this.showToast("微信验证失败")
                  }
                }
              })
            }
          })
        } else {
          if (!this.globalData.isShowModal) {
            this.globalData.isShowModal = true
            wx.showModal({
              title: '错误:' + err,
              showCancel: false,
              success() {
                this.globalData.isShowModal = false
              }
            })
          }
        }

      })
    })
  },
  setTitle(pre = "") {
    if (pre !== "") {
      pre = pre + "-"
    }
    var currentCompanyIndex = wx.getStorageSync("currentCompanyIndex")

    if (this.globalData.companies.length === 0) {
      this.http("queryCompany").then(data => {
        this.globalData.companies = data.list
        setCompony(data.list)
      })
    } else {
      setCompony(this.globalData.companies)
    }

    function setCompony(companies) {
      if (currentCompanyIndex === "") {
        wx.setStorageSync("currentCompanyIndex", 0)
        wx.setNavigationBarTitle({
          title: pre + companies[0][0]
        })
      } else {
        wx.setNavigationBarTitle({
          title: pre + companies[currentCompanyIndex][0]
        })

      }
    }


  },



  showToast(text, duration = 3000) {
    wx.showToast({
      title: String(text),
      icon: 'none',
      duration: duration
    })
  },

  //监听全局变量的变化
  watchGloabalData(key, callback) {
    var obj = this.globalData;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this["_" + key] = value;
        callback(value);
      },
      get: function () {
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

    return new Promise(function (resolve, reject) {
      wx.request({
        url: urls(alias),
        method: 'POST',
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.statusCode != 200) { 
            reject(res.statusCode);
            return;
          } 
          if (!res.data.success) {
            reject(res.data.msg || res.data.info);
            return;
          }
          if (isShowLogs) {
            console.log("%c" + alias, "font-weight:bold;color:deeppink", res.data)
          }
          resolve(res.data);
        },
        fail: function (err) {
          if (typeof err.errMsg !== 'undefined') {
            reject(err.errMsg)
          } else {
            reject(err);
          }
        },
        complete: function (res) { }
      })
    })
  },
  http2(alias, data = {}, needToken = true) {
    if (needToken) {
      var token = wx.getStorageSync("token")
      data.token = token
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: urls(alias),
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        success: function (res) {
          if (!res.data.success) {
            reject(res.data);
            return;
          }
          resolve(res.data);
        },
        fail: function (res) {
          reject(res.data);
        },
      })
    })
  },

})