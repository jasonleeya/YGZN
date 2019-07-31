// components/indexes/indexes.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  list:{
    type: Array,
    observer(n){
      let li = [];
      for (let i = 0; i < 26; i++) {
        li[i] = {}
        li[i].letter = String.fromCharCode(65 + i)
        li[i].contain = false
       n.forEach(item => {

          if (item.letter === String.fromCharCode(65 + i)) {
            li[i].contain = true
          }
        })
      }
      this.setData({
        letters: li
      })
    }
  }
  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    letters: [],
    indexesTop: 0,
    rightBoxTop: 0,
    isShowFLoatBox: false,
    curLetter: 'A'
  },


  ready() {
  
    let li = [];
    for (let i = 0; i < 26; i++) {
      li[i]={}
      li[i].letter = String.fromCharCode(65 + i)
      li[i].contain=false
      this.data.list.forEach(item => {
       
        if (item.letter === String.fromCharCode(65 + i)) {
          li[i].contain = true
        }    
      })
    }
    this.setData({
      letters: li
    })
  
    let that = this;
    wx.createSelectorQuery().in(this).select('.indexes').boundingClientRect(function(res) {
      that.setData({
        indexesTop: res.top
      })
    }).exec()
    wx.createSelectorQuery().in(this).select('.index-box').boundingClientRect(function(res) {
      that.setData({
        rightBoxTop: res.top
      })
    }).exec();

  },
  /**
   * 组件的方法列表
   */
  methods: {
    boxTouchStart(e) {
      this.changeCurLetter(e.touches[0].clientY)
      this.setData({
        isShowFLoatBox: true,
      })
    },

    boxTouchMove(e) {
      this.changeCurLetter(e.touches[0].clientY)
    },

    changeCurLetter(moveY) {
      var index = Math.ceil((moveY - this.data.rightBoxTop) / 20)
      if (moveY > this.data.rightBoxTop && moveY < this.data.rightBoxTop + (20 * 26)) {
        this.data.list.forEach(item => {
          if (item.letter === this.data.letters[index - 1].letter) {
            this.setData({
              curLetter: this.data.letters[index - 1].letter
            })
          }
        })

      }
    },
    boxTouchEnd(e) {
      this.setData({
        isShowFLoatBox: false
      })
    },


  }
})