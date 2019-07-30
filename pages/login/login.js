// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  onLoad(){
    if (wx.getStorageSync("token")){
      wx.redirectTo({
        url: '../index/index',
      })
    }
  },
  data: {
    activeInput: 'phoneNumber',
    isPasswordVisible: false,
    phoneNumber: '',
    password: '',
    isRemenberPassword: true,
    phoneNumberError:false,
    passwordError:false,
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
    var phoneNumber = this.data.phoneNumber
    var password = this.data.password
    if (phoneNumber.length === 0 && password.length === 0) {
      this.shakeInput('phoneNumber')
      this.shakeInput('password')
      app.showToast("请输入手机号和密码")
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
    
    if (password.length === 0) {
      this.shakeInput('password')
      app.showToast("请输入密码")
      return
    }
    // wx.login({
    //   success: function (res) {
    //     console.log(res, res.code)
    //     //获取登录临时凭证
    //     var code = res.code;
    //     调用后端接口 获取微信的session_key 和 openID
    //     wx.request({
    //       url: 'http://localhost:8080/wxLogin?code=' + code,
    //       method: "post",
    //       success: function (resule) {
    //         console.log(resule);
    //       }
    //     })
    //   }
    // })
    // wx.setStorageSync("token", response.data.data.token)
    if (this.data.isRemenberPassword){
      wx.setStorageSync("token", "token")
    }
    
    app.globalData.token="token"

    wx.redirectTo({
      url: '../index/index',
    })
  },
  checkPhoneNumber(phone) {
    return (/^1[3456789]\d{9}$/.test(parseInt(phone)))
  },

  shakeInput(input){
    var that = this
    this.setData({
      [input + 'Error']: true
    }) 
    setTimeout(function () {
      that.setData({
        [input +'Error']: false
      })

    }, 1000)
  }
})