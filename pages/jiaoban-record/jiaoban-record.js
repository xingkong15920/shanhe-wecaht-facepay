Page({
    data: {
        server: 'https://api.51shanhe.com/p-server/',
        //server:'http://192.168.1.66:6017/p-server/',
        startTime: '',
        endTime: '',
        pageNo: 1,
        pageCount: 20,
        list: [],
        choose: false
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
    leftArrow() {
        console.log('这是')
        wx.navigateTo({
            url: '../jiaoban-detail/jiaoban-detail',
        })
    },
    searchBtn() {
        this.setData({
            pageNo: 1
        })
        this.getList()
    },
    // startTime1() {
    //     var that = this
    //     wx.datePicker({
    //         startDate: '2019-01-01',
    //         endDate: that.getNowDate(),
    //         success: (res) => {
    //             that.setData({
    //                 startTime: res.date
    //             })
    //         },
    //     });
    // },
     // endTime1() {
    //     var that = this
    //     wx.datePicker({
    //         startDate: '2019-01-01',
    //         endDate: that.getNowDate(),
    //         success: (res) => {
    //             that.setData({
    //                 endTime: res.date
    //             })
    //         },
    //     });
    // },
    startTime1: function (e) {
        this.setData({
            startTime: e.detail.value
        })
    },
    endTime1: function (e) {
        this.setData({
            endTime: e.detail.value
        })
    },
    lower() {
        console.log('到底了')
        console.log(Math.ceil(this.data.count / this.data.pageCount))
        if (this.data.pageNo > Math.ceil(this.data.count / this.data.pageCount)) {
            wx.showToast({
                content: "没有更多数据"
            })
            return
        }
        this.setData({
            pageNo: this.data.pageNo + 1
        })
        this.getList()

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
    getList() {
        var that = this
        var userInfo = wx.getStorageSync('userInfo')
        wx.showLoading({
            success: (res) => {

            },
        });
        wx.request({
            url: that.data.server + 'shift/getShifts',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'get',
            headers: {
                "token": userInfo.loginKey + '#AliFACE'
            },
            data: {

                "merchantNumber": userInfo.merchantNumber,
                "storeNumber": userInfo.storeNumber,
                "clerkNumber": userInfo.userNumber,
                "pageCount": that.data.pageCount,
                "pageNo": that.data.pageNo,
                "startTime": that.data.startTime + ' 00:00:00',
                "endTime": that.data.endTime + ' 23:59:59',

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
                    var dList = resp.data.data.billResultInfos
                    for (var i = 0; i < dList.length; i++) {
                        if (dList[i].operatorName.length > 3) {
                            dList[i].operatorName = dList[i].operatorName.substring(0, 3) + '..'
                        }
                    }
                    if (that.data.pageNo == 1) {
                        that.setData({
                            list: dList,
                            count: resp.data.data.count
                        })
                    } else {
                        var list = that.data.list
                        list = list.concat(dList)
                        that.setData({
                            list: list,
                            count: resp.data.data.count
                        })
                    }
                } else {
                    wx.showToast({
                        content: resp.data.msg
                    });
                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
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
    detail(data) {
        console.log(data)
        wx.navigateTo({
            url: '../jiaoban-detail/jiaoban-detail?isDetail=true&info=' + JSON.stringify(data.currentTarget.dataset.info)
        });
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
});
