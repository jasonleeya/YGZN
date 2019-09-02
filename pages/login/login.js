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
    this.setData({
      openId: opt.openId
    })
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
    if (String(this.data.userCaptcha) !== String(this.data.captcha)) {
      this.shakeInput('userCaptcha')
      app.showToast("验证码错误")
      return
    }
    app.http("bindingAccount", {
      username: this.data.openId,
      phone: this.data.phoneNumber
    }).then(tokenData => {
      app.globalData.token = tokenData.info
      wx.setStorageSync("token", tokenData.info)
      wx.redirectTo({
        url: '/pages/index/index'
      })
    })


    // app.http("loginAuthenticate", {
    //   username: this.data.phoneNumber,
    //   password: this.data.password,
    //   loginType: 1,
    // }).then(data => {
    //   if (this.data.isRemenberPassword) {}
    //   var token = data.info.split(";")[0]
    //   wx.setStorageSync("token", token)
    //   app.globalData.token = token

    //   app.http("getUserByCustNo", {
    //     token: token,
    //     flag: true
    //   }, true, false).then(data => {
    //     app.globalData.userInfo = data.list
    //     wx.setStorageSync("userInfo", data.list)
    //   })

    //   wx.redirectTo({
    //     url: '../index/index',
    //   })
    // }).catch(erorr => {
    //   app.showToast(erorr)
    // })
  },
  getUserInfo() {

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
  }
})