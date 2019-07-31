// components/indexes/indexes.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    buyerList: [{
        letter: "A",
        names: ["哎哎哎", "啊啊啊", '嗷嗷嗷']
      },
      {
        letter: "B",
        names: ["棒棒棒", "不不不", '别别别']
      },
      {
        letter: "D",
        names: ["滴滴滴", "大大大", '对对对']
      },
      {
        letter: "F",
        names: ["烦烦烦", "飞飞飞", '发发发']
      },
      {
        letter: "H",
        names: ["哈哈哈", "嘿嘿嘿", '呵呵呵']
      },
      {
        letter: "J",
        names: ["急急急", "京津冀", '建军节']
      }, {
        letter: "M",
        names: ["买买买", "喵喵喵", '么么么']
      }, {
        letter: "O",
        names: ["哦哦哦", "噢噢哦", '呕呕呕']
      }, {
        letter: "P",
        names: ["啪啪啪", "呸呸呸", '噗噗噗']
      }, {
        letter: "S",
        names: ["是是是", "事实上", '啥啥啥']
      }, {
        letter: "W",
        names: ["我问问", "我我我", '呜呜呜']
      }, {
        letter: "Z",
        names: ["啧啧啧", "转载自", '最最最']
      }
    ],
    letters: [],
    indexesTop: 0,
    rightBoxTop: 0,
    isShowFLoatBox: false,
    curLetter: 'A'
  },

  ready() {
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i]={}
      list[i].letter = String.fromCharCode(65 + i)
      list[i].contain=false
      this.data.buyerList.forEach(item => {
       
        if (item.letter === String.fromCharCode(65 + i)) {
          list[i].contain = true
        }    
      })
    }
    console.log(list) 

    this.setData({
      letters: list
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
        this.data.buyerList.forEach(item => {
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