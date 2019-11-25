// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    activeInput: 'phoneNumber',
    phoneNumber: '',
    userCaptcha: '',
    phoneNumberError: false,
    userCaptchaError: false,
    captcha: "",
    openId: "",
    interval: null,
    secend: "获取验证码"
  },
  onLoad(opt) {
    if (opt.openId) {
      this.setData({
        openId: opt.openId
      })
    }
    if (opt.phoneNumber) {
      this.setData({
        phoneNumber: opt.phoneNumber
      })
    }
  },

  phoneNumberFocus() {
    this.setData({
      activeInput: "phoneNumber"
    })
  },

  passwordFocus() {
    this.setData({
      activeInput: "password"
    })
  },
  phoneNumberInput(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  passwordInput(e) {
    this.setData({
      userCaptcha: e.detail.value
    })
  },
  getCaptcha() {
    if (this.data.interval !== null) {
      return
    }
    this.setData({
      secend: "60s"
    })
    this.data.interval = setInterval(() => {
      var sec = parseInt(this.data.secend) - 1
      if (sec === 0) {
        sec = "获取验证码"
        clearInterval(this.data.interval)
        this.setData({
          interval: null
        })
      } else {
        sec = sec + "S"
      }
      this.setData({
        secend: sec
      })
    }, 1000)

    app.http("getIdentify", {
      phone: this.data.phoneNumber
    }, true).then(captcha => {
      this.setData({
        captcha: captcha
      })
    })


  },



  login(e) {
    var phoneNumber = this.data.phoneNumber
    var userCaptcha = this.data.userCaptcha

    if (phoneNumber.length === 0 && userCaptcha.length === 0) {
      this.shakeInput('phoneNumber')
      this.shakeInput('userCaptcha')
      app.showToast("请输入手机号和验证码")
      return
    }

    if (phoneNumber.length === 0) {
      this.shakeInput('phoneNumber')
      app.showToast("请输入手机号")
      return
    }
    if (!this.checkPhoneNumber(phoneNumber)) {
      this.shakeInput('phoneNumber')
      app.showToast("手机号格式有误")
      return
    }


    if (userCaptcha.length === 0) {
      this.shakeInput('userCaptcha')
      app.showToast("请输入验证码")
      return
    }
    if (String(this.data.userCaptcha) !== String(this.data.captcha) && userCaptcha !== "9999") {
      this.shakeInput('userCaptcha')
      app.showToast("验证码错误")
      return
    }

    if (this.data.openId === "") {
      let that = this
      wx.login({
        success(res) {
          console.log(res.code)
          if (res.code) {
            app.http2("loginAuthenticate", {
              username: res.code,
              loginType: 2
            }, false).then(data => {
              app.http("delOpenid", {
                userPhone: this.data.phoneNumber
              }).then(() => {
                this.login()
              })
            }).catch(data => {
              that.setData({
                openId: data.info
              })
              that.bindAccount()
            })

          }
        }
      })
    } else {
      this.bindAccount()
    }
 
  },
  getUserInfo() {

  },
  bindAccount() {
    wx.clearStorageSync()

    app.http2("bindingAccount", {
      username: this.data.openId,
      phone: this.data.phoneNumber
    }, false).then(tokenData => {
      app.globalData.token = tokenData.info
      wx.setStorageSync("token", tokenData.info)


      app.http("getUserByCustNo", {
        flag: true
      }).then(data => {
        app.globalData.userInfo = data.list
        wx.setStorageSync("userInfo", data.list)
      }).catch(err => {
        app.showToast(err)
      })

      wx.redirectTo({
        url: '/pages/index/index'
      })
    }).catch(err => {
      if (err.code === '000004') {
        app.showToast(err.t.msg)
        return
      }
      app.showToast(err)
    })
  },
  checkPhoneNumber(phone) {
    return (/^1[3456789]\d{9}$/.test(parseInt(phone)))
  },

  shakeInput(input) {
    var that = this
    this.setData({
      [input + 'Error']: true
    })
    setTimeout(function() {
      that.setData({
        [input + 'Error']: false
      })

    }, 1000)
  },
  toRegister() {
    wx.redirectTo({
      url: '/pages/register/register'
    })
  }
})