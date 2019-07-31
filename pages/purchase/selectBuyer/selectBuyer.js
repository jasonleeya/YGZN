import store from '../../../store'
import create from '../../../utils/create'
var app = getApp()

create(store, {
  data: {
    hidden: true,
    list: [{
      initial: "张",
      initialLetter: 'z',
      names: ["张三1", "张三2", "张三3", "张三4"]
    }, {
      initial: "李",
      initialLetter: 'l',
      names: ["李四1", "李四2", "李四3"]
    }, {
      initial: "王",
      initialLetter: 'w',
      names: ["王五1", "王五2", "王五3", "王五4", "王五5", ]
    }, ]
  },



  
  // onLoad() {
  //   // let list = [];
  //   // for (let i = 0; i < 26; i++) {
  //   //   list[i] = String.fromCharCode(65 + i)
  //   // }
  //   // this.setData({
  //   //   list: list,
  //   //   listCur: list[0]
  //   // })
  // },
  // onReady() {
  //   let that = this;
  //   wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
  //     that.setData({
  //       boxTop: res.top
  //     })
  //   }).exec();
  //   wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
  //     that.setData({
  //       barTop: res.top
  //     })
  //   }).exec()
  // },
  // //获取文字信息
  // getCur(e) {
  //   this.setData({
  //     hidden: false,
  //     listCur: this.data.list[e.target.id],
  //   })
  // },

  // setCur(e) {
  //   this.setData({
  //     hidden: true,
  //     listCur: this.data.listCur
  //   })
  // },
  // //滑动选择Item
  // tMove(e) {
  //   let y = e.touches[0].clientY,
  //     offsettop = this.data.boxTop,
  //     that = this;
  //   //判断选择区域,只有在选择区才会生效
  //   if (y > offsettop) {
  //     let num = parseInt((y - offsettop) / 20);
  //     this.setData({
  //       listCur: that.data.list[num]
  //     })
  //   };
  // },

  // //触发全部开始选择
  // tStart() {
  //   this.setData({
  //     hidden: false
  //   })
  // },

  // //触发结束选择
  // tEnd() {
  //   this.setData({
  //     hidden: true,
  //     listCurID: this.data.listCur.initialLetter
  //   })
  // },
  // indexSelect(e) {
  //   let that = this;
  //   let barHeight = this.data.barHeight;
  //   let list = this.data.list;
  //   let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
  //   for (let i = 0; i < list.length; i++) {
  //     if (scrollY < i + 1) {
  //       that.setData({
  //         listCur: list[i],
  //         movableY: i * 20
  //       })
  //       return false
  //     }
  //   }
  // }
});