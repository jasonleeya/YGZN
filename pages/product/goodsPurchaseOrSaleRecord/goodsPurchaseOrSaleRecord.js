let app = getApp()
Page({


  data: {
    orderType: "",
    orderList: []
  },

  onLoad: function(options) {
    this.setData({
      orderType: options.orderType
    })
    switch (options.orderType) {
      case "purchase":
        app.setTitle("销售记录")
        app.http("fetchPurchaseRecord", {
          goodsNo: options.goodsNo,
          currentPage: 1,
          pageSize: 10000,
          wareHouse: options.wareHouse
        }).then(data => {
          data.list.forEach(item => {
            item.goodsDealTimeSale = new Date(item.goodsDealTimeSale).toLocaleDateString().replace(/\//g, "-")
            item.goodsDealTimePurchase = new Date(item.goodsDealTimePurchase).toLocaleDateString().replace(/\//g, "-")
          })
          this.setData({
            orderList: data.list
          })
        })
        break
      case "sale":
        app.setTitle("采购记录")
        app.http("fetchSaleRecord", {
          goodsNo: options.goodsNo,
          currentPage: 1,
          pageSize: 10000,
          wareHouse: options.wareHouse
        }).then(data => {
          data.list.forEach(item => {
            item.goodsDealTimeSale = new Date(item.goodsDealTimeSale).toLocaleDateString().replace(/\//g, "-")
            item.goodsDealTimePurchase = new Date(item.goodsDealTimePurchase).toLocaleDateString().replace(/\//g, "-")
          })
          this.setData({
            orderList: data.list
          })
        })
        break
    }
    this.setData({
      orderType: options.orderType
    })
  },
})