// pages/main/main.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        server: 'https://api.51shanhe.com/p-pay/',
        //server:'http://192.168.1.66:6017/p-server/',
        network: false,
        equipmentNumber: 'SMIT3B2019729000825',
        sdk: '12314123132',
        list: [
            {
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})