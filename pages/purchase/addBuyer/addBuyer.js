import store from '../../../store'
import create from '../../../utils/create'
import chinese2pinyin from '../../../utils/chinese2pinyin.js'

var app = getApp()

create(store, {
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  addSubmit(e){
  
    var info = e.detail.value
    var flag=false
    info.letter = chinese2pinyin(e.detail.value.name)[0][0]
    this.store.data.selectBuyer.buyerList.forEach(item=>{
      if(item.letter===info.letter){
        item.names.push(e.detail.value.name)
      }else{
      flag=true
      }
    })
    if(flag){
      this.store.data.selectBuyer.buyerList.push({
        letter: info.letter,
        names: [e.detail.value.name]
      })
    }
    
    wx.navigateBack()
  }
})