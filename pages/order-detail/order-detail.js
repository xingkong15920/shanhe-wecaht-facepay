Page({
    data: {
        server: 'https://api.51shanhe.com/p-server/',
        //server:'http://192.168.1.66:6017/p-server/',
        allPw: ''
    },
    leftArrow(){
        wx.navigateTo({
            url: '../order/order',
        })
    },
    onLoad(data) {
        console.log(data)
        this.getList(data.orderNumber)
    },
    // onShow() {
    //     wx.ix.onKeyEventChange((r) => {


    //         if (r.keyCode == 133) {
    //             wx.navigateBack({
    //                 delta: 1
    //             });
    //         }
    //     })
    // },
    getList(order) {
        var that = this
        var userInfo = wx.getStorageSync('userInfo')
        wx.request({
            url: that.data.server + 'bill/getOrderDetails',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'get',
            headers: {
                "token": userInfo.loginKey + '#FACE'
            },
            data: {
                // "institutionNumber":1004,
                // "merchantNumber":wx.getStorageSync('userInfo').merchantNumber
                "merchantNumber": userInfo.merchantNumber,
                "institutionNumber": userInfo.institutionNumber,
                "orderNumber": order

            },
            success: (resp) => {
                if (resp.data.code == '-1') {
                    wx.alert({
                        title: '',
                        content: resp.data.msg,
                        buttonText: '确定',
                        success: () => {
                            wx.reLaunch({
                                url: '../login/login'// 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

                            });
                        },
                    });
                }
                if (resp.data.code == 1000) {
                    that.setData({
                        dealMoney: resp.data.data.totalMoney,
                        orderState: resp.data.data.orderState,
                        yitui: parseFloat(resp.data.data.totalMoney) - parseFloat(resp.data.data.refundBalance),
                        refundBalance: resp.data.data.refundBalance,
                        orderPayType: resp.data.data.orderPayType,
                        storeName: resp.data.data.storeName,
                        userName: resp.data.data.userName,
                        time: resp.data.data.transactionTime,
                        orderNumber: resp.data.data.orderNumber
                    })

                } else {

                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    dayin() {
        var that = this

        if (wx.getStorageSync('dayin').data == null) {
            wx.showToast({
                content: "请先选择打印设备"
            });
        } else {
            var userInfo = wx.getStorageSync('userInfo')
            wx.ix.printer({
                target: wx.getStorageSync( 'dayin').data.id,
                cmds: [

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['闪盒收银'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单金额(元):' + that.data.dealMoney] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单状态:' + that.data.orderState] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['已退金额:' + that.data.yitui] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['可退金额:' + that.data.refundBalance] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['支付方式:' + that.data.orderPayType] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易门店:' + that.data.storeName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['收银员:' + that.data.userName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易日期:' + that.data.time] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单编号:' + that.data.orderNumber] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                ],
                success: (r) => {
                    console.log("success");
                },
                fail: (r) => {
                    console.log("fail, errorCode:" + r.error);
                }
            });
        }
    },
    dayin1() {
        var that = this

        if (wx.getStorageSync('dayin').data == null) {
            wx.showToast({
                content: "请先选择打印设备"
            });
        } else {
            var userInfo = wx.getStorageSync('userInfo')
            wx.ix.printer({
                target: wx.getStorageSync('dayin').data.id,
                cmds: [

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['闪盒收银'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单金额(元):' + that.data.dealMoney] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单状态:' + that.data.orderState] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['已退金额:' + that.data.yitui] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['支付方式:' + that.data.orderPayType] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易门店:' + that.data.storeName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['收银员:' + that.data.userName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易日期:' + that.data.time] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单编号:' + that.data.orderNumber] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                ],
                success: (r) => {
                    console.log("success");
                },
                fail: (r) => {
                    console.log("fail, errorCode:" + r.error);
                }
            });
        }
    },
    quantui() {
        this.setData({
            choose123: true,
            alltuikuan: true,
            allPw: ''
        })
    },
    allInput(e) {
        console.log(e)
        this.setData({
            allPw: e.detail.value
        })
    },
    closequan() {
        this.setData({
            choose123: false,
            alltuikuan: false,
            bufentuikuan: false
        })
    },
    goAllTui() {
        var that = this
        var pw = wx.getStorageSync('tuikuan').data
        if (that.data.allPw == '') {
            wx.showToast({
                content: '请输入退款密码'
            })
            return
        }
        if (that.data.allPw != pw) {
            wx.showToast({
                content: '请输入正确的退款密码'
            })
            return
        }
        var userInfo = wx.getStorageSync('userInfo')

        wx.showLoading({
            success: (res) => {

            },
        });
        wx.request({
            url: 'https://api.51shanhe.com/p-pay/refund/money',
            method: 'POST',

            data: {

                "insNumber": userInfo.institutionNumber,
                "merNumber": userInfo.merchantNumber,
                "refundAmount": that.data.refundBalance,
                "userNumber": userInfo.userNumber,
                "outTradeNo": that.data.orderNumber,
            },
            success: (resp) => {
                wx.hideLoading()
                if (resp.data.code == 1000) {
                    wx.showToast({
                        content: resp.data.msg
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            data: 'back'
                        });
                    }, 500)

                } else {
                    wx.showToast({
                        content: resp.data.msg
                    })
                }

            }
        })
    },
    bufentuikuan() {
        this.setData({
            choose123: true,
            bufentuikuan: true,
            bufenInput: '',
            bufenInput: ''
        })
    },
    bufenMoney(e) {
        this.setData({
            bufenMoney: e.detail.value
        })
    },
    bufenInput(e) {
        this.setData({
            bufenInput: e.detail.value
        })
    },
    goBufenTui() {
        var that = this
        var pw = wx.getStorageSync('tuikuan').data
        if (that.data.refundAmount < that.data.bufenMoney) {
            wx.showToast({
                content: '退款金额不可大于可退金额'
            })
            return
        }
        if (that.data.bufenInput == '') {
            wx.showToast({
                content: '请输入退款密码'
            })
            return
        }
        if (that.data.bufenInput != pw) {
            wx.showToast({
                content: '请输入正确的退款密码'
            })
            return
        }
        var userInfo = wx.getStorageSync('userInfo').data

        wx.showLoading({
            success: (res) => {

            },
        });
        wx.request({
            url: 'https://api.51shanhe.com/p-pay/refund/money',
            method: 'POST',

            data: {

                "insNumber": userInfo.institutionNumber,
                "merNumber": userInfo.merchantNumber,
                "refundAmount": that.data.bufenMoney,
                "userNumber": userInfo.userNumber,
                "outTradeNo": that.data.orderNumber,
            },
            success: (resp) => {
                wx.hideLoading()
                if (resp.data.code == 1000) {
                    wx.showToast({
                        content: resp.data.msg
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            data: 'back'
                        });
                    }, 500)

                } else {
                    wx.showToast({
                        content: resp.data.msg
                    })
                }

            }
        })
    },
});
