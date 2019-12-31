Page({
    data: {
        server: 'https://api.51shanhe.com/p-server/',
        //server:'http://192.168.1.66:6017/p-server/',
        jbInfo: '',
        isDetail: false,
        chongzhiheji: "0.00"
    },
    onLoad(data) {
        console.log(data)

        if (data.isDetail == 'true') {
            console.log(data)
            this.setData({
                jbInfo: JSON.parse(data.info),
                isDetail: true
            })
        } else {

            this.getList()
        }
    },
    leftArrow() {
        wx.navigateTo({
            url: '../main/main',
        })
    },
    getList() {
        var that = this
        var userInfo = wx.getStorageSync('userInfo')
        wx.showLoading({
            success: (res) => {

            },
        });
        wx.request({
            url: that.data.server + 'shift/getSummary',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'get',
            headers: {
                "token": userInfo.loginKey + '#AliFACE'
            },
            data: {

                "merchantNumber": userInfo.merchantNumber,
                "storeNumber": userInfo.storeNumber,
                "clerkNumber": userInfo.userNumber,

            },
            success: (resp) => {
                wx.hideLoading();
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
                        jbInfo: resp.data.data,
                        chongzhiheji: parseFloat(resp.data.data.memWxRechargeMoney) + parseFloat(resp.data.data.memAliRechargeMoney) + parseFloat(resp.data.data.memCashRechargeMoney)
                    })
                } else {

                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    jiaoban() {
        console.log('这是交班记录')
        wx.navigateTo({
            url: '../jiaoban-finish/jiaoban-finish'
        });
        var that = this
        var userInfo = wx.getStorageSync('userInfo')
        wx.showLoading({
            success: (res) => {

            },
        });
        wx.request({
            url: that.data.server + 'shift/addNewSummary',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'GET',
            headers: {
                "token": userInfo.loginKey + '#AliFACE'
            },
            data: {

                "merchantNumber": userInfo.merchantNumber,
                "storeNumber": userInfo.storeNumber,
                "clerkNumber": userInfo.userNumber,
                "startTime": that.data.jbInfo.startTime,
                "endTime": that.data.jbInfo.endTime
            },
            success: (resp) => {
                wx.hideLoading();
                wx.showToast({
                    title: resp.data.msg,
                    icon: 'none',
                });
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
                    setTimeout(function () {

                        wx.navigateTo({
                            url: '../jiaoban-finish/jiaoban-finish?time=' + that.data.jbInfo.endTime + '&name=' + userInfo.userName + '&money=' + resp.data.data.aliMoney + '&count=' + resp.data.data.allCount
                        })
                    }, 1000)
                } else {

                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    record() {
        wx.navigateTo({
            url: '../jiaoban-record/jiaoban-record'
        });
    },
    onShow(data) {
        // wx.alert({
        // 	content:JSON.stringify(data)
        // })
        // this.getList()
        
        	
        // wx.ix.onKeyEventChange((r) => {


        //     if (r.keyCode == 133) {
        //         wx.navigateBack({
        //             delta: 1
        //         });
        //     }
        // })

    },
    dayin() {
        console.log('22222222222')
        console.log(wx.getStorageSync('dayin'))
        var that = this
        var jbInfo = that.data.jbInfo
        if (wx.getStorageSync('dayin') == null) {
            wx.showToast({
                title: '请先选择打印设备',
                icon: 'none',
            });
        } else {
            var userInfo = wx.getStorageSync('userInfo')
            wx.ix.printer({
                target: wx.getStorageSync('dayin').id,
                cmds: [

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['交班记录'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['实收总额(元):' + jbInfo.allMoney] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['开始时间:' + jbInfo.startTime] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['结束时间:' + jbInfo.endTime] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['收款统计'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['微信收款：' + jbInfo.wxCount + '笔   ' + jbInfo.wxMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['支付宝收款：' + jbInfo.aliCount + '笔   ' + jbInfo.aliMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['会员收款：' + jbInfo.memConsumCount + '笔   ' + jbInfo.memConsumMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['收款合计：' + jbInfo.allCount + '笔   ' + jbInfo.allMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['退款统计'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['微信退款：' + jbInfo.wxRefundCount + '笔   ' + jbInfo.wxRefundMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['支付宝退款：' + jbInfo.aliRefundCount + '笔   ' + jbInfo.aliRefundMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['会员退款：' + jbInfo.memRefundCount + '笔   ' + jbInfo.memRefundMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['退款合计：' + jbInfo.refundCount + '笔   ' + jbInfo.refundMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['充值统计'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['微信充值：' + jbInfo.memWxRechargeCount + '笔   ' + jbInfo.memWxRechargeMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['支付宝充值：' + jbInfo.memAliRechargeCount + '笔   ' + jbInfo.memAliRechargeMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['现金充值：' + jbInfo.memCashRechargeCount + '笔   ' + jbInfo.memCashRechargeMoney + '元'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['充值合计：' + (jbInfo.memWxRechargeCount + jbInfo.memAliRechargeCount + jbInfo.memCashRechargeCount) + '笔   ' + that.data.chongzhiheji + '元'] },
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
});
