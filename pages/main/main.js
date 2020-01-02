Page({
    data: {
        server: 'https://api.51shanhe.com/p-pay/',
        //server:'http://192.168.1.66:6017/p-server/',
        network: false,
        equipmentNumber: 'SMIT3B2019729000825',
        sdk: '12314123132',
        list: [{
            'img': '../img/order.png',
            'text': '订单',
            'tap': 'order'
        },
        {
            'img': '../img/rijie.png',
            'text': '日结',
            'tap': 'dayMoney'
        },
        // {
        // 	'img': '../img/rijie.png',
        // 	'text': '充值',
        // 	'tap': 'recharge'
        // },
        {
            'img': '../img/jiaoban.png',
            'text': '交班',
            'tap': 'jiaoban'
        },
        {
            'img': '../img/dayin.png',
            'text': '打印',
            "icon": '../img/wu.png',
            'tap': 'dayin'
        },
        {
            'img': '../img/wangluo.png',
            'text': '网络',
            "icon": '../img/you.png'
        },
        {
            'img': '../img/moshi.png',
            'text': '模式',
            'tap': 'moshi'
        },
        {
            'img': '../img/shanghu.png',
            'text': '商户',
            'tap': 'shop'
        },
        {
            'img': '../img/guanyu.png',
            'text': '关于',
            'tap': 'about'
        },
        {
            'img': '../img/denglu.png',
            'text': '退出登录',
            'tap': 'login'
        },
        ],
        equipmentNumber: '',
        duankai: true
    },
    onLoad() {

        var that = this
        wx.onNetworkStatusChange(function (res) {
            console.log(JSON.stringify(res))
            that.aalert(JSON.stringify(res))
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

        // wx.ix.speech({
        // 	text: '欢迎使用闪盒支付',
        // 	success: (r) => {
        // 	}
        // });

        // wx.ix.getVersion({
        //     success: (r) => {
        //         this.setData({
        //             sdk: r.versionName + '-' + r.versionCode
        //         })
        //     }
        // });


        setInterval(function () {
            that.heart()
        }, 15000)
    },
    onPullDownRefresh() {
        console.log('123')
    },
    yidong() {
        console.log('123')
    },
    order() {
        wx.navigateTo({
            url: '../order/order'
        });
    },
    dayin() {
        wx.navigateTo({
            url: '../dayin/dayin'
        });
    },
    dayMoney() {
        wx.navigateTo({
            url: '../dayMoney/dayMoney'
        });
    },
    recharge() {
        wx.navigateTo({
            url: '../recharge/recharge'
        });
    },
    jiaoban() {
        wx.navigateTo({
            url: '../jiaoban-detail/jiaoban-detail'
        });
    },
    shop() {
        wx.navigateTo({
            url: '../merInfo/merInfo'
        });
    },
    about() {
        wx.navigateTo({
            url: '../info/info'
        });
    },
    moshi() {
        wx.navigateTo({
            url: '../modal/modal'
        });
    },
    set() {
        wx.ix.startApp({
            appName: 'settings',
        });
    },
    login() {
        wx.navigateTo({
            url: '../login-detail/login-detail'
        });
        // wx.showModal({
        //     title: '提示',
        //     content: '确定退出登录吗？',
        //     success: (result) => {
        //         if (result.confirm == true) {
        //             wx.removeStorageSync('userInfo');
        //             wx.reLaunch({
        //                 url: '../login/login' // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

        //             });
        //         }
        //     },
        // })
    },
    aalert(data) {
        wx.alert({
            title: '',
            content: data,
            buttonText: '我知道了',
            success: () => {
                // wx.alert({
                // 	title: '用户点击了「我知道了」',
                // });
            },
        });
    },
    heart() {
        var that = this
        var userInfo = wx.getStorageSync('userInfo')
        wx.request({
            url: that.data.server + 'heart/revice',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'POST',
            headers: {
                "token": userInfo.loginKey + '#AliFACE'
            },
            timeout: '3000',
            data: {

                "merchantNumber": userInfo.merchantNumber,
                "id": that.data.equipmentNumber,
                //"id": 'SMIT3B2019729000825',
                "appVersion": wx.getStorageSync('version'),
                "sdkVersion": that.data.sdk
            },
            success: (resp) => {
                var list = that.data.list
                if (resp.data.success == true) {
                    list[4].icon = '../img/you.png'
                    that.setData({
                        list: list
                    })
                    that.setData({
                        duankai: true
                    })
                } else {
                    list[4].icon = '../img/wu.png'
                    that.setData({
                        list: list
                    })
                    // wx.showToast({
                    // 	content: "网络错误，请检查网络"
                    // });
                }

            },
            fail: (resp) => {
                console.log(resp)
                if (that.data.duankai == true) {
                    var list = that.data.list
                    list[4].icon = '../img/wu.png'
                    that.setData({
                        list: list
                    })
                    // wx.showToast({
                    // 	content: "网络错误，请检查网络"
                    // });
                    that.setData({
                        duankai: false
                    })
                } else {

                }

            },
            complete: (resp) => {
                // console.log(resp)
                // console.log(resp)
                // var list = that.data.list
                // list[4].icon =  '../img/wu.png'
                // 	that.setData({
                // 		list:list
                // 	})
            }
        })

    },
    // onShow() {
    //     var that = this
    //     wx.ix.queryPrinter({
    //         success: (res) => {
    //             // that.aalert(JSON.stringify(res))
    //             if (res.usb.length == 0) {
    //                 var list = that.data.list
    //                 list[3].icon = '../img/wu.png'
    //                 this.setData({
    //                     list: list
    //                 })
    //             } else {
    //                 if (wx.getStorageSync('dayin') == null) {
    //                     var list = that.data.list
    //                     list[3].icon = '../img/wu.png'
    //                     this.setData({
    //                         list: list
    //                     })
    //                 } else {
    //                     var list = that.data.list
    //                     list[3].icon = '../img/you.png'
    //                     this.setData({
    //                         list: list
    //                     })
    //                 }
    //             }

    //         }
    //     }),
    //         wx.ix.onKeyEventChange((r) => {


    //             if (r.keyCode == 133) {
    //                 wx.navigateBack({
    //                     delta: 1
    //                 });
    //             }
    //         })

    // },
});