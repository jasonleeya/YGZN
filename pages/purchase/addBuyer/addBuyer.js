import store from '../../../store'
import create from '../../../utils/create'
import chinese2pinyin from '../../../utils/chinese2pinyin.js'

var app = getApp()

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    position: {
      list: [],
      picked: null,
    },
    rank: {
      list: ['LV01', 'LV02'],
      picked: null,
    },
    findRoles: [],
    queryAllGrade:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setTitle("新增采购员")
    app.http("findRoles", {
      loginUserId: wx.getStorageSync("token")
    }).then(data => {
      var list = []
      data.list.forEach(item => {
        list.push(item.role_name)
      })
      this.setData({
        ["position.list"]: list,
        findRoles:data.list
      })
    })

    app.http("queryAllGrade", {}, true).then(data => {
      var list = []
      data.list.forEach(item => {
        list.push(item.name)
      })
      this.setData({
        ["rank.list"]: list,
        queryAllGrade:data.list
      })
    })


  },
  addSubmit(e) {
    if (!e.detail.value.position) {
      app.showToast("请选择职位")
      return
    }
    if (!e.detail.value.name) {
      app.showToast("请填写业务员名称")
      return
    }
    if (!e.detail.value.phoneNumber) {
      app.showToast("请填写业务员电话")
      return
    }
    if (!this.checkPhoneNumber(e.detail.value.phoneNumber)) {
      app.showToast("业务员电话填写格式有误")
      return
    }
    if (!e.detail.value.rank) {
      app.showToast("请选择等级")
      return
    }

    var value = e.detail.value
    // findRoles: [],
    //   queryAllGrade: []
    this.data.findRoles.forEach(item=>{
      if (item.role_name===value.rank){
        value.roleId=item.role_id
      }
    })
    this.data.queryAllGrade.forEach(item => {
      if (item.name === value.position) {
        value.grade = item.id
      }
    })

    app.http("insertSalesman",{
      roleId: value.roleId,
      userName: value.name,
      userPhone: value.phoneNumber,
      position: value.position,
      grade: value.grade,
      remark:value.remark,
    }).then(()=>{
      app.showToast("添加成功")
   
      wx.navigateBack({
        delta:1
      })
    })
    .catch(err=>{
      app.showToast("添加失败")
    }) 


  },

  pinkPosition: function(e) {
    this.setData({
      ["position.picked"]: e.detail.value
    })
  },
  pinkRank: function(e) {
    this.setData({
      ["rank.picked"]: e.detail.value
    })
  },
  checkPhoneNumber(phone) {
    return (/^1[3456789]\d{9}$/.test(parseInt(phone)))
  },
})