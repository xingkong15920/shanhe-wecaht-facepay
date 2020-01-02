
Page({
    data: {
        pay: true,
        institutionNumber: 1004,
        equipmentNumber: '',
        posid: 'idle_pos',
        audible: true,
        advImgList: ['../img/index-top.png'],
        advImg: '',
        imgNo: 0,
        name: '',
        phone: '',
        info: false,
        tuikuan: false,
        tuikuanInfo: '退款中...',
        left: 390,
        top: 120,
        left1: '',
        top1: '',
        syPc: true,
        userInfoType: false,
        nnn: 1,
        box1: false,       //初始页面
        box2: true,        //确认支付
        box3: false,       //订单支付3个
        payT: 1,           //切换订单支付123
        payS: false,       //支付成功
        openCardBox: false,     //开卡有礼页面
        money: 0,        //订单金额
        headImg: '../img/shan.png',
        nickName: '',
        allBalance: 0,        //余额
        balancePayment: 0,      //余额支付(自定义)
        mDiscount: '0',         //会员优惠（自定义）
        errorPayment: '',          //错误的余额支付
        disCountRate: '',          //折扣
        bpButton: true,           //余额支付按钮
        cpButton: true,           //取消支付按钮
        discountHeight: '114rpx',  //可用优惠券右边向下的箭头
        mdText: true,               //会员优惠按钮
        preferentialNum: 0,        //优惠合计
        giveIntegral: 0,                //积分奖励
        mdDiscont: true,           //会员享受折优惠，每消费元积分
        voucherList: '',             //优惠券数组
        discount: '1',             //折扣 
        dcNum: 0,               //可用优惠券上边的优惠券
        voucherNo: '',        //使用优惠券的金额
        isUseVip: false,     //是否可以使用会员支付
        ocGetCode: true,       //获取验证码or重新发送(59s)
        ocPleasePhone1: '',     //请输入手机号
        ocPleasePhone2: '',     //请输入验证码
        codeInfo: '59',          //倒计时60s
        mebInfo: [],               //点击会员支付，传参给发送验证码，
        rfMoney: 0,              //插件金额
        querenType: false,          //确认是否
        goHide: 0
    },
    goHide() {
        var num = this.data.goHide
        this.setData({
            goHide: num + 1
        })
        if (num == 5) {
            this.setData({
                box1: false,
                openCardBox: true
            })
        }
        var that = this
        setTimeout(function () {
            that.setData({
                goHide: 0
            })
        }, 1000)

    },
    start(res) {
        console.log(res)
        this.setData({
            left1: this.data.left - res.changedTouches[0].clientX,
            top1: this.data.top - res.changedTouches[0].clientY
        })
    },
    querenQX() {
        this.setData({
            querenType: false
        })
    },
    onGetAuthorize(res) {
        var that = this
        that.setData({
            querenType: false
        })
        wx.getOpenUserInfo({
            fail: (res) => {
            },
            success: (res) => {

                // let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
                var userRes = res.response
                var tjData = new Object()
                userRes.userId = that.data.cardUserId
                tjData.institutionNumber = that.data.institutionNumber
                tjData.merchantNumber = wx.getStorageSync('userInfo').merchantNumber
                tjData.memberInfo = JSON.stringify(userRes)
                tjData.phone = that.data.ocPleasePhone1
                tjData.msgCode = that.data.ocPleasePhone2
                tjData.wxOrAliType = 1
                // tjData.                 wx.showLoading()


                wx.request({
                    url: 'https://api.51shanhe.com/p-member/card/smallJourneyReMember',
                    method: 'POST',
                    data: JSON.stringify(tjData),
                    headers: {
                        'content-type': 'application/json'
                    },
                    success: (resp) => {
                        // that.aalert(resp)
                        wx.hideLoading();
                        if (resp.data.code != 1000) {
                            wx.showToast({
                                title: resp.data.msg,
                                icon: 'none'
                            })
                        } else {
                            wx.ix.speech({
                                text: '开卡成功',
                                success: (r) => {
                                }
                            });
                            that.setData({
                                box2: true,
                                openCardBox: false,
                                ocPleasePhone1: '',
                                ocPleasePhone2: '',
                            })
                        }

                    },
                    fail: (err) => {
                        wx.hideLoading();
                        that.aalert(err.msg)
                        console.log('error', err);
                    },
                });

            }
        });
    },
    plClose() {
        this.setData({
            box1: true,
            payS: false,
            box2: false,
            money: 0,
            allBalance: 0,
            balancePayment: 0,
            mDiscount: 0,
            preferentialNum: 0,
            giveIntegral: 0,
            rfMoney: 0,
            openCardBox: false
        })
    },
    // 开卡有礼:版本1  Begin
    // 60s倒计时
    daojishi() {
        var timer;
        var that = this
        // if(that.data.ocGetCode == true){
        // 	that.setData({
        // 		codeInfo:5
        // 	})
        // }
        timer = setInterval(function () {
            if (that.data.codeInfo == 0) {
                clearInterval(timer)
                that.setData({
                    codeInfo: '59',
                    ocGetCode: true
                })
            } else {
                var codeInfo = that.data.codeInfo
                that.setData({
                    codeInfo: codeInfo - 1
                })
            }

        }, 1000)
    },
    // 点击获取验证码按钮
    ocGetV() {
        var that = this
        // 正则验证手机号
        var ocPleasePhone1 = that.data.ocPleasePhone1;
        if (ocPleasePhone1 == '') {
            wx.showToast({
                title: '手机号不能为空',
            })
            return
        } else if (ocPleasePhone1.length != 11) {
            wx.showToast({
                title: '手机号长度有误！',
                icon: 'none',
                duration: 1500
            })
            return
        }
        var myreg1 = /^[1]([3-9])[0-9]{9}$/;
        if (!myreg1.test(ocPleasePhone1)) {
            wx.showToast({
                title: '手机号有误！',
                icon: 'success',
                duration: 1500
            })
            return
        }
        var memberInfo = that.data.mebInfo
        memberInfo.userId = that.data.cardUserId
        wx.request({
            //  会员卡，注册会员，发送验证码接口
            url: 'https://api.51shanhe.com/p-member/card/memberIsExistence',
            method: 'POST',
            data: {
                "institutionNumber": that.data.institutionNumber,
                "merchantNumber": wx.getStorageSync('userInfo').merchantNumber,
                "wxOrAliType": 1,
                "phone": that.data.ocPleasePhone1,
                "memberInfo": JSON.stringify(memberInfo),
            },
            success: (resp) => {
                console.log(resp)
                wx.setStorageSync('payInfo', resp.data.data);
                if (resp.data.code == 1000) {
                    //获取验证码页面隐藏，倒计时显示
                    that.setData({
                        ocGetCode: false
                    })
                    // 59s倒计时
                    that.daojishi()
                } else {
                    wx.showToast({
                        title: resp.data.msg,
                    })
                }
            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    // 立即开卡按钮
    ocImmediately() {
        var that = this
        // 正则验证手机号
        var ocPleasePhone1 = that.data.ocPleasePhone1;
        if (ocPleasePhone1 == '') {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            });
            return
        } else if (ocPleasePhone1.length != 11) {
            wx.showToast({
                title: '手机号长度有误！',
                icon: 'none'
            })
            return
        }
        var myreg1 = /^[1]([3-9])[0-9]{9}$/;
        if (!myreg1.test(ocPleasePhone1)) {
            wx.showToast({
                title: '手机号有误！',
                icon: 'none'
            })
            return
        }
        // 正则验证验证码
        var ocPleasePhone2 = that.data.ocPleasePhone2;
        if (ocPleasePhone2 == '') {
            wx.showToast({
                title: '验证码不能为空',
                icon: 'none'
            })
            return
        } else if (ocPleasePhone2.length != 6) {
            wx.showToast({
                title: '验证码长度有误！',
                icon: 'none',
                duration: 1500
            })
            return
        }
        var myreg2 = /^\d{6}$/;
        if (!myreg2.test(ocPleasePhone2)) {
            wx.showToast({
                title: '验证码有误！',
                icon: 'none',
                duration: 1500
            })
            return
        }

        this.setData({
            querenType: true,
            box3: true,
            openCardBox: false,
            ocPleasePhone1: '',
            ocPleasePhone2: '',
        })

    },
    // 请输入手机号的input
    keyNum1(e) {
        console.log(e)
        this.setData({
            ocPleasePhone1: e.detail.value,
        })
    },
    //请输入手机号的叉号
    ocChaHaoT1(e) {
        this.setData({
            ocPleasePhone1: ''
        })
    },
    // 请输入验证码的input
    keyNum2(e) {
        console.log(e)
        this.setData({
            ocPleasePhone2: e.detail.value
        })
    },
    //请输入验证码的叉号
    ocChaHaoT2(e) {
        this.setData({
            ocPleasePhone2: ''
        })
    },
    // 开卡有礼:版本1  end

    // 会员支付
    huiyuan(res) {
        // var that = this
        // wx.getOpenUserInfo({
        //     fail: (res) => {
        //     },
        //     success: (res) => {
        //         that.aalert(res)
        //         // let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        //     }
        // });
        // 	this.aalert(wx.ix.getVersionSync({
        // 		packageName: 'zoloz.phone.android.alipay.com.dragonfly'
        // 		}).versionName)



        var that = this
        wx.request({
            // 支付宝会员卡，根据userID查询是否注册会员
            // url: 'http://192.168.1.254:6019/p-member/aliCard/userIsGetCard',
            url: 'https://api.51shanhe.com/p-member/aliCard/userIsGetCard',
            method: 'GET',
            data: {
                "institutionNumber": that.data.institutionNumber,
                "merchantNumber": wx.getStorageSync('userInfo').merchantNumber,
                "merUserId": '2088422803341713',
                // "merUserId": '2088422800000000'
            },
            timeout: 3000,
            success: (resp) => {
                wx.hideLoading();
                // console.log(resp.data.data)
                let userInfo = resp.data
                console.log('这是userInfo')
                console.log(userInfo)
                console.log(userInfo.data)
                that.setData({
                    mebInfo: resp.data.data
                })

                if (userInfo.code == 5000) {
                    wx.showToast({
                        icon: 'none',
                        title: userInfo.msg,
                        duration: 3000,
                        success: () => {
                            // wx.alert({
                            //     title: 'toast 消失了',
                            // });
                        },
                    });
                    that.setData({
                        box2: false,
                        openCardBox: true,            //开卡有礼页面
                    })
                } else if (userInfo.code == 1000) {       //是会员
                    var userIData = resp.data.data
                    that.setData({
                        userIData: userIData
                    })
                    //如果折扣不为空，今日类型为0，余额>优惠最小金额
                    if (!!userIData.disCountRate && userIData.holidayState == 0 && that.data.money > userIData.minConsumMoney) {
                        // 有折扣
                        console.log('有折扣')
                        // 余额支付 = 订单金额 * 消费折扣
                        let balancePayment = that.data.money * userIData.disCountRate
                        console.log('余额支付' + that.data.balancePayment)
                        // 会员优惠 = 订单金额 - 余额支付
                        let mDiscount = that.data.money - balancePayment
                        console.log('会员优惠' + that.data.mDiscount)
                        that.setData({
                            box2: false,
                            box3: true,
                            payT: 1,
                            headImg: userIData.headImg,                 //头像
                            nickName: userIData.nickName,               //名字
                            allBalance: userIData.allBalance,           //余额
                            disCountRate: userIData.disCountRate,       //折扣
                            balancePayment: balancePayment,             //余额支付
                            mDiscount: mDiscount,                       //会员优惠（自定义）
                            consumMoney: userIData.consumMoney,       //(等级设置)消费金额
                            consumGiveIntegral: userIData.consumGiveIntegral,         //(等级设置)获得积分         
                        })
                    } else {
                        // 没有折扣
                        that.setData({
                            box2: false,
                            box3: true,
                            payT: 1,
                            headImg: userIData.headImg,     //头像
                            nickName: userIData.nickName,               //名字
                            allBalance: userIData.allBalance,           //余额
                            balancePayment: that.data.money,            //余额支付
                            mDiscount: 0,                               //会员优惠（自定义）
                            mdText: false,                              //会员优惠按钮
                            mdDiscont: false,                           //会员享受折优惠，每消费元积分
                        })
                    }
                    // 优惠券
                    that.getV()
                }

                return

            },
            fail: (err) => {
                console.log('error', err);
            },
        });

















        return

        if (that.data.money < 1) {
            wx.showToast({
                title: "会员支付最小金额为1元",
                icon: 'none'
            });
            return
        }

        wx.ix.faceVerify({

            option: 'life',

            success: (r) => {
                var userId = r.buyerId
                that.setData({
                    cardUserId: r.buyerId
                })
                var userInfo = wx.getStorageSync('userInfo').data
                wx.showLoading();
                wx.request({
                    // url: 'http://192.168.1.254:6019/p-member/aliCard/userIsGetCard',
                    url: 'https://api.51shanhe.com/p-member/aliCard/userIsGetCard',
                    method: 'GET',
                    data: {
                        "institutionNumber": that.data.institutionNumber,
                        "merchantNumber": wx.getStorageSync('userInfo').merchantNumber,
                        "merUserId": userId,
                        "isVerificationAliCard": 1
                    },
                    timeout: 3000,
                    success: (resp) => {
                        wx.hideLoading();
                        that.aalert(JSON.stringify(resp))
                        let userInfo = resp.data
                        console.log('下边这是userInfo')
                        console.log(userInfo)
                        console.log(userInfo.data)
                        that.setData({
                            mebInfo: resp.data.data
                        })

                        if (userInfo.code == 5000 || userInfo.code == '-1') {
                            wx.showToast({
                                icon: 'none',
                                title: userInfo.msg,
                                duration: 3000,
                                success: () => {
                                    // wx.alert({
                                    //     title: 'toast 消失了',
                                    // });
                                },
                            });
                            that.setData({
                                box2: false,
                                openCardBox: true,            //开卡有礼页面
                            })
                        } else if (userInfo.code == 1000) {       //是会员
                            var userIData = resp.data.data
                            that.setData({
                                userIData: userIData
                            })
                            //如果折扣不为空，今日类型为0，余额>优惠最小金额
                            if (!!userIData.disCountRate && userIData.holidayState == 0 && that.data.money > userIData.minConsumMoney) {
                                // 有折扣
                                console.log('有折扣')
                                // 余额支付 = 订单金额 * 消费折扣
                                let balancePayment = that.data.money * userIData.disCountRate
                                console.log('余额支付' + that.data.balancePayment)
                                // 会员优惠 = 订单金额 - 余额支付
                                let mDiscount = that.data.money - balancePayment
                                console.log('会员优惠' + that.data.mDiscount)
                                that.setData({
                                    box2: false,
                                    box3: true,
                                    payT: 1,
                                    headImg: userIData.headImg,     //头像
                                    nickName: userIData.nickName,               //名字
                                    allBalance: userIData.allBalance,           //余额
                                    disCountRate: userIData.disCountRate,       //折扣
                                    balancePayment: balancePayment,             //余额支付
                                    mDiscount: mDiscount,                       //会员优惠（自定义）
                                    consumeMoney: userIData.consumeMoney,       //(等级设置)消费金额
                                    getIntegral: userIData.getIntegral,         //(等级设置)获得积分         
                                    mdDiscont: true,
                                    mdText: true,
                                    consumMoney: userIData.consumMoney,       //(等级设置)消费金额
                                    consumGiveIntegral: userIData.consumGiveIntegral,         //(等级设置)获得积分      
                                })
                            } else {
                                // 没有折扣
                                that.setData({
                                    box2: false,
                                    box3: true,
                                    payT: 1,
                                    headImg: userIData.headImg,     //头像
                                    nickName: userIData.nickName,               //名字
                                    allBalance: userIData.allBalance,           //余额
                                    balancePayment: that.data.money,            //余额支付
                                    mDiscount: 0,                               //会员优惠（自定义）
                                    mdText: false,                              //会员优惠按钮
                                    mdDiscont: false,                           //会员享受折优惠，每消费元积分
                                })
                            }
                            // 优惠券
                            that.getV()
                        }

                        return

                    },
                    fail: (err) => {
                        console.log('error', err);
                    },
                });
            },

            fail: (r) => {
                wx.showToast({
                    title: JSON.stringify(r),
                    icon: 'none'
                });
                this.addResult('faceVerify forPay fail', r);
            }
        });

    },


    // 优惠券
    getV() {
        var that = this
        var tdUI = wx.getStorageSync('userInfo')
        var userIdata = that.data.userIData
        wx.showLoading();
        wx.request({
            // 优惠券管理，（核销）查询会员可使用的卡券列表
            // url: 'http://192.168.1.254:6019/p-member/voucher/getMemberVoucherIsUse',
            url: 'https://api.51shanhe.com/p-member/voucher/getMemberVoucherIsUse',
            method: 'GET',
            data: {
                "institutionNumber": that.data.institutionNumber,
                "merchantNumber": wx.getStorageSync('userInfo').merchantNumber,
                "memberNo": userIdata.memberNo,
                "shopNo": tdUI.storeNumber,
                "page": 1,
                "limit": 18,
                "applicablePay": '',
                "applicableSource": 0,
            },
            success: (resp) => {
                wx.hideLoading();
                wx.setStorageSync('payInfo', resp.data);
                console.log(resp)
                console.log(resp.data.data.voucherCount)
                // console.log(tdUI.voucherCount)
                // that.aalert(resp.data.msg)
                if (resp.data.code == 1000) {      //有优惠券  
                    if (resp.data.data.voucherCount > 0) {
                        console.log('=49')
                        that.setData({
                            // 把数组存起来
                            voucherList: resp.data.data.voucherList
                        })
                    }
                } else {     //没有优惠券  

                }
            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    // 余额支付
    bPayment(e) {
        var that = this;
        var userIData = that.data.userIData
        var tdUI = wx.getStorageSync('userInfo')
        var userIdata = that.data.userIData
        wx.showModal({
            title: '温馨提示',
            content: '是否确认支付',
            success: (res) => {
                if (res.cancel) {
                    return
                }
                wx.showLoading();
                // wx.alert({
                //     // title: `${result.confirm}`,
                //     title: '11111111',
                // });
                console.log('rrrrrrrrrrrr')
                wx.request({
                    // 消费，发起消费
                    // url: 'http://192.168.1.254:6019/p-member/consumption/consum',
                    url: 'https://api.51shanhe.com/p-member/consumption/consum',
                    method: 'POST',
                    data: {
                        "institutionNumber": that.data.institutionNumber,
                        "merchantNumber": wx.getStorageSync('userInfo').merchantNumber,
                        "memberNo": userIdata.memberNo,
                        "consumMoney": that.data.money,
                        "shopNumber": tdUI.storeNumber,
                        "clerkNumber": tdUI.userNumber,
                        "remarks": '',
                        "consumptionType": 0,
                        "useIntegral": 0,
                        "deductionIntegral": '',
                        "longitude": '',
                        "latitude": '',
                        "ip": '',
                        "payType": 0,
                        "voucherId": that.data.voucherNo,
                        "applicablePay": 3,
                        "applicableSource": 0,
                        "disMoney": that.data.voucherNo == '' ? that.data.balancePayment : that.data.zheMoney,
                    },
                    success: (resp) => {
                        // that.aalert(resp)
                        wx.hideLoading();
                        wx.setStorageSync('payInfo', resp.data);
                        console.log(resp)

                        if (resp.data.code == 1000) {
                            that.setData({
                                preferentialNum: 0 - (resp.data.data.consumMoney - resp.data.data.actualConsumMoney),        //优惠合计
                                giveIntegral: resp.data.data.giveIntegral,                //积分奖励
                                actualConsumMoney: resp.data.data.actualConsumMoney,      //支付成功
                                box3: false,
                                payS: true,
                            })
                            wx.ix.speech({
                                text: '会员支付成功' + that.data.actualConsumMoney + '元',
                                success: (r) => {
                                }
                            });
                            that.huiyuandayin(resp.data.data.consumOrderNumber, resp.data.data.orderTime, that.data.actualConsumMoney, '会员支付')
                        } else {
                            that.aalert(resp.data.msg)
                        }
                    },
                    fail: (err) => {
                        console.log('error', err);
                    },
                });
            },
        });
    },
    // 点击各种优惠券
    useV(e) {
        var that = this
        console.log(e)
        // if (that.data.cpButton == false) {
        //     that.setData({
        //         cpButton: true
        //     })
        // }


        //优惠券边框，如果是红色，点击变灰
        if (that.data.voucherNo == e.currentTarget.dataset.bianhao) {
            that.setData({
                // 优惠券边框
                voucherNo: '',
                dcNum: 0
            })
            return
        }
        //优惠券边框，点击变红
        that.setData({
            voucherNo: e.currentTarget.dataset.bianhao
        })
        // 根据不同券计算余额支付
        if (e.currentTarget.dataset.type == 0) {    // 折扣券
            that.setData({
                // 可用优惠券上边的优惠券
                dcNum: (Math.ceil((that.data.balancePayment - that.data.balancePayment * e.currentTarget.dataset.zhe) * 100) / 100).toFixed(2),

            })
            that.setData({
                zheMoney: that.data.balancePayment - that.data.dcNum
            })
        } else if (e.currentTarget.dataset.type == 1) {      //满减券
            if (that.data.balancePayment < e.currentTarget.dataset.man) {     //不可以减
                wx.showToast({
                    icon: 'exception',
                    title: '不满足满减优惠',
                    duration: 3000,
                });

                that.setData({
                    // 优惠券边框为灰色
                    voucherNo: ''
                })
            } else {         //可以减
                that.setData({
                    // 可用优惠券上边的优惠券
                    dcNum: e.currentTarget.dataset.jian,
                })
                that.setData({
                    zheMoney: that.data.balancePayment - that.data.dcNum
                })
            }

        }
        that.setData({
            cpButton: true,
            bpButton: true
        })
    },
    // 取消支付
    canclePayment() {
        var that = this;
        that.setData({
            box1: true,
            box3: false
        })
    },
    // 点击右上角叉号
    guanbiBox() {
        var that = this;
        that.setData({
            box1: true,
            box2: false
        })
    },
    // 完成
    accomplishNBtn() {
        var that = this;
        that.setData({
            box1: true,
            payS: false
        })
    },
    // 可用优惠券右边向下的箭头
    bottomArrow() {
        var that = this;
        that.setData({
            bpButton: !that.data.bpButton,
            cpButton: !that.data.cpButton,
        })
    },
    hide123(e) {

        var that = this
        if (that.data.userInfoType == false) {
            that.setData({
                userInfoType: true
            })
            setTimeout(function () {
                if (that.data.info != true) {
                    that.setData({
                        userInfoType: false
                    })
                }
            }, 5000)
        } else {

        }

    },
    move(res) {
        let left = res.changedTouches[0].clientX + this.data.left1
        let top = res.changedTouches[0].clientY + this.data.top1
        //console.log(left + ',' + top)
        if (left >= 400) {
            left = 400
        }
        if (left <= 0) {
            left = 0
        }
        if (top <= 0) {
            top = 0
        }
        if (top >= 800) {
            top = 800
        }
        this.setData({
            left: left,
            top: top
        })
    },
    infoFalse() {
        var that = this
        this.setData({
            info: !this.data.info
        })
        setTimeout(function () {
            if (that.data.info != true) {
                that.setData({
                    userInfoType: false
                })
            }
        }, 5000)
    },
    onLoad(query) {
        // 页面加载
        var that = this
        wx.setStorage({
            key: 'version', // 缓存数据的key
            data: '0.0.34'
        });
        // wx.ix.offCodeScan()
        // wx.ix.startCodeScan({ scanType: "ALL" });
        //  wx.ix.voicePlay({
        // 				eventId: 'didi'
        // 				});
        // that.aalert()
        // wx.ix.speech({
        // 	text: '吾乃鸿搜之草张宇航',
        // 	success: (r) => {
        // 	}
        // 	});
        var ui = wx.getStorageSync('userInfo')
        that.setData({
            name: that.stringC(ui.userName),
            // name: that.stringC(ui.nickName),
            phone: ui.phone
        })
        var userInfo = wx.getStorageSync('userInfo')
        // wx.ix.onCodeScan((r) => {
        //     wx.ix.voicePlay({
        //         eventId: 'didi'
        //     });
        //     if (that.data.syType == 'pc') {
        //         if (that.data.syPc == true) {
        //             wx.showLoading({
        //                 tittle: '付款中...'
        //             });

        //             that.setData({
        //                 syPc: false
        //             })
        //             wx.ix.writeHID({
        //                 protocol: 'barcode',
        //                 value: r.code,
        //                 success: (r) => {
        //                     wx.showToast('success: ' + JSON.stringify(r));
        //                 },
        //                 fail: (r) => {
        //                     wx.showToast('fail: ' + JSON.stringify(r));
        //                 }
        //             })
        //             setTimeout(function () {
        //                 that.setData({
        //                     syPc: true
        //                 })
        //                 wx.hideLoading();
        //             }, 5000)
        //         }

        //     } else {
        //         if (that.data.syType != 'duli') {

        //             return
        //         }
        //         var orderNumber = r.code

        //         if (r.success == true) {
        //             that.setData({
        //                 tuikuan: true
        //             })
        //             wx.showLoading({
        //                 tittle: '退款中，请稍后'
        //             });
        //             wx.request({
        //                 url: 'https://api.51shanhe.com/p-server/bill/getOrderDetails',
        //                 method: 'GET',
        //                 data: {
        //                     "institutionNumber": that.data.institutionNumber,
        //                     "merchantNumber": wx.getStorageSync('userInfo').merchantNumber,
        //                     "orderNumber": orderNumber
        //                 },
        //                 success: (resp) => {
        //                     // that.aalert(JSON.stringify(resp))
        //                     // return
        //                     if (resp.data.code != 1000) {
        //                         wx.showToast({
        //                             title: resp.data.msg
        //                         })
        //                         wx.ix.speech({
        //                             text: resp.data.msg,
        //                             success: (r) => {
        //                             }
        //                         });
        //                         that.setData({
        //                             tuikuanInfo: '退款失败'
        //                         })
        //                         setTimeout(function () {
        //                             that.setData({
        //                                 tuikuanInfo: '退款中...',
        //                                 tuikuan: false
        //                             })
        //                             wx.hideLoading();
        //                         }, 2000)


        //                     } else {
        //                         var paymentChannel = resp.data.data.paymentChannel
        //                         var refundBalance = resp.data.data.refundBalance

        //                         wx.request({
        //                             url: 'https://api.51shanhe.com/p-pay/refund/money',
        //                             method: 'POST',
        //                             data: {
        //                                 "insNumber": that.data.institutionNumber,
        //                                 "merNumber": wx.getStorageSync('userInfo').merchantNumber,
        //                                 "orderNumber": orderNumber,
        //                                 "paymentChannel": paymentChannel,
        //                                 "outTradeNo": orderNumber,
        //                                 "refundAmount": refundBalance,
        //                                 "userNumber": wx.getStorageSync('userInfo').userNumber,
        //                                 "equipmentType": 3
        //                             },
        //                             success: (resp) => {
        //                                 // that.aalert(JSON.stringify(resp))
        //                                 // return
        //                                 if (resp.data.code != 1000) {
        //                                     wx.showToast({
        //                                         title: resp.data.msg
        //                                     })
        //                                     that.setData({
        //                                         tuikuanInfo: '退款失败'
        //                                     })
        //                                     wx.ix.speech({
        //                                         text: resp.data.msg,
        //                                         success: (r) => {
        //                                         }
        //                                     });
        //                                     setTimeout(function () {
        //                                         that.setData({
        //                                             tuikuanInfo: '退款中...',
        //                                             tuikuan: false
        //                                         })
        //                                         wx.hideLoading();
        //                                     }, 2000)
        //                                 } else {
        //                                     var time = that.getNowDateTime()
        //                                     that.tuikuandayin(orderNumber, time, refundBalance)
        //                                     wx.showToast({
        //                                         title: resp.data.msg
        //                                     })
        //                                     that.setData({
        //                                         tuikuanInfo: '退款成功'
        //                                     })
        //                                     wx.ix.speech({
        //                                         text: '退款成功,退款' + refundBalance + '元',
        //                                         success: (r) => {
        //                                         }
        //                                     });
        //                                     wx.hideLoading();
        //                                     setTimeout(function () {
        //                                         that.setData({
        //                                             tuikuanInfo: '退款中...',
        //                                             tuikuan: false
        //                                         })

        //                                     }, 2000)
        //                                 }

        //                             },
        //                             fail: (err) => {
        //                                 console.log('error', err);
        //                             },
        //                         });
        //                     }

        //                 },
        //                 fail: (err) => {
        //                     console.log('error', err);
        //                 },
        //             });
        //         }
        //     }



        // });
        //查询支付信息
        wx.request({
            url: 'https://api.51shanhe.com/p-server/appServer/getAliFacePayInfo',
            method: 'GET',
            data: {
                "institutionNumber": that.data.institutionNumber,
                "merchantNumber": wx.getStorageSync('userInfo').merchantNumber
            },
            success: (resp) => {
                // that.aalert(resp.data.code)
                wx.setStorageSync('payInfo', resp.data.data);

            },
            fail: (err) => {
                console.log('error', err);
            },
        });

        //查询广告
        wx.request({
            url: 'https://api.51shanhe.com/p-server/appServer/getFaceAdvert',
            //url:'http://192.168.1.66:6017/p-server/appServer/getFaceAdvert',
            method: 'GET',
            data: {
                "institutionNumber": that.data.institutionNumber,
                "merchantNumber": wx.getStorageSync('userInfo').merchantNumber,
                count: '10',
                "advertType": '5',
                "launchChannel": '2'
            },
            success: (resp) => {
                console.log(resp.data.code)
                if (resp.data.code == 1000) {
                    console.log('123')
                    var list = new Array()
                    var dataList = resp.data.data
                    for (let i = 0; i < dataList.length; i++) {
                        if (dataList[i].advertKind == 0) {
                            list.push(dataList[i].address)
                        }

                    }
                    if (list.length == 0) {
                        that.setData({
                            advImg: that.data.advImgList[0]
                        })
                    } else {
                        that.setData({
                            advImgList: list,
                            advImg: list[0]
                        })
                    }


                } else {
                    that.setData({
                        advImg: that.data.advImgList[0]
                    })
                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });

        // wx.ix.getSysProp({
        //     key: 'ro.serialno',
        //     success: (r) => {
        //         console.log(r)
        //         this.setData({
        //             "equipmentNumber": r.value
        //         })

        //     }
        // })
        var that = this

        // var userInfo = wx.getStorageSync('userInfo')
        // 			var payInfo = wx.getStorageSync('payInfo')
        // wx.request({
        // 	url: 'http://zyh666.free.idcfengye.com/p-pay/alipay/facePay',
        // 	method: 'POST',
        // 	data:{
        // 		// "institutionNumber":that.data.institutionNumber,
        // 		// "merchantNumber":wx.getStorageSync('userInfo').merchantNumber
        // 		"subNumber":payInfo.subaccountNumber,
        // 		"institutionNumber":userInfo.institutionNumber,
        // 		"merchantNumber":userInfo.merchantNumber,
        // 		//"authCode":r.barCode,
        // 		"authCode":'283635605676173276',
        // 		"paymentChannel":payInfo.paymentChannel,
        // 		"rate":payInfo.rate,
        // 		"totalMoney":0.01,
        // 		"shopNumber":userInfo.storeNumber,
        // 		"clerkNumber":userInfo.userNumber,
        // 		"equipmentType":3,
        // 		//"equipmentNumber":that.data.equipmentNumber,
        // 		"eqipmentType":"SMIT3B2019729000825"
        // 	},
        // 	success: (resp) => {
        // 		if(resp.code != 1000){
        // 			that.aalert(resp.msg)
        // 		}

        // 	},
        // 	fail: (err) => {
        // 		console.log('error', err);
        // 	},
        // 	});
        // 设置静音
        this.setData({ audible: false });
        setInterval(function () {
            that.tabImg()
        }, 8000)
        // setInterval(function(){
        // 	wx.ix.writeHID({
        // 		protocol: 'barcode',
        // 		value: '123145123132',
        // 		success: (r) => {
        // 			wx.showToast('success: ' + JSON.stringify(r));
        // 		},
        // 		fail: (r) => {
        // 			wx.showToast('fail: ' + JSON.stringify(r));
        // 		}
        // 		})
        // },1000)
        // // 取消静音
        // this.setData({ audible: true });
    },

    // 展示成功回调 
    onDisplaySuccess() {
        console.log('poster display success');
    },
    // 展示失败回调 
    onDisplayFail(e) {
        console.log('poster display fail, error = ' + e.detail.error);
    },
    // 广告可用性变化回调
    onPosterChange(e) {
        console.log('poster availability changed, now has poster = ' + e.detail.hasPoster);
    },
    pause() {
        if (typeof (this.posterContext) === 'undefined') {
            this.posterContext = wx.createPosterContext('poster component id');
        }
        this.posterContext.pause({});
    },

    resume() {
        if (typeof (this.posterContext) === 'undefined') {
            this.posterContext = wx.createPosterContext('poster component id');
        }
        this.posterContext.resume({});
    },

    onReady() {
        // 页面加载完成
    },
    getNowDateTime() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hour >= 1 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minutes >= 1 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 1 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hour + ':' + minutes + ':' + seconds;
        return currentdate;

    },
    shualian: function () {
        wx.ix.startApp({
            appName: 'cashier',
            bizNo: '12345678',
            totalAmount: '0.01',
            orderDetail: [{ name: '名称1', content: '详情134', fontColor: 'gray' }, { name: '名称2', content: '详情456', fontColor: 'red' }],
            success: (r) => {
                wx.showToast({
                    title: r.barCode,
                    icon:'none'
                });
            }
        });
    },
    getServerTime() {
        var that = this
        wx.getServerTime({
            success: (res) => {
                that.setData({
                    strNumber: res.time
                })
            },
        });
    },
    onUnload() {
        // 页面被关闭
    },
    onTitleClick() {
        // 标题被点击
    },
    onPullDownRefresh() {
        // 页面被下拉
    },
    onReachBottom() {
        // 页面被拉到底部
    },
    tabImg() {
        var that = this
        if (that.data.imgNo == that.data.advImgList.length) {
            that.setData({
                imgNo: 0,
                advImg: that.data.advImgList[0]
            })
        } else {
            that.setData({
                imgNo: that.data.imgNo + 1,
                advImg: that.data.advImgList[this.data.imgNo + 1]
            })
        }
    },
    onShareAppMessage() {
        // 返回自定义分享信息
        return {
            title: 'My App',
            desc: 'My App description',
            path: 'pages/index/index',
        };
    },
    pcHuan() {
        wx.ix.startApp({
            appName: 'cashier',
            bizNo: '123456',
            totalAmount: '',
            showScanPayResult: true,
            faceLoadingTimeout: 20,
            success: (r) => {

                var code1 = r.barCode
                wx.ix.writeHID({
                    protocol: 'barcode',
                    value: code1,
                    success: (r) => {
                        wx.showToast('success: ' + JSON.stringify(r));
                    },
                    fail: (r) => {
                        wx.showToast('fail: ' + JSON.stringify(r));
                    }
                })
                return
            }
        })
    },
    loginout() {
        wx.showModal({
            title: '提示',
            content: '确定退出登录吗？',
            success: (result) => {
                console.log(result)
                if (result.confirm == true) {
                    wx.removeStorageSync('userInfo');
                    wx.reLaunch({
                        url: '../login/login'// 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用

                    });
                }

            },
        });
    },
    hideA(res) {
        console.log(res)
        // this.setData({
        // 	info:false
        // })
    },
    facePay() {
        var that = this
        that.setData({
            box1: true,
            payS: false,
            box2: false
        })
        var money = that.data.money
        if (that.data.syType == 'duli') {
            wx.ix.startApp({
                appName: 'cashier',
                bizNo: '123456',
                totalAmount: that.data.money,
                showScanPayResult: true,
                faceLoadingTimeout: 20,
                scanLoadingTimeout: 30,

                success: (r) => {
                    that.setData({
                        pay: false
                    })
                    var code1 = r.barCode

                    var userInfo = wx.getStorageSync('userInfo')
                    var payInfo = wx.getStorageSync('payInfo')
                    if (r.codeType == "C") {
                        var payType = ''
                        var codeType = ''
                        if (code1.length >= 16 && code1.length <= 24) {
                            var string = code1.substring(0, 2);
                            if (string == "25" || string == "26" || string == "27" || string == "28"
                                || string == "29" || string == "30") {
                                // 支付宝
                                // return NetConstant.PaymentType.ALI_PAY;
                                payType = '支付宝条码支付'
                                codeType = 'Alipay_Pay'
                            }
                            if (string == "10" || string == "11" || string == "12" || string == "13"
                                || string == "14" || string == "15") {
                                // 微信
                                // return NetConstant.PaymentType.WX_PAY;
                                payType = '微信条码支付'
                                codeType = 'WeChat_Pay'
                            }
                            if (string == "62") {
                                // 云闪付
                                payType = '云闪付条码支付'
                                codeType = 'UnionPay_Pay'
                            }
                        }
                        wx.request({
                            url: 'https://api.51shanhe.com/p-pay/pay/payRoute',
                            method: 'POST',
                            data: {
                                // "institutionNumber":that.data.institutionNumber,
                                // "merchantNumber":wx.getStorageSync('userInfo').merchantNumber

                                "institutionNumber": userInfo.institutionNumber,
                                "merchantNumber": userInfo.merchantNumber,
                                "authCode": code1,
                                "totalMoney": money,
                                "shopNumber": userInfo.storeNumber,
                                "clerkNumber": userInfo.userNumber,
                                "equipmentType": 3,
                                "equipmentNumber": that.data.equipmentNumber,
                                "paymentType": codeType,
                                "codeType": "Barcode_Pay",
                            },
                            success: (resp) => {
                                that.setData({
                                    pay: true
                                })
                                setTimeout(function () {
                                    if (resp.data.code == 1000) {
                                        if (resp.data.data.orderState == 1) {
                                            var orderT = that.getNowDateTime()
                                            var orderC;
                                            if (wx.getStorageSync('dyCount') == null) {
                                                orderC = 1
                                            } else {
                                                orderC = wx.getStorageSync('dyCount')
                                            }
                                            for (let i = 0; i < orderC; i++) {
                                                setTimeout(function () {
                                                    that.dayin(resp.data.data.batch, orderT, money, payType)
                                                }, 200)
                                            }
                                            if (codeType == 'WeChat_Pay') {
                                                var voiStr = '微信付款成功  ' + money + '元'
                                                wx.ix.speech({
                                                    text: voiStr,
                                                    success: (r) => {
                                                    }
                                                });
                                            } else {
                                                var voiStr = '支付宝付款成功  ' + money + '元'
                                                wx.ix.speech({
                                                    text: voiStr,
                                                    success: (r) => {
                                                    }
                                                });
                                            }

                                            wx.ix.startApp({
                                                appName: 'scanPayResult',
                                                bizNo: '123456',
                                                totalAmount: money,
                                                success: (r) => {
                                                    setTimeout(function () {
                                                        wx.ix.exitApp({
                                                            appName: 'cashier'
                                                        });
                                                    }, 2000)
                                                }
                                            });

                                        }
                                    }
                                }, 500)
                            },
                            fail: (err) => {
                                console.log('error', err);
                            },
                        });
                    }
                    if (r.codeType == 'F') {
                        var payType = '支付宝刷脸支付'
                        wx.request({
                            url: 'https://api.51shanhe.com/p-pay/pay/payRoute',
                            //url: 'https://hongsou.natapp4.cc/p-pay/pay/payRoute',
                            method: 'POST',
                            data: {
                                // "institutionNumber":that.data.institutionNumber,
                                // "merchantNumber":wx.getStorageSync('userInfo').merchantNumber
                                // "subNumber": payInfo.subaccountNumber,
                                "institutionNumber": userInfo.institutionNumber,
                                "merchantNumber": userInfo.merchantNumber,
                                "authCode": code1,
                                // "paymentChannel": payInfo.paymentChannel,
                                // "rate": payInfo.rate,
                                "totalMoney": money,
                                "shopNumber": userInfo.storeNumber,
                                "clerkNumber": userInfo.userNumber,
                                "equipmentType": 3,
                                "equipmentNumber": that.data.equipmentNumber,
                                "codeType": 'Face_Swiping_Pay',
                                "paymentType": 'Alipay_Pay'
                            },
                            success: (resp) => {
                                that.setData({
                                    pay: true
                                })
                                if (resp.data.code == 1000) {
                                    if (resp.data.data.orderState == 1) {
                                        var orderT = that.getNowDateTime()
                                        var orderC;
                                        if (wx.getStorageSync('dyCount') == null) {
                                            orderC = 1
                                        } else {
                                            orderC = wx.getStorageSync('dyCount')
                                        }
                                        for (let i = 0; i < orderC; i++) {
                                            setTimeout(function () {
                                                that.dayin(resp.data.data.batch, orderT, money, payType)
                                            }, 200)
                                        }
                                        // wx.ix.speech({
                                        // text: '支付成功',
                                        // success: (r) => {
                                        // }
                                        // });
                                        wx.ix.startApp({
                                            appName: 'scanPayResult',
                                            bizNo: '123456',
                                            totalAmount: money,
                                            success: (r) => {
                                                setTimeout(function () {
                                                    wx.ix.exitApp({
                                                        appName: 'cashier'
                                                    });
                                                }, 2000)
                                            }
                                        });
                                    }
                                }

                            },
                            fail: (err) => {
                                console.log('error', err);
                            },
                        });
                    }

                }
            });
        } else {
            wx.ix.startApp({
                appName: 'cashier',
                bizNo: '123456',
                totalAmount: money,
                showScanPayResult: true,
                faceLoadingTimeout: 20,
                success: (r) => {

                    var code1 = r.barCode
                    wx.ix.writeHID({
                        protocol: 'barcode',
                        value: code1,
                        success: (r) => {
                            wx.showToast('success: ' + JSON.stringify(r));
                        },
                        fail: (r) => {
                            wx.showToast('fail: ' + JSON.stringify(r));
                        }
                    })
                    return
                    var userInfo = wx.getStorageSync('userInfo')
                    var payInfo = wx.getStorageSync('payInfo')
                    if (r.codeType == "C") {
                        var payType = ''
                        var codeType = ''
                        if (code1.length >= 16 && code1.length <= 24) {
                            var string = code1.substring(0, 2);
                            if (string == "25" || string == "26" || string == "27" || string == "28"
                                || string == "29" || string == "30") {
                                // 支付宝
                                // return NetConstant.PaymentType.ALI_PAY;
                                payType = '支付宝条码支付'
                                codeType = 'Alipay_Pay'
                            }
                            if (string == "10" || string == "11" || string == "12" || string == "13"
                                || string == "14" || string == "15") {
                                // 微信
                                // return NetConstant.PaymentType.WX_PAY;
                                payType = '微信条码支付'
                                codeType = 'WeChat_Pay'
                            }
                            if (string == "62") {
                                // 云闪付
                                payType = '云闪付条码支付'
                                codeType = 'UnionPay_Pay'
                            }
                        }
                        wx.request({
                            url: 'https://api.51shanhe.com/p-pay/pay/payRoute',
                            method: 'POST',
                            data: {
                                // "institutionNumber":that.data.institutionNumber,
                                // "merchantNumber":wx.getStorageSync('userInfo').merchantNumber

                                "institutionNumber": userInfo.institutionNumber,
                                "merchantNumber": userInfo.merchantNumber,
                                "authCode": code1,
                                "totalMoney": money,
                                "shopNumber": userInfo.storeNumber,
                                "clerkNumber": userInfo.userNumber,
                                "equipmentType": 3,
                                "equipmentNumber": that.data.equipmentNumber,
                                "paymentType": codeType,
                                "codeType": "Barcode_Pay",
                            },
                            success: (resp) => {
                                that.setData({
                                    pay: true
                                })
                                if (resp.data.code == 1000) {
                                    if (resp.data.data.orderState == 1) {
                                        var orderT = that.getNowDateTime()
                                        var orderC;
                                        if (wx.getStorageSync('dyCount') == null) {
                                            orderC = 1
                                        } else {
                                            orderC = wx.getStorageSync('dyCount')
                                        }
                                        for (let i = 0; i < orderC; i++) {
                                            setTimeout(function () {
                                                that.dayin(resp.data.data.batch, orderT, money, payType)
                                            }, 200)
                                        }
                                        wx.ix.startApp({
                                            appName: 'scanPayResult',
                                            bizNo: '123456',
                                            totalAmount: resp.data.data.payAmount,
                                            success: (r) => {
                                                setTimeout(function () {
                                                    wx.ix.exitApp({
                                                        appName: 'cashier'
                                                    });
                                                }, 2000)
                                            }
                                        });
                                    }
                                }

                            },
                            fail: (err) => {
                                console.log('error', err);
                            },
                        });
                    }
                    if (r.codeType == 'F') {
                        var payType = '支付宝刷脸支付'
                        wx.request({
                            url: 'https://api.51shanhe.com/p-pay/alipay/facePay',
                            method: 'POST',
                            data: {
                                // "institutionNumber":that.data.institutionNumber,
                                // "merchantNumber":wx.getStorageSync('userInfo').merchantNumber
                                "subNumber": payInfo.subaccountNumber,
                                "institutionNumber": userInfo.institutionNumber,
                                "merchantNumber": userInfo.merchantNumber,
                                "authCode": code1,
                                "paymentChannel": payInfo.paymentChannel,
                                "rate": payInfo.rate,
                                "totalMoney": money,
                                "shopNumber": userInfo.storeNumber,
                                "clerkNumber": userInfo.userNumber,
                                "equipmentType": 3,
                                "equipmentNumber": that.data.equipmentNumber,
                            },
                            success: (resp) => {
                                that.setData({
                                    pay: true
                                })
                                if (resp.data.code == 1000) {
                                    if (resp.data.data.orderState == 1) {
                                        var orderT = that.getNowDateTime()
                                        var orderC;
                                        if (wx.getStorageSync('dyCount') == null) {
                                            orderC = 1
                                        } else {
                                            orderC = wx.getStorageSync('dyCount')
                                        }
                                        for (let i = 0; i < orderC; i++) {
                                            setTimeout(function () {
                                                that.dayin(resp.data.data.batch, orderT, money, payType)
                                            }, 200)
                                        }
                                        wx.ix.startApp({
                                            appName: 'scanPayResult',
                                            bizNo: '123456',
                                            totalAmount: resp.data.data.payAmount,
                                            success: (r) => {
                                                setTimeout(function () {
                                                    wx.ix.exitApp({
                                                        appName: 'cashier'
                                                    });
                                                }, 2000)
                                            }
                                        });
                                    }
                                }

                            },
                            fail: (err) => {
                                console.log('error', err);
                            },
                        });
                    }

                }
            });
        }
    },
    chajianPay() {
        var that = this
        var money = that.data.rfMoney
        var biz = that.data.biz

        // wx.ix.onMonitorTinyCommand((r) => {
        // 	console.log("received data:" + r);
        // 	that.aalert(r)

        // });
        // var tjData = new Object()
        // tjData.method = "notify"
        // tjData.result = "succ"
        // tjData.bizNo = biz
        // tjData.totalAmount = money
        // tjData.channel = "alipay"
        // wx.ix.tinyCommand({
        //     target: 'pos',
        //     content: tjData,
        //     success: (r) => {
        //         // that.aalert('发送成功')
        //     },
        //     fail: (r) => {
        //         that.aalert('发送失败')
        //     }
        // });
        // wx.ix.onMonitorTinyCommand((r) => {
        //     console.log("received data:" + r);
        //     that.aalert(r)

        // });

        wx.ix.startApp({
            appName: 'cashier',
            bizNo: biz,
            totalAmount: money,
            showScanPayResult: true,
            faceLoadingTimeout: 20,
            scanLoadingTimeout: 30,

            success: (r) => {

                var code1 = r.barCode

                var userInfo = wx.getStorageSync('userInfo')
                var payInfo = wx.getStorageSync('payInfo')
                if (r.codeType == "C") {
                    var payType = ''
                    var codeType = ''
                    if (code1.length >= 16 && code1.length <= 24) {
                        var string = code1.substring(0, 2);
                        if (string == "25" || string == "26" || string == "27" || string == "28"
                            || string == "29" || string == "30") {
                            // 支付宝
                            // return NetConstant.PaymentType.ALI_PAY;
                            payType = '支付宝条码支付'
                            codeType = 'Alipay_Pay'
                        }
                        if (string == "10" || string == "11" || string == "12" || string == "13"
                            || string == "14" || string == "15") {
                            // 微信
                            // return NetConstant.PaymentType.WX_PAY;
                            payType = '微信条码支付'
                            codeType = 'WeChat_Pay'
                        }
                        if (string == "62") {
                            // 云闪付
                            payType = '云闪付条码支付'
                            codeType = 'UnionPay_Pay'
                        }
                    }
                    wx.request({
                        url: 'https://api.51shanhe.com/p-pay/pay/payRoute',
                        method: 'POST',
                        data: {
                            // "institutionNumber":that.data.institutionNumber,
                            // "merchantNumber":wx.getStorageSync( 'userInfo').merchantNumber

                            "institutionNumber": userInfo.institutionNumber,
                            "merchantNumber": userInfo.merchantNumber,
                            "authCode": code1,
                            "totalMoney": money,
                            "shopNumber": userInfo.storeNumber,
                            "clerkNumber": userInfo.userNumber,
                            "equipmentType": 3,
                            "equipmentNumber": that.data.equipmentNumber,
                            "paymentType": codeType,
                            "codeType": "Barcode_Pay",
                        },
                        success: (resp) => {
                            that.setData({
                                pay: true
                            })
                            setTimeout(function () {
                                if (resp.data.code == 1000) {
                                    if (resp.data.data.orderState == 1) {
                                        var orderT = that.getNowDateTime()
                                        var orderC;
                                        if (wx.getStorageSync('dyCount') == null) {
                                            orderC = 1
                                        } else {
                                            orderC = wx.getStorageSync('dyCount')
                                        }
                                        for (let i = 0; i < orderC; i++) {
                                            setTimeout(function () {
                                                that.dayin(resp.data.data.batch, orderT, money, payType)
                                            }, 200)
                                        }
                                        if (codeType == 'WeChat_Pay') {
                                            var voiStr = '微信付款成功  ' + money + '元'
                                            wx.ix.speech({
                                                text: voiStr,
                                                success: (r) => {
                                                }
                                            });
                                        } else {
                                            var voiStr = '支付宝付款成功  ' + money + '元'
                                            wx.ix.speech({
                                                text: voiStr,
                                                success: (r) => {
                                                }
                                            });
                                        }

                                        wx.ix.startApp({
                                            appName: 'scanPayResult',
                                            bizNo: biz,
                                            totalAmount: money,
                                            success: (r) => {
                                                setTimeout(function () {
                                                    wx.ix.exitApp({
                                                        appName: 'cashier'
                                                    });
                                                }, 2000)
                                            }
                                        });
                                        var tjData = new Object()
                                        tjData.method = "notify"
                                        tjData.result = "succ"
                                        tjData.bizNo = biz
                                        tjData.totalAmount = money
                                        tjData.channel = codeType == 'WeChat_Pay' ? "alipay" : 'wxpay'
                                        wx.ix.tinyCommand({
                                            target: 'pos',
                                            content: tjData,
                                            success: (r) => {
                                                // that.aalert('发送成功')
                                            },
                                            fail: (r) => {
                                                that.aalert('发送失败')
                                            }
                                        });
                                    } else {
                                        var tjData = new Object()
                                        tjData.method = "notify"
                                        tjData.result = "waiting"
                                        tjData.bizNo = biz
                                        tjData.totalAmount = money
                                        tjData.channel = codeType == 'WeChat_Pay' ? "alipay" : 'wxpay'
                                        wx.ix.tinyCommand({
                                            target: 'pos',
                                            content: tjData,
                                            success: (r) => {
                                                // that.aalert('发送成功')
                                            },
                                            fail: (r) => {
                                                that.aalert('发送失败')
                                            }
                                        });
                                    }
                                }
                            }, 500)
                        },
                        fail: (err) => {
                            console.log('error', err);
                        },
                    });
                }
                if (r.codeType == 'F') {
                    var payType = '支付宝刷脸支付'
                    wx.request({
                        url: 'https://api.51shanhe.com/p-pay/pay/payRoute',
                        //url: 'https://hongsou.natapp4.cc/pay/payRoute',
                        method: 'POST',
                        data: {
                            // "institutionNumber":that.data.institutionNumber,
                            // "merchantNumber":wx.getStorageSync('userInfo').merchantNumber
                            // "subNumber": payInfo.subaccountNumber,
                            "institutionNumber": userInfo.institutionNumber,
                            "merchantNumber": userInfo.merchantNumber,
                            "authCode": code1,
                            // "paymentChannel": payInfo.paymentChannel,
                            // "rate": payInfo.rate,
                            "totalMoney": money,
                            "shopNumber": userInfo.storeNumber,
                            "clerkNumber": userInfo.userNumber,
                            "equipmentType": 3,
                            "equipmentNumber": that.data.equipmentNumber,
                            "codeType": 'Face_Swiping_Pay',
                            "paymentType": 'Alipay_Pay'
                        },
                        success: (resp) => {
                            that.setData({
                                pay: true
                            })
                            if (resp.data.code == 1000) {
                                if (resp.data.data.orderState == 1) {
                                    var orderT = that.getNowDateTime()
                                    var orderC;
                                    if (wx.getStorageSync('dyCount') == null) {
                                        orderC = 1
                                    } else {
                                        orderC = wx.getStorageSync('dyCount')
                                    }
                                    for (let i = 0; i < orderC; i++) {
                                        setTimeout(function () {
                                            that.dayin(resp.data.data.batch, orderT, money, payType)
                                        }, 200)
                                    }
                                    // wx.ix.speech({
                                    // text: '支付成功',
                                    // success: (r) => {
                                    // }
                                    // });
                                    wx.ix.startApp({
                                        appName: 'scanPayResult',
                                        bizNo: biz,
                                        totalAmount: money,
                                        success: (r) => {
                                            setTimeout(function () {
                                                wx.ix.exitApp({
                                                    appName: 'cashier'
                                                });
                                            }, 2000)
                                        }
                                    });
                                    var tjData = new Object()
                                    tjData.method = "notify"
                                    tjData.result = "succ"
                                    tjData.bizNo = biz
                                    tjData.totalAmount = money
                                    tjData.channel = "alipay"
                                    wx.ix.tinyCommand({
                                        target: 'pos',
                                        content: tjData,
                                        success: (r) => {
                                            // that.aalert('发送成功')
                                        },
                                        fail: (r) => {
                                            that.aalert('发送失败')
                                        }
                                    });
                                } else {
                                    var tjData = new Object()
                                    tjData.method = "notify"
                                    tjData.result = "waiting"
                                    tjData.bizNo = biz
                                    tjData.totalAmount = money
                                    tjData.channel = "alipay"
                                    wx.ix.tinyCommand({
                                        target: 'pos',
                                        content: tjData,
                                        success: (r) => {
                                            // that.aalert('发送成功')
                                        },
                                        fail: (r) => {
                                            that.aalert('发送失败')
                                        }
                                    });
                                }
                            }

                        },
                        fail: (err) => {
                            console.log('error', err);
                        },
                    });
                }

            }
        });

    },
    onShow() {
        var that = this

        //开始接收指令
        // wx.ix.startMonitorTinyCommand({
        //     success: (r) => {
        //         console.log("success");
        //         // that.aalert('开始接收小指令')
        //     },
        //     fail: (r) => {
        //         console.log("fail, errorCode:" + r.error);

        //     }
        // });
        //等待指令的接收
        // wx.ix.onMonitorTinyCommand((r) => {
        //     console.log("received data:" + r);
        //     // that.aalert(r)
        //     that.setData({
        //         rfMoney: r.totalAmount,
        //         biz: r.bizNo
        //     })
        // });




        if (wx.getStorageSync('userInfo') == null) {
            wx.reLaunch({
                url: '../login/login'
                // url:'../main/main'
            });
        }
        // if(parseInt(wx.ix.getVersionSync().versionCode) >= 18){
        //     that.setData({
        //         isUseVip:true
        //     })
        // }else{
        //     that.setData({
        //         isUseVip:false
        //     })
        // }
        wx.request({
            url: 'https://api.51shanhe.com/p-server/user/getMerJurisdic',
            method: 'GET',
            data: {
                "merchantNumber": wx.getStorageSync('userInfo').merchantNumber
            },
            headers: {
                "token": wx.getStorageSync('userInfo').loginKey + '#AliFACE'
            },
            success: (resp) => {
                // that.aalert(resp.data.code)
                // wx.setStorageSync('payInfo',resp.data.data);
                console.log(resp)
                if (resp.data.code != 1000) {
                    that.setData({
                        isUseVip: false
                    })
                } else {
                    var infoList = resp.data.data
                    for (let i = 0; i < infoList.length; i++) {
                        if (infoList[i].authorityType == 3) {
                            that.setData({
                                isUseVip: infoList[i].authorityEnabled == 0 ? true : false
                            })
                        }
                    }
                }

            },
            fail: (err) => {
                console.log('error', err);
            },
        });
        if (wx.getStorageSync('syType') == null) {
            wx.setStorageSync('syType', 'duli')
        }
        that.setData({
            syType: wx.getStorageSync('syType')
        })
        console.log(wx.getStorageSync('userInfo'))
        // wx.ix.onKeyEventChange((r) => {


        //     if (r.keyCode == 134) {
        //         // that.dayin()
        //         wx.navigateTo({
        //             url: "../main/main"
        //         });
        //         // wx.ix.startApp({
        //         // 	appName: 'settings',
        //         // 	});
        //     } else if (r.keyCode == 133) {
        //         that.setData({
        //             box1: true,
        //             payS: false,
        //             box2: false,
        //             box3: false,
        //             money: 0,
        //             allBalance: 0,
        //             balancePayment: 0,
        //             mDiscount: 0,
        //             preferentialNum: 0,
        //             giveIntegral: 0,
        //             rfMoney: 0,
        //             openCardBox: false
        //         })
        //     } else if (r.keyCode == 131) {

        //         // if (that.data.pay == false) {
        //         //     return
        //         // }
        //         if (that.data.syType == 'nochajian') {
        //             var money = that.data.rfMoney
        //             if (money == 0 || money > 5000) {
        //                 wx.ix.speech({
        //                     text: '金额错误，请重新输入金额，单笔不得大于5000元',
        //                     success: (r) => {
        //                     }
        //                 });
        //                 return
        //             }
        //             that.chajianPay()
        //             return
        //         }
        //         var money = r.amount
        //         if (money == 0 || money > 5000) {
        //             wx.ix.speech({
        //                 text: '金额错误，请重新输入金额，单笔不得大于5000元',
        //                 success: (r) => {
        //                 }
        //             });
        //             return
        //         }
        //         that.setData({
        //             money: parseFloat(money).toFixed(2)
        //         })

        //         if (that.data.isUseVip == false) {
        //             that.facePay()
        //         } else {
        //             that.setData({
        //                 box1: false,
        //                 box2: true
        //             })
        //         }


        //         return


        //     }

        //     wx.ix.onCashierEventReceive((r) => {
        //         if (r.bizType = 'RESULT_CLOSED')

        //             wx.ix.offCashierEventReceive();
        //         that.setData({
        //             pay: true
        //         })
        //     });

        //     // wx.reLaunch({
        //     // 	url:'../index/index'
        //     // });
        // });
        // wx.ix.startMonitorTinyCommand({
        //     success: (r) => {
        //         // that.aalert(JSON.stringify(r))
        //     },
        //     fail: (r) => {
        //         // that.aalert(JSON.stringify(r))
        //     }
        // });
        // that.aalert('开始接受')
        // wx.ix.onMonitorTinyCommand((r) => {
        //     wx.showToast('success: ' + JSON.stringify(r));
        // });

        // # 结束接收指令
        // wx.ix.offMonitorTinyCommand({
        //   success: (r) => {
        //     console.log("success");
        //   },
        //   fail: (r) => {
        //     console.log("fail, errorCode:" + r.error);
        //   }
        // });
    },
    // onHide() {
    //     wx.ix.offKeyEventChange();
    // },
    // onUnload() {
    //     wx.ix.offKeyEventChange();
    // },
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
    huiyuandayin(orderNumber, time, money, payType) {
        var that = this

        if (wx.getStorageSync('dayin').data == null) {
            // wx.showToast({
            // 	title: "请先选择打印设备"
            // });
        } else {
            var userInfo = wx.getStorageSync('userInfo')
            wx.ix.printer({
                target: wx.getStorageSync('dayin').id,
                cmds: [

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['闪盒收银-会员支付'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单号:' + orderNumber] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单时间:' + time] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易方式:' + payType] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易金额:' + money] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['操作员:' + userInfo.userName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
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
    dayin(orderNumber, time, money, payType) {
        var that = this

        if (wx.getStorageSync('dayin') == null) {
            // wx.showToast({
            // 	title: "请先选择打印设备"
            // });
        } else {
            var userInfo = wx.getStorageSync('userInfo')
            wx.ix.printer({
                target: wx.getStorageSync('dayin').id,
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
                    { 'cmd': 'addText', 'args': ['订单号:' + orderNumber] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单时间:' + time] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易方式:' + payType] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易金额:' + money] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['操作员:' + userInfo.userName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
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
    tuikuandayin(orderNumber, time, money) {
        var that = this

        if (wx.getStorageSync('dayin') == null) {
            // wx.showToast({
            // 	title: "请先选择打印设备"
            // });
        } else {
            var userInfo = wx.getStorageSync('userInfo')
            wx.ix.printer({
                target: wx.getStorageSync('dayin').id,
                cmds: [

                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['退款单'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单号:' + orderNumber] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单时间:' + time] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    // { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    // { 'cmd': 'addText', 'args': ['交易方式:' + payType] },
                    // { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    // { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易金额:' + money] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['收银员:' + userInfo.userName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['收银门店:' + userInfo.storeName] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
                    { 'cmd': 'addText', 'args': ['----------------------'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['签名:'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
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
    stringC(data) {
        if (data.length > 6) {
            return data.substring(0, 6) + '..'
        } else {
            return data
        }
    },
});
