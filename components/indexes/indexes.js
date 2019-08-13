import chineseToPinyin from "../../utils/chinese2pinyin.js"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      observer(n) {

        this.initData(n)
        // let li = [];
        // for (let i = 0; i < 26; i++) {
        //   li[i] = {}
        //   li[i].letter = String.fromCharCode(65 + i)
        //   li[i].contain = false
        //   n.forEach(item => {

        //     if (item.letter === String.fromCharCode(65 + i)) {
        //       li[i].contain = true
        //     }
        //   })
        // }
        // this.setData({
        //   letters: li
        // })
      }
    },
    key: String
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
    curLetter: 'A',
    formatList: []
  },


  ready() {
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

    this.initData()

  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    initData(list=this.data.list) {
      var fList = []
      this.data.list.forEach(item => {
        // console.log(chineseToPinyin(item[this.data.key])[0][0].toUpperCase())
        var letter = chineseToPinyin(item[this.data.key])[0][0].toUpperCase()
        if (!fList.some(fItem => {
            if (fItem.letter === letter) {
              return true
            }
          })) {
          fList.push({
            letter: letter,
            names: [item[this.data.key]]
          })
        } else {
          fList.forEach(fListItem => {
            if (fListItem.letter === letter) {
              fListItem.names.push(item[this.data.key])
            }
          })
        }
      })

      let li = [];
      for (let i = 0; i < 26; i++) {
        li[i] = {}
        li[i].letter = String.fromCharCode(65 + i)
        li[i].contain = false
        fList.forEach(item => {

          if (item.letter === String.fromCharCode(65 + i)) {
            li[i].contain = true
          }
        })
      }

      fList.sort(this.compare("letter"))

      this.setData({
        letters: li,
        formatList: fList
      })
    },
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
        this.data.formatList.forEach(item => {
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

    selectItem(e) {
      this.triggerEvent("select", e.currentTarget.dataset.val)
    },
    compare(pro) {
      return function(obj1, obj2) {
        var val1 = obj1[pro];
        var val2 = obj2[pro];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    },
  }
})