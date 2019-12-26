Page({
    data: {},
    onLoad() {
        var that = this
        var userInfo = wx.getStorageSync('userInfo').data
        that.setData({
            // merchantName: that.stringC(userInfo.merchantName),
            // shopName: that.stringC(userInfo.storeName),
            // userName: that.stringC(userInfo.userName)
        })
    },
    leftArrow() {
        wx.navigateTo({
            url: '../main/main',
        })
    },
    stringC(data) {
        if (data.length > 10) {
            return data.substring(0, 10) + '..'
        } else {
            return data
        }
    },
    // onShow() {
    //     wx.ix.onKeyEventChange((r) => {
    //         if (r.keyCode == 133) {
    //             wx.navigateBack({
    //                 delta: 1
    //             });
    //         }
    //     })
    // }
});
