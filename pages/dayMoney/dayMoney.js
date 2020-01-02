Page({
    data: {
        server: 'https://api.51shanhe.com/p-server/',
        //server:'http://192.168.1.66:6017/p-server/',
        startTime: '',
        endTime: '',
        pageCount: 20,
        pageNo: 1,
        list: [],
        date: '2016-09-01',
    },
    onLoad() {
        var that = this
        console.log(that.getNowDate())
        that.setData({
            startTime: that.getNowDate1(),
            endTime: that.getNowDate()
        })
        that.getList()
    },
    // 日期选择器
    dateChangeBegin: function (e) {
        console.log('picker发送选择改变，携带值为1111', e.detail.value)
        this.setData({
            startTime: e.detail.value
        })
    },
    dateChangeEnd: function (e) {
        console.log('picker发送选择改变，携带值为2222', e.detail.value)
        this.setData({
            endTime: e.detail.value
        })
    },
    searchBtn() {
        this.setData({
            pageNo: 1
        })
        this.getList()
    },
    lower() {
        console.log('到底了')
        console.log(Math.ceil(this.data.count / this.data.pageCount))
        if (this.data.pageNo > Math.ceil(this.data.count / this.data.pageCount)) {
            wx.showToast({
                title: "没有更多数据",
                icon: 'none',
            })
            return
        }
        this.setData({
            pageNo: this.data.pageNo + 1
        })
        this.getList()

    },
    endTime1() {
        var that = this
        wx.datePicker({
            startDate: '2019-01-01',
            endDate: that.getNowDate(),
            success: (res) => {
                that.setData({
                    endTime: res.date
                })
            },
        });
    },
    getNowDate1() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + '01';
        return currentdate;

    },
    getNowDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;

    },
    getList() {
        wx.showLoading({
            success: (res) => {

            },
        });
        var that = this
        var userInfo = wx.getStorageSync('userInfo')
        wx.request({
            url: that.data.server + 'shift/getMerchantKnots',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'get',
            headers: {
                "token": userInfo.loginKey + '#AliFACE'
            },
            data: {

                "merchantNumber": userInfo.merchantNumber,
                "pageCount": that.data.pageCount,
                "pageNo": that.data.pageNo,
                "startTime": that.data.startTime,
                "endTime": that.data.endTime,
            },
            success: (resp) => {
                console.log(resp)
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
                    if (that.data.pageNo == 1) {
                        that.setData({
                            "list": resp.data.data.list,
                            "count": resp.data.data.count
                        })
                    } else {
                        var list = that.data.list
                        list = list.concat(resp.data.data.list)
                        that.setData({
                            "list": list,
                            "count": resp.data.data.count
                        })
                    }

                } else {

                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    onShow() {
        // wx.ix.onKeyEventChange((r) => {


        //     if (r.keyCode == 133) {
        //         wx.navigateBack({
        //             delta: 1
        //         });
        //     }
        // })
    },
});
