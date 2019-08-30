// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  onLoad() {


    if (wx.getStorageSync("token")) {
      wx.redirectTo({
        url: '../index/index',
      })
    }
  },
  data: {
    activeInput: 'phoneNumber',
    isPasswordVisible: false,
    phoneNumber: '18883814448',
    // password: '814448',
    password: '11111111',
    isRemenberPassword: true,
    phoneNumberError: false,
    passwordError: false,
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
      password: e.detail.value
    })
  },
  togglePasswordVisibleState() {
    this.setData({
      isPasswordVisible: !this.data.isPasswordVisible
    })
  },
  rememberPassword(e) {
    this.setData({
      isRemenberPassword: e.detail.value[0] === "1"
    })
  },

  forgetPassword() {
    app.showToast("暂不支持修改密码，请联系管理员")
  },

  login(e) {
    // var phoneNumber = this.data.phoneNumber
    // var password = this.data.password
    // if (phoneNumber.length === 0 && password.length === 0) {
    //   this.shakeInput('phoneNumber')
    //   this.shakeInput('password')
    //   app.showToast("请输入手机号和密码")
    //   return
    // }

    // if (phoneNumber.length === 0) {
    //   this.shakeInput('phoneNumber')
    //   app.showToast("请输入手机号")
    //   return
    // }
    // if (!this.checkPhoneNumber(phoneNumber)) {
    //   this.shakeInput('phoneNumber')
    //   app.showToast("手机号格式有误")
    //   return
    // }

    // if (password.length === 0) {
    //   this.shakeInput('password')
    //   app.showToast("请输入密码")
    //   return
    // }






    app.http("loginAuthenticate", {
      username: this.data.phoneNumber,
      password: this.data.password,
      loginType: 1,
    }).then(data => {
      if (this.data.isRemenberPassword) {}
      var token = data.info.split(";")[0]
      wx.setStorageSync("token", token)
      app.globalData.token = token

      app.http("getUserByCustNo",{token:token,flag:true},true,false).then(data=>{
        app.globalData.userInfo = data.list
        wx.setStorageSync("userInfo", data.list)
      }) 

      wx.redirectTo({
        url: '../index/index',
      })
    }).catch(erorr => {
      app.showToast(erorr)
    })
  },
  getUserInfo(){
 
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