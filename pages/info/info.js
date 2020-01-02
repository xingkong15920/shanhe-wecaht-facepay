Page({
    data: {},
    onLoad() {
        this.setData({
            version: wx.getStorageSync('version')
        })
        // wx.ix.getSysProp({
        //     key: 'ro.serialno',
        //     success: (r) => {
        //         console.log(r)
        //         this.setData({
        //             "equipmentNumber": r.value
        //         })

        //     }
        // })
        // wx.ix.getVersion({
        //     success: (r) => {
        //         this.setData({
        //             sdk: r.versionName + '-' + r.versionCode
        //         })
        //     }
        // });
    },
    set() {
        // wx.ix.startApp({
        //     appName: 'settings',
        // });
    },
    onShow() {
        // wx.ix.onKeyEventChange((r) => {


        //     if (r.keyCode == 133) {
        //         wx.navigateBack({
        //             delta: 1
        //         });
        //     }
        // })
    }
});
