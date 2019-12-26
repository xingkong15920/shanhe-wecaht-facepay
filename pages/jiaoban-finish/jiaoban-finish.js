Page({
    data: {
        time: '',
        name: '',
        money: '',
        count: '',
    },
    // onLoad(data) {
    //     console.log(data)
    //     var that = this
    //     this.setData({
    //         time: data.time,
    //         name: that.stringC(data.name),
    //         money: data.money,
    //         count: data.count
    //     })
    // },
    leftArrow() {
        wx.navigateTo({
            url: '../main/main',
        })
    },
    back() {
        console.log('6666666')
        // wx.navigateBack({
        //     delta: 2
        // });
        wx.navigateTo({
            url: '../main/main',
        })
    },
    // stringC(data) {
    //     if (data.length > 10) {
    //         return data.substring(0, 10) + '..'
    //     } else {
    //         return data
    //     }
    // },
});
