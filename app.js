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
    salesTotalAmount: 0,
    userAuthCodes:[]
  },
  onShow: function() {
    //获取所有用户权限值并保存在全局变量中
    this.http("findLabelId").then(data => {
      this.globalData.userAuthCodes = data.list
    })
    let that = this
    this.globalData.interval = setInterval(function() {
      let pages = getCurrentPages();
      let currPage = null;
      if (pages.length) {
        currPage = pages[pages.length - 1];
      }
      if (currPage.route !== "pages/login/login" && currPage.route !== "pages/welcome/welcome") {
        that.http("homeMessage").then(data => {
          that.globalData.homeMessage = data.list
          that.globalData.unreadMsgCount = data.infoBody
        }).catch(err => {
          console.log(err)
          switch (err) {
            case "无效token":
              if (that.globalData.isShowModal) {
                return
              }
              that.globalData.isShowModal = true
              wx.showModal({
                content: '此账号已在其他地方登陆,需重新验证',
                showCancel: false,
                success: () => {
                  wx.login({
                    success(res) {
                      that.globalData.isShowModal = false
                      if (res.code) {
                        that.http("loginAuthenticate", {
                          username: res.code,
                          loginType: 2
                        }, true, false).then(data => {
                          console.log(data)
                          if (data.success === false) {
                            wx.showModal({
                              title: '',
                              content: '请先绑定/注册账号',
                              showCancel: false,
                              success: function(res) {
                                wx.navigateTo({
                                  url: '/pages/login/login?openId=' + data.info,
                                })
                              }
                            })
                          } else {
                            wx.setStorageSync("token", data.info)
                            that.globalData.token = data.info
                            wx.redirectTo({
                              url: '/pages/index/index'
                            })
                          }
                        })

                      } else {
                        app.showToast("微信验证失败")
                      }
                    }
                  })

                }
              })

              // if (!that.globalData.isShowModal) {
              //   that.globalData.isShowModal = true
              //   wx.showModal({
              //     title: '重新登录',
              //     content: '身份信息已过期,请重新登录',
              //     showCancel: false,
              //     success(res) {
              //       that.globalData.isShowModal = false
              //       if (res.confirm) { 
              //         wx.removeStorageSync("token")
              //         wx.redirectTo({
              //           url: '/pages/login/login',
              //         })
              //       }
              //     }
              //   })
              // }
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



  showToast(text, duration = 2000) {
    wx.showToast({
      title: String(text),
      icon: 'none',
      duration: duration
    })
  },
  // checkLogin() {
  //   if (!wx.getStorageSync("token")) {
  //     wx.redirectTo({
  //       url: '/pages/login/login',
  //     })
  //   }
  // },


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
          if (res.data.success === false && alias !== 'loginAuthenticate') {
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
  },

})