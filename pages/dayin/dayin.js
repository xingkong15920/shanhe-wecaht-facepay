Page({
    data: {
        bgcolor: '#fff',
        bdcolor: '#ccc',
        usbList: [],
        chooseDayin: false,
        eqName: '',
        eqId: '',
        count: 2,
        isLanya: false,
    },
    leftArrow() {
        wx.navigateTo({
            url: '../main/main',
        })
    },
    props: {
        disabled: false, // 是否禁用
        checked: false, // 是否选中
        color: "#f5686f", // 激活状态颜色
        type: "capsule" // 形状，默认胶囊状，可选：方形 square
    },
    add() {
        console.log('123')
        var count = this.data.count
        if (count == 1) {
            return
        } else {
            this.setData({
                count: count - 1
            })
            wx.setStorageSync('dyCount',  count - 1);
        }

    },
    mius() {
        console.log('456')
        var count = this.data.count
        if (count == 5) {
            return
        } else {
            this.setData({
                count: count + 1
            })
            wx.setStorageSync('dyCount',count + 1);
        }
    },
    onLoad() {
        // wx.alert(wx.canIUse('ix.codeScan'))
        if (wx.getStorageSync('dyCount').data == null) {
            this.setData({
                count: 1
            })
        } else {
            this.setData({
                count: wx.getStorageSync('dyCount').data
            })
        }
        if (wx.getStorageSync('isLanya').data == null) {
            this.setData({
                isLanya: false
            })
        } else {
            this.setData({
                isLanya: wx.getStorageSync('isLanya').data
            })
        }
        if (wx.getStorageSync('dayin').data == null) {
            // wx.showToast({
            //   content:"请先选择打印设备"
            // });
            this.setData({
                eqName: ''
            })
        } else {
            // this.aalert(wx.getStorageSync('dayin').data.name)
            this.setData({
                eqName: wx.getStorageSync('dayin').data.name
            })
        }


    },
    switch2Change(res) {
        this.setData({
            isLanya: res.detail.value
        })
        wx.setStorageSync('isLanya', res.detail.value);
    },
    chooseEq() {
        var that = this
        that.setData({

            chooseDayin: !that.data.chooseDayin
        })


        if (that.data.chooseDayin == true) {
            if (that.data.isLanya == true) {
                var that = this
                wx.openBluetoothAdapter({
                    success: (res) => {
                        wx.startBluetoothDevicesDiscovery({
                            services: [],
                            allowDuplicatesKey: false,
                            success: (res) => {
                                console.log(res)

                            },
                            fail: (res) => {
                            },
                            complete: (res) => {
                            }
                        });
                    },
                    fail: (res) => {
                    },
                    complete: (res) => {
                    }
                });
                that.getLanya()
                // var timer = setInterval(function() {
                // 	if (that.data.isLanya == false || that.data.chooseDayin == false) {
                // 		clearInterval(timer)
                // 	}
                // 	that.getLanya()
                // }, 15000)
            } else {
                wx.ix.queryPrinter({
                    success: (res) => {
                        // that.aalert(JSON.stringify(res))
                        if (res.usb.length == 0) {
                            wx.showToast({
                                content: '未查询到设备，请检查连接'
                            });
                            this.setData({

                                chooseDayin: false
                            })
                            return
                        }
                        that.setData({
                            usbList: res.usb,
                            chooseDayin: true
                        })

                    }
                })
            }

        }


    },
    getLanya() {
        wx.showLoading({
            content: '正在查找设备',
            success: (res) => {

            },
        });
        var that = this
        wx.getBluetoothDevices({
            success: (res) => {
                console.log(res)
                setTimeout(function () {
                    wx.hideLoading();
                }, 500)
                var list = res.devices
                var dyList = new Array()
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].name) {

                    } else {
                        var dyO = new Object()
                        dyO.name = list[i].name
                        dyO.id = list[i].deviceId
                        dyList.push(dyO)
                    }

                }
                that.setData({
                    usbList: dyList,
                    chooseDayin: true
                })
                // that.aalert(JSON.stringify(res))
                // wx.onBluetoothDeviceFound(function (devices) {
                // 	that.show(JSON.stringify(devices))

                // })
            },
            fail: (res) => {
            },
            complete: (res) => {
            }
        });
    },
    onEq(res) {
        // this.aalert(res)
        var that = this
        var blId = res.target.dataset.id
        var blName = res.target.dataset.name
        if (this.data.isLanya == true) {
            wx.showLoading({
                success: (res) => {

                },
            });
            // that.aalert(this.data.isLanya)
            wx.connectBLEDevice({
                // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                deviceId: blId,
                success: (res) => {
                    // that.aalert(JSON.stringify(res) + '1')
                    wx.hideLoading();
                    that.setData({
                        eqName: blName,
                        eqId: blId,
                        chooseDayin: false
                    })
                    var ooo = new Object()
                    ooo.name = blName
                    ooo.id = blId
                    wx.setStorageSync('dayin',  ooo);
                    // wx.closeBluetoothAdapter()
                },
                fail: (res) => {
                    wx.hideLoading();
                    that.aalert(JSON.stringify(res + '2'))
                },
                complete: (res) => {
                }
            });
        } else {
            that.setData({
                eqName: res.target.dataset.name,
                eqId: res.target.dataset.id,
                chooseDayin: false
            })
            wx.setStorageSync('dayin',res.target.dataset);
        }
        // this.setData({
        // 	eqName: res.target.dataset.name,
        // 	eqId: res.target.dataset.id,
        // 	chooseDayin: false
        // })
        // wx.setStorageSync(dayin',res.target.dataset);
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
    ceshi() {
        var that = this

        if (wx.getStorageSync('dayin').data == null) {
            wx.showToast({
                content: "请先选择打印设备"
            });
        } else {
            that.aalert(wx.getStorageSync('dayin').data.id)
            wx.getConnectedBluetoothDevices({
                success: res => {
                    if (res.devices.length === 0) {
                        wx.alert({ content: '没有在连接中的设备！' });
                        return;
                    }
                    wx.alert({ content: JSON.stringify(res) });
                    devid = res.devices[0].deviceId;
                },
                fail: error => {
                    wx.alert({ content: JSON.stringify(error) });
                },
            });

            return
            wx.ix.printer({
                target: wx.getStorageSync('dayin').data.id,
                cmds: [
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
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
                    { 'cmd': 'addText', 'args': ['订单号:' + '12313214213123'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['订单时间:' + '2019-09-09 23:12:12'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易方式:' + '支付宝'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['交易金额:' + '1.00'] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addPrintAndLineFeed', 'args': [] },
                    { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
                    { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
                    { 'cmd': 'addText', 'args': ['操作员:' + '12313214213123'] },
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
    // cesh2() {
    //     var that = this
    //     wx.ix.queryPrinter({
    //         success: (res) => {
    //             that.aalert(JSON.stringify(res))
    //         }
    //     })
    // },
    kaiqi() {
        var that = this
        wx.ix.startCodeScan({ scanType: "ALL" });


        wx.ix.onCodeScan((r) => {
            that.aalert(JSON.stringify(r))
            if (r.success)
                that.aalert('code: ' + r.code);
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
    // }
});
