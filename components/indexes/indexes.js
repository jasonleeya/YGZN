import chineseToPinyin from "../../utils/chinese2pinyin.js"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
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
    var fList=[]   //每个字母包含的姓名列表
    this.data.list.forEach(item => {
      var letter = chineseToPinyin(item[this.data.key])[0][0].toUpperCase()  //汉字转英文首字母

      if (!fList.some(fItem => {  //如果fList不包含此首字母的姓名则添加
        if (fItem.letter === letter ) {
            return true
          }
        })) {
        fList.push({
          letter: letter,
          names: [item[this.data.key]]
        })  
      }else{  //如果含有则找到该字母添加到该字母的姓名列表
        fList.forEach(fListItem=>{
          if (fListItem.letter===letter){
            fListItem.names.push(item[this.data.key])
          }
        })
      }
    })
    //26个字母
    let li = [];
    for (let i = 0; i < 26; i++) {
      li[i] = {}
      li[i].letter = String.fromCharCode(65 + i)
      li[i].contain = false
      fList.forEach(item => {
        //如果fList有该字母的姓名，contain设为true
        if (item.letter === String.fromCharCode(65 + i)) {
          li[i].contain = true
        }
      })
    }
    //将字母排序
    fList.sort(this.compare("letter"))
    this.setData({
      letters: li,
      formatList:fList
    }) 
    //获取组件和右侧字母高度
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
    //排序比较方法
    compare(pro) {
      return function (obj1, obj2) {
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
    boxTouchStart(e) {
      this.changeCurLetter(e.touches[0].clientY)
      this.setData({
        isShowFLoatBox: true,
      })
    },

    boxTouchMove(e) {
      this.changeCurLetter(e.touches[0].clientY)
    },
    //通过clientY确定点击的字母
    changeCurLetter(moveY) {
      var index = Math.ceil((moveY - this.data.rightBoxTop) / 20)
      //确定有效高度
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

  }
})