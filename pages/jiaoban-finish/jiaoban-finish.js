Page({
    data: {
        time: '',
        name: '',
        money: '',
        count: '',
    },
    onLoad:function(data) {
        console.log('这是onLoad的data'+data)
        console.log(data)
        var that = this
        this.setData({
            time: data.time,
            // name: that.stringC(data.name),
            money: data.money,
            count: data.count
        })
    },
    leftArrow: function() {
        wx.navigateTo({
            url: '../main/main',
        })
    },
    back: function() {
        console.log('6666666')
        // wx.navigateBack({
        //     delta: 2
        // });
        wx.navigateTo({
            url: '../main/main',
        })
    },
    stringC:function(data) {
        console.log('这是stringC的data' + data)
        console.log(data)
        // if (data.length > 10) {
        //     return data.substring(0, 10) + '..'
        // } else {
        //     return data
        // }
    },
});
