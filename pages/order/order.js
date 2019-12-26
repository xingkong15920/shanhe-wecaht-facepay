var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();

Page({
    data: {
        server: 'https://api.51shanhe.com/p-server/',
        //server:'http://192.168.1.66:6017/p-server/',
        money: 0,
        count: 0,
        refound: 0,
        timeType: 0,
        startTime: '',
        endTime: '',
        orderPayType: '-1',
        orderState: '-1',
        pageCount: 20,
        pageNo: 1,
        list: [],
        choose: false,
        year: DATE_YEAR,
        month: DATE_MONTH,
        startT: Moment(new Date()).format('YYYY-MM-DD').split('-')[0] + '-' + Moment(new Date()).format('YYYY-MM-DD').split('-')[1] + '-' + Moment(new Date()).format('YYYY-MM-DD').split('-')[2],
        endT: Moment(new Date()).format('YYYY-MM-DD').split('-')[0] + '-' + Moment(new Date()).format('YYYY-MM-DD').split('-')[1] + '-' + Moment(new Date()).format('YYYY-MM-DD').split('-')[2],
        firstNum: Moment(new Date()).format('YYYY-MM-DD').split('-')[0] + Moment(new Date()).format('YYYY-MM-DD').split('-')[1] + Moment(new Date()).format('YYYY-MM-DD').split('-')[2],
        twoNum: Moment(new Date()).format('YYYY-MM-DD').split('-')[0] + Moment(new Date()).format('YYYY-MM-DD').split('-')[1] + Moment(new Date()).format('YYYY-MM-DD').split('-')[2],
        cNum: 0,
    },
    onLoad: function() {
       
        var userInfo = wx.getStorageSync('userInfo')
        // 						 var tjData = new Object() 

        // tjData.merchantNumber =  userInfo.merchantNumber,
        // 		tjData.shopNumber =  userInfo.storeNumber,
        // 		tjData.clerkNumber =  userInfo.userNumber,
        // 		tjData.userType = userInfo.userType,
        // 		tjData.userNumber = userInfo.userNumber
        var that = this
        console.log(that.getNowDate())
        that.setData({
            startTime: that.getNowDate(),
            endTime: that.getNowDate(),
        })


        this.createDateListData();
    },
    leftArrow() {
        wx.navigateTo({
            url: '../main/main',
        })
    },

    inputOrder: function(data) {
        this.setData({

        })
    },
    goGetList: function() {},
    getNowDate: function() {
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
    search: function() {
        console.log('这是search')
        this.setData({
            choose: true
        })
    },
    timeType: function(data) {
        console.log('123')
        this.setData({
            timeType: data.currentTarget.dataset.id
        })
        if (data.currentTarget.dataset.id == 3) {
            this.setData({
                chooseData: !this.data.chooseData
            })
        }
    },
    orderPayType: function(data) {
        this.setData({
            orderPayType: data.currentTarget.dataset.id
        })
    },
    orderState: function(data) {
        this.setData({
            orderState: data.currentTarget.dataset.id
        })
    },
    reset: function() {
        this.setData({
            timeType: 0,
            orderPayType: -1,
            orderState: -1,
        })
    },
    success: function() {
        this.setData({
            choose: false,
            pageNo: 1,
            startTime: this.data.startT,
            endTime: this.data.endT
        })
        this.getListdata()
    },
    orderDetail: function(data) {
        console.log(data)
        wx.navigateTo({
            url: '../order-detail/order-detail?orderNumber=' + data.currentTarget.dataset.order
        });
    },
    lower: function() {
        console.log('到底了')
        console.log(Math.ceil(this.data.count / this.data.pageCount))
        if (this.data.pageNo >= Math.ceil(this.data.count / this.data.pageCount)) {
            wx.showToast({
                content: "没有更多订单了"
            })
            return
        }
        this.setData({
            pageNo: this.data.pageNo + 1
        })
        this.getListdata()

    },
    upper: function() {
        // if(Math.round(this.data.count/this.data.pageCount) == 1){
        // 	return
        // }
        // this.setData({
        // 	pageNo:1
        // })
        // this.getListdata()
    },
    recharge: function() {
        wx.navigateTo({
            url: '../recharge/recharge'
        });
    },
    getListdata: function() {
        wx.showLoading({
            success: (res) => {

            },
        });
        var that = this
        console.log('这是that.data.startTime' + that.data.startTime)
        var userInfo = wx.getStorageSync('userInfo')
        wx.request({
            url: that.data.server + 'bill/getBillList',
            //url:'http://192.168.1.66:6017/p-server/bill/getNewHomeInfo',
            method: 'get',
            header: {
                "token": userInfo.loginKey + '#FACE'
            },
            data: {

                "merchantNumber": userInfo.merchantNumber,
                "shopNumber": userInfo.storeNumber,
                "clerkNumber": userInfo.userType == 4 ? '' : userInfo.userNumber,
                "userType": userInfo.userType,
                "userNumber": userInfo.userNumber,
                "timeType": that.data.timeType,
                "startTime": that.data.startTime,
                "endTime": that.data.endTime,
                "orderPayType": that.data.orderPayType,
                "orderState": that.data.orderState,
                "pageCount": that.data.pageCount,
                "pageNo": that.data.pageNo,

            },
            success: (resp) => {
                if (resp.data.code == '-1') {
                    console.log(resp.data.code)
                    // 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    // wx.alert({
                    //     title: '',
                    //     content: resp.data.msg,
                    //     buttonText: '确定',
                    //     success: () => {
                    //         wx.reLaunch({
                    //             url: '../login/login'// 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

                    //         });
                    //     },
                    // });
                }
                setTimeout(function () {
                    wx.hideLoading();
                }, 500)

                if (resp.data.code == 1000) {
                    if (that.data.pageNo == 1) {
                        that.setData({
                            "money": resp.data.data.allMoney,
                            "count": resp.data.data.allCount,
                            "refound": resp.data.data.refundMoney,
                            "list": resp.data.data.billList
                        })
                    } else {
                        var list = that.data.list
                        list = list.concat(resp.data.data.billList)
                        that.setData({
                            "money": resp.data.data.allMoney,
                            "count": resp.data.data.allCount,
                            "refound": resp.data.data.refundMoney,
                            "list": list
                        })
                    }

                } else {
                    that.setData({
                        "money": 0,
                        "count": 0,
                        "refound": 0,
                        "list": []
                    })
                    wx.showToast({
                        content: resp.data.msg,
                    });

                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    createDateListData: function() {
        var dateList = [];
        var now = new Date();
        /*
          设置日期为 年-月-01,否则可能会出现跨月的问题
          比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
            原因是由于2月份没有31号，顺推下去变成了了03-03
        */
        now = new Date(this.data.year, this.data.month, 1);
        for (var i = 0; i < 1; i++) {
            var momentDate = Moment(now).add(this.data.maxMonth - (this.data.maxMonth - i), 'month').date;
            var year = this.data.year;
            var month = this.data.month;
            console.log(month)
            var days = [];
            var totalDay = this.getTotalDayByMonth(year, month);
            var week = this.getWeek(year, month, 1);
            //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
            //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
            for (var j = 1; j <= totalDay; j++) {
                //var tempWeek = -1;
                // if (j > 0)
                //     tempWeek = this.getWeek(year, month, j);
                var clazz = '';
                // if (tempWeek == 0 || tempWeek == 6)
                //     clazz = 'week'
                // // if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
                //     //当天之前的日期不可用
                //     // clazz = 'unavailable ' + clazz;
                // else
                clazz = '' + clazz
                var day = j
                var month1 = month
                if (month1 < 10) month1 = '0' + month1
                if (day < 10) day = '0' + day
                days.push({
                    day: day,
                    class: clazz,
                    isA: year.toString() + month1 + day
                })
            }
            var dateItem = {
                id: year + '-' + month1,
                year: year,
                month: month1,
                days: days
            }
            console.log(dateItem)

            dateList.push(dateItem);
        }
        // var sFtv = this.data.sFtv;
        // for (let i = 0; i < dateList.length; i++){//加入公历节日
        //    for(let k = 0; k < sFtv.length; k++){
        //      if (dateList[i].month == sFtv[k].month){
        //        let days = dateList[i].days;
        //        for (let j = 0; j < days.length; j++){
        //          if (days[j].day == sFtv[k].day){
        //            days[j].daytext = sFtv[k].name
        //          }
        //        }
        //      }
        //    }
        // }
        this.setData({
            dateList: dateList
        });
        DATE_LIST = dateList;
    },
    yearjian: function() {
        this.setData({
            year: this.data.year - 1
        })
        this.createDateListData()
    },
    yearadd: function() {
        this.setData({
            year: this.data.year + 1
        })
        this.createDateListData()
    },
    monthjian: function() {
        if (this.data.month == 1) {
            this.setData({
                month: 12,
                year: this.data.year - 1
            })
        } else {
            this.setData({
                month: this.data.month - 1
            })
        }
        this.createDateListData()
    },
    monthadd: function() {
        if (this.data.month == 12) {
            this.setData({
                month: 1,
                year: this.data.year + 1
            })
        } else {
            this.setData({
                month: this.data.month + 1
            })
        }
        this.createDateListData()
    },
    /*
     * 获取月的总天数
     */
    getTotalDayByMonth: function(year, month) {
        month = parseInt(month, 10);
        var d = new Date(year, month, 0);
        return d.getDate();
    },
    /*
     * 获取月的第一天是星期几
     */
    getWeek: function(year, month, day) {
        var d = new Date(year, month - 1, day);
        return d.getDay();
    },
    /**
     * 点击日期事件
     */
    onPressDate: function(e) {
        var that = this
        console.log(e)
        var {
            year,
            month,
            day
        } = e.currentTarget.dataset;
        //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
        // if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return;

        var tempMonth = month;
        var tempDay = day;

        if (month < 10) tempMonth = '0' + month
        if (day < 10) tempDay = '0' + day

        var date = year + '-' + tempMonth + '-' + day;
        this.setData({
            cNum: this.data.cNum + 1
        })
        console.log(this.data.cNum % 2)
        var click = this.data.cNum % 2
        if (click == 1) {
            console.log('第一次点击')
            this.setData({
                firstNum: year.toString() + month + day,
                startT: year.toString() + '-' + month + '-' + day,
                twoNum: year.toString() + month + day,
                endT: year.toString() + '-' + month + '-' + day,
            })
        }
        if (click == 0) {
            console.log('第二次点击')
            this.setData({
                twoNum: year.toString() + month + day,
                endT: year.toString() + '-' + month + '-' + day,

            })
            var st = that.data.startT.split('-')[0] + that.data.startT.split('-')[1] + that.data.startT.split('-')[2]
            var et = that.data.endT.split('-')[0] + that.data.endT.split('-')[1] + that.data.endT.split('-')[2]
            console.log(st, et)
            if (st > et) {
                console.log('1111')
                var a = that.data.startT
                var b = that.data.endT

                that.setData({
                    startT: b,
                    endT: a,
                    startTime: b + '00:00:00',
                    endTime: a + '23:59:59'
                })
            } else {
                var a = that.data.startT
                var b = that.data.endT
                that.setData({
                    startTime: a + ' ' + '00:00:00',
                    endTime: b + ' ' + '23:59:59'
                })
            }
            setTimeout(function() {
                that.setData({

                    chooseData: false
                })

            }, 500)
        }
    },
    noClick: function(e) {
        console.log(e)
        // if (e.target.dataset.targetDataset.is == 0) {
        if (e.target.dataset.is == 0) {
            return
        }

        this.setData({
            chooseData: false,
        })
    },
    renderPressStyle: function(year, month, day) {
        var dateList = this.data.dateList;
        //渲染点击样式
        for (var i = 0; i < dateList.length; i++) {
            var dateItem = dateList[i];
            var id = dateItem.id;
            if (id === year + '-' + month) {
                var days = dateItem.days;
                for (var j = 0; j < days.length; j++) {
                    var tempDay = days[j].day;
                    if (tempDay == day) {
                        days[j].class = days[j].class + ' active';
                        days[j].inday = true;
                        break;
                    }
                }
                break;
            }
        }
        this.setData({
            dateList: dateList
        });
    },
    cToday: function() {
        console.log(this.getDateStr(null, 0))
        this.setData({
            today: 0,
            startT: this.getDateStr(null, 0),
            endT: this.getDateStr(null, 0),
            firstNum: this.getList(this.getDateStr(null, 0)),
            twoNum: this.getList(this.getDateStr(null, 0)),
        })
        this.getData()
    },
    cYesday: function() {
        console.log(this.getDateStr(null, -1))
        this.setData({
            today: 1,
            startT: this.getDateStr(null, -1),
            endT: this.getDateStr(null, -1),
            firstNum: this.getList(this.getDateStr(null, -1)),
            twoNum: this.getList(this.getDateStr(null, -1)),
        })
        this.getData()
    },
    cLastSeven: function() {
        console.log(this.getDateStr(null, -6))
        this.setData({
            today: 2,
            startT: this.getDateStr(null, -6),
            endT: this.getDateStr(null, -0),
            firstNum: this.getList(this.getDateStr(null, -6)),
            twoNum: this.getList(this.getDateStr(null, 0)),
        })
        this.getData()
    },
    getDateStr: function(today, addDayCount) {
        var dd;
        if (today) {
            dd = new Date(today);
        } else {
            dd = new Date();
        }
        dd.setDate(dd.getDate() + addDayCount); //获取AddDayCount天后的日期 
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期 
        var d = dd.getDate();
        if (m < 10) {
            m = '0' + m;
        };
        if (d < 10) {
            d = '0' + d;
        };
        return y + "-" + m + "-" + d;
    },
    getList: function(data) {
        var list = data.split('-')
        var str = '';
        for (var i = 0; i < list.length; i++) {
            str += list[i]
        }
        return str
    },
    onShow: function() {
        var that = this
        that.getListdata()
        // wx.ix.onKeyEventChange((r) => {


        //     if (r.keyCode == 133) {
        //         wx.navigateBack({
        //             delta: 1
        //         });
        //     }
        // })
    }

});