// pages/login-detail/login-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    logOut: function() {
        wx.showModal({
            title: '提示',
            content: '是否确认退出登录？',
            success: (result) => {
                if (result.confirm == true) {
                    wx.reLaunch({
                        url: '../login/login' // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

                    });
                }
            },
        })
    },
    closeDown: function() {
        wx.showModal({
            title: '提示',
            content: '是否确认关机？',
            success: (result) => {
                if (result.confirm == true) {
                    wx.reLaunch({
                        url: '../login/login' // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

                    });
                }
            },
        })
    },
    cancelLogin: function() {
        wx.showModal({
            title: '提示',
            content: '是否确认取消自动登录？',
            success: (result) => {
                if (result.confirm == true) {
                    wx.reLaunch({
                        url: '../login/login' // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

                    });
                }
            },
        })
    },
})