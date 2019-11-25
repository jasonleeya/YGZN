let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeInput: 'name',
    name: "",
    phoneNumber: '',
    company: "",
    password: "",
    confirmPassword: "",
    phoneNumberError: false,
    passwordError: false,
    confirmPasswordError: false,
    referrerId:"",
    salesmanId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (typeof options.referrerId !== 'undefined' && typeof options.salesmanId!=='undefined'){
      this.setData({
        referrerId: options.referrerId,
        salesmanId: options.salesmanId
      })
    } 
  },
  onShow: function() {

  },
  focus(e) {
    this.setData({
      activeInput: e.currentTarget.dataset.name
    })
  },
  input(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  register() {
    if (this.data.name === "") {
      app.showToast("请输入姓名")
      this.shakeInput("name")
      return
    }
    if (this.data.phoneNumber === "") {
      app.showToast("请输入手机号码")
      this.shakeInput("phoneNumber")
      return
    }
    if (!this.checkPhoneNumber(this.data.phoneNumber)) {
      app.showToast("手机号码有误")
      this.shakeInput("phoneNumber")
      return
    }
    if (this.data.company === "") {
      app.showToast("请输入公司名称")
      this.shakeInput("company")
      return
    }
    if (this.data.password === "") {
      app.showToast("请输入密码")
      this.shakeInput("password")
      return
    }
    if (this.data.password !== this.data.confirmPassword) {
      app.showToast("两次输入密码不一致")
      this.shakeInput("confirmPassword")
      return
    } 
    app.http("registered", {
      userName: this.data.company,
      userNameVo: this.data.name,
      userPhoneVo: this.data.phoneNumber,
      userPwdVo: this.data.password,
      blNumber: "",
      referrerId: this.data.referrerId,
      salesmanId: this.data.salesmanId
    }).then(data=>{
      if(data.success){
        app.showToast("注册成功")
        setTimeout(()=>{
          wx.redirectTo({
            url: '/pages/login/login?phoneNumber=' + this.data.phoneNumber +"&openId=",
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        },500)
      }
    }).catch(err=>{
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
  toLogin(){
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }
})