Page({
    data: {
        server: 'https://api.51shanhe.com/p-member/',
        //server:'http://192.168.1.66:6017/p-server/',

        pageCount: 20,
        pageNo: 1,
        list: [],
        cheBox: true,
    },
    onLoad() {
        var that = this
        console.log(that.getNowDate())
        that.setData({
            startTime: that.getNowDate(),
            endTime: that.getNowDate()
        })
        that.getList()
    },
    cheXiao(e) {
        var that = this
        console.log(e)
        console.log(e.target.dataset.phone)
        console.log(e.target.dataset.id)
        that.setData({
            id: e.target.dataset.id,
        })
        wx.showModal({
            title: '提示',
            content: '是否确认撤销该笔充值？',
            cancelColor:'#FC5548',
            confirmColor:'#333333',
            success(res) {
                if (res.confirm) {
                    // 撤销充值的接口
                    that.cheList()
                    

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 撤销充值的接口
    cheList(e) {
        var that = this
        
        var userInfo = wx.getStorageSync('userInfo')
        wx.showLoading({
            success: (res) => {

            },
        });
        wx.request({
            url: 'https://api.51shanhe.com/p-member/recharge/updateStateByOrderNo',
            method: 'POST',
            headers:{
                'Content-Type': 'application/json' 
            },
            data: {
                "rechargeRecordNo": that.data.id,
            },
            success: (resp) => {
                console.log(resp)
           
                    wx.hideLoading();
              
                if (resp.data.code == 5000) {
                    console.log('这是5000')
                    console.log(resp.data)
                    // if (that.data.pageNo == 1) {
                    //     var list = that.data.list
                    //     list = list.concat(resp.data.data.rechargeTurnovers)
                    //     that.setData({
                    //         list: list,
                    //         count: resp.data.data.count
                    //     })
                    // }
                    wx.showToast({
                        title: resp.data.msg,
                        icon: 'none'
                    })
                } else if (resp.data.code == 1000){
                    that.getList()
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
    lower() {
        console.log('到底了')
        console.log(Math.ceil(this.data.count / this.data.pageCount))
        if (this.data.pageNo >= Math.ceil(this.data.count / this.data.pageCount)) {
            wx.showToast({
                title: "没有更多订单了",
                icon:'none'
            })
            return
        }
        this.setData({
            pageNo: this.data.pageNo + 1
        })
        this.getList()

    },
    getList() {
        var that = this
        var userInfo = wx.getStorageSync('userInfo')
        wx.showLoading({
            success: (res) => {

            },
        });
        console.log('1111111111111111')
        console.log(userInfo)
        wx.request({
            url: that.data.server + 'turnover/getTurnovers',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'get',
            // headers:{
            // 	"token":userInfo.loginKey + '#AliFACE'
            // },
            data: {

                "merchantNumber": userInfo.merchantNumber,
                // "shopNumber": userInfo.storeNumber,
                // "clerkNumber": userInfo.userNumber,
                // "startTime":that.data.startTime + ' 00:00:00',
                // "endTime":that.data.endTime + ' 23:59:59',
                "limit": that.data.pageCount,
                "page": that.data.pageNo,

            },
            success: (resp) => {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1000)
                if (resp.data.code == '-1') {
                    wx.alert({
                        title: '',
                        content: resp.data.msg,
                        buttonText: '确定',
                        success: () => {
                            wx.reLaunch({
                                url: '../login/login' // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

                            });
                        },
                    });
                }
                if (resp.data.code == 1000) {
                    console.log('这是resp')
                    console.log(resp)
                    console.log(that.data.pageNo)
                    if (that.data.pageNo == 1) {
                        that.setData({
                            list: resp.data.data.rechargeTurnovers,
                            count: resp.data.data.count
                        })
                    } else {
                        var list = that.data.list
                        list = list.concat(resp.data.data.rechargeTurnovers)
                        that.setData({
                            list: list,
                            count: resp.data.data.count
                        })
                    }
                } else {

                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    }
});