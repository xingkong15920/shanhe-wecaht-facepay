//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        box1: false, //初始页面
        box2: true, //确认支付页面
        box3: false, //订单支付页面
        payT: 1, //切换订单支付123
        payS: false, //支付成功
        openCardBox: false, //开卡有礼页面
        money: 0, //订单金额
        headImg: '../img/shan.png',
        nickName: '',
        allBalance: 0, //余额
        balancePayment: 0, //余额支付(自定义)
        mDiscount: '0', //会员优惠（自定义）
        errorPayment: '', //错误的余额支付
        disCountRate: '', //折扣
        bpButton: true, //余额支付按钮
        cpButton: true, //取消支付按钮
        discountHeight: '114rpx', //可用优惠券右边向下的箭头
        mdText: true, //会员优惠按钮
        preferentialNum: 0, //优惠合计
        giveIntegral: 0, //积分奖励
        mdDiscont: true, //会员享受折优惠，每消费元积分
        voucherList: '', //优惠券数组
        discount: '1', //折扣 
        dcNum: 0, //可用优惠券上边的优惠券
        voucherNo: '', //使用优惠券的金额
        isUseVip: false, //是否可以使用会员支付
        ocGetCode: true, //获取验证码or重新发送(59s)
        ocPleasePhone1: '', //请输入手机号
        ocPleasePhone2: '', //请输入验证码
        codeInfo: '59', //倒计时60s
        mebInfo: [], //点击会员支付，传参给发送验证码，
        rfMoney: 0, //插件金额
        querenType: false, //确认是否
        goHide: 0
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    // 会员支付
    huiyuan: function(res) {
        console.log('11111111')
        var that = this
        that.setData({
            box2: false,
            openCardBox: true, //开卡有礼页面
        })
    },
    // 立即开卡按钮
    ocImmediately: function(){
        // 确认开卡弹窗
        // this.setData({
        //     querenType: true
        // })
    },

})