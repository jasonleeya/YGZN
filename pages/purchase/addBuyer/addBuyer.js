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
      list: ['管理员', '测试职位'],
      picked: null,
    },
    rank: {
      list: ['LV01', 'LV02'],
      picked: null,
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    if (!this.checkPhoneNumber(e.detail.value.phoneNumber)){
      app.showToast("业务员电话填写格式有误")
      return
    }
    if (!e.detail.value.rank) {
      app.showToast("请选择等级")
      return
    }

    var info = e.detail.value
    var flag = false
    var buyerList = this.store.data.selectBuyer.buyerList
    info.letter = chinese2pinyin(e.detail.value.name)[0][0].toUpperCase()

    buyerList.forEach(item => {
      if (item.letter === info.letter) {
        item.names.push(e.detail.value.name)
      } else {
        flag = true
      }
    })
    if (flag || buyerList.length === 0) {
      buyerList.push({
        letter: info.letter,
        names: [e.detail.value.name]
      })
    }

    wx.navigateBack()
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