Page({
    data: {
        //server:'http://192.168.1.66:6017/p-server/',
        server: 'https://api.51shanhe.com/p-server/',
        phone: "",
        password: '',
        userType: '4',
        equipmentNumber: '',
        equipmentType: '2',
        institutionNumber: '1004',
        appEdition: '1.0.0',
        runMode: '0',
        save: false,
        type: 1,
        pwphone: '', //手机号（找回密码页面）
        code: '',
        password1: '',
        password2: '',
        pwusernumber: '', //验证码
        codeInfo: '获取验证码',
        focus: true,
        passwordDain: true, //你好的密码是本身还是**
        passwordZhao: true, //找回密码的新密码是本身还是**
        passZhao: true, //找回密码的确认密码是本身还是**
        loginWhite: '', //登录的白背景
        keyCodeLst: [{
                keyCode: "144"
            }, //青蛙原生小键盘按键 - 1
            {
                keyCode: "145"
            }, //青蛙原生小键盘按键 - 2
            {
                keyCode: "146"
            }, //青蛙原生小键盘按键 - 3
            {
                keyCode: "147"
            }, //青蛙原生小键盘按键 - 4
            {
                keyCode: "148"
            }, //青蛙原生小键盘按键 - 5
            {
                keyCode: "149"
            }, //青蛙原生小键盘按键 - 6
            {
                keyCode: "157"
            }, //青蛙原生小键盘按键 - +号
            {
                keyCode: "66"
            }, //青蛙原生小键盘按键 刷脸
            {
                keyCode: "112"
            }, //青蛙原生小键盘按键 F1
            {
                keyCode: "113"
            }, //青蛙原生小键盘按键 F2
            {
                keyCode: "114"
            }, //青蛙原生小键盘按键 F3
            {
                keyCode: "61"
            } //青蛙原生小键盘按键 设置
        ],
    },


    // 你好的密码变成*
    passYin: function() {
        console.log('aaaaaaa')
        this.setData({
            yinBtn: false,
            passwordDain: true
        })
    },
    // 你好的密码变成数字
    passXian: function() {
        console.log('bbbbbb')
        this.setData({
            yinBtn: true,
            passwordDain: ''
        })
    },
    // 找回密码的密码变成*
    mimaYin: function() {
        console.log('aaaaaaa')
        this.setData({
            yinCangBtn: false,
            passwordZhao: true
        })
    },
    // 找回密码的密码变成数字
    mimaXian: function() {
        console.log('bbbbbb')
        this.setData({
            yinCangBtn: true,
            passwordZhao: ''
        })
    },
    // 找回密码的确认密码变成*
    miYin: function() {
        console.log('aaaaaaa')
        this.setData({
            yinCangBtn2: false,
            passZhao: true
        })
    },
    // 找回密码的确认密码变成数字
    miXian: function() {
        console.log('bbbbbb')
        this.setData({
            yinCangBtn2: true,
            passZhao: ''
        })
    },
    clear: function() {
        console.log('aaaaaaa')
        this.setData({
            phone: ''
        })
    },
    clear1: function() {
        this.setData({
            password: ''
        })
    },
    clearYZ: function() {
        console.log('这是yz')
        this.setData({
            code: ''
        })
    },
    clearNew: function() {
        this.setData({
            password1: ''
        })
    },
    clearNewAgain: function() {
        this.setData({
            password2: ''
        })
    },
    clearPhone: function() {
        this.setData({
            pwphone: ''
        })
    },
    save1: function(res) {
        // console.log('这是res')
        // console.log(res)
        // console.log(res.detail.value)
        this.setData({
            save: !this.data.save
        })
    },
    // 获取验证码
    getCode: function() {
        var that = this
        if (that.data.pwphone == '') {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            });
            return
        }
        if (that.data.codeInfo != '获取验证码') {
            wx.showToast({
                title: '获取验证码间隔为1分钟',
                icon: 'none'
            })
            return
        }
        this.daojishi()
        wx.showToast({
            title: '验证码已发送',
            icon: 'none'
        })
        wx.request({
            url: 'https://api.51shanhe.com/p-server/user/getCode',
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                "institutionNumber": that.data.institutionNumber,
                // "merchantNumber": '',
                "phone": that.data.pwphone,
                "userType": '4'
            },
            success: (resp) => {
                that.aalert(resp.data.code)
                wx.setStorageSync('payInfo', resp.data.data);
                if (resp.data.code != 1000) {
                    wx.showToast({
                        title: resp.data.msg,
                        icon: 'none'
                    })
                } else {
                    that.setData({
                        pwusernumber: resp.data.data.userNumber
                    })
                }
            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    daojishi: function() {
        var timer;
        var that = this
        if (that.data.codeInfo == '获取验证码') {
            that.setData({
                codeInfo: 59
            })
        }
        if (that.data.type == 1) {
            clearInterval(timer)
        }
        timer = setInterval(function() {
            if (that.data.codeInfo == 0) {
                clearInterval(timer)
                that.setData({
                    codeInfo: '获取验证码'
                })
            } else {
                var codeInfo = that.data.codeInfo
                that.setData({
                    codeInfo: codeInfo - 1
                })
            }

        }, 1000)

    },

    // 刷脸
    shuaLian: function() {
        //启动刷脸支付
        wxfaceapp.facePay({
            requireFaceCode: false11, //是否需要获取付款码返回给小程序
            success(res) {
                console.log("success [launchFaceApp]")
                console.log(res.replyCode)
                console.log(res.reply)
                //faceCode，在传入requireFaceCode=true时起效
                // console.log(res.faceCode) 
                wx.showModal({
                    title: 'res.replyCode',
                    content: JSON.stringify(res.replyCode)
                })
                wx.showModal({
                    title: 'res.reply',
                    content: JSON.stringify(res.reply)
                })
                wx.showModal({
                    title: 'res.faceCode',
                    content: JSON.stringify(res.faceCode)    //不返这一项
                })
                wx.showModal({
                    title: 'res',
                    content: JSON.stringify(res)
                })
                wx.showModal({
                    title: 'success',
                    content: "启动刷脸支付"
                })
                //刷脸成功Event 建议配合facePay的调用结果进行注册
                wxfaceapp.onFacePayPassEvent(function(res) {
                    // console.log("onFacePayPassEvent retCode = " + res.replyCode)
                    wx.showModal({
                        title: '刷脸成功Event',
                        content: JSON.stringify(res)
                    })
                    wx.showModal({
                        title: '刷脸成功Event',
                        content: '刷脸成功Event'
                    })
                    

                    //数据写串口
                    // wxfaceapp.writeToSerialPort({
                    //     msgToFlush: res.faceCode,
                    //     success(res) {
                    //         // console.log("success [writeToSerialPort]")
                    //         // console.log(res.replyCode)
                    //         // console.log(res.reply)
                    //         // console.log(res.flushedMsg)
                    //         wx.showModal({
                    //             title: 'res.flushedMsg',
                    //             content: JSON.stringify(res.flushedMsg),
                    //         })
                    //         wx.showModal({
                    //             title: 'res.reply',
                    //             content: JSON.stringify(res.reply),
                    //         })
                    //         wx.showModal({
                    //             title: 'res.replyCode',
                    //             content: JSON.stringify(res.replyCode),
                    //         })
                    //         wx.showModal({
                    //             title: '数据写串口成功',
                    //             content: '数据写串口成功',
                    //         })
                    //     },
                    //     fail(res) {
                    //         // console.log("fail [writeToSerialPort]")
                    //         // console.log(res.replyCode)
                    //         // console.log(res.reply)
                    //         wx.showModal({
                    //             title: 'res.reply',
                    //             content: JSON.stringify(res.reply),
                    //         })
                    //         wx.showModal({
                    //             title: 'res.replyCode',
                    //             content: JSON.stringify(res.replyCode),
                    //         })
                    //         wx.showModal({
                    //             title: '数据写串口失败',
                    //             content: '数据写串口失败',
                    //         })
                    //     }
                    // })
                })
                //刷脸失败Event 建议配合facePay的调用结果进行注册
                wxfaceapp.onFacePayFailedEvent(function(res) {
                    // console.log("onFacePayFailedEvent retCode = " + res.replyCode)
                    wx.showModal({
                        title: '刷脸失败Event',
                        content: JSON.stringify(res.replyCode)
                    })
                })
                //查单成功Event
                wxfaceapp.onQueryPaymentSucEvent(function(res) {
                    // console.log("onQueryPaymentSucEvent retCode = " + res.replyCode)
                    wx.showModal({
                        title: '查单成功Event',
                        content: JSON.stringify(res.replyCode)
                    })
                })
                //查单失败Event
                wxfaceapp.onQueryPaymentFailedEvent(function(res) {
                    // console.log("onQueryPaymentFailedEvent retCode = " + res.replyCode)
                    wx.showModal({
                        title: '查单失败Event',
                        content: JSON.stringify(res.replyCode)
                    })
                })
            },
            fail(res) {
                // console.log("fail [launchFaceApp]")
                // console.log(res.replyCode)
                // console.log(res.reply)
                wx.showModal({
                    title: 'res.replyCode',
                    content: JSON.stringify(res.replyCode)
                })
                wx.showModal({
                    title: 'res.reply',
                    content: JSON.stringify(res.reply)
                })
                wx.showModal({
                    title: 'fail',
                    content: "没有启动刷脸支付"
                })
            }
        })
    },
    onLoad: function() {
        let that = this
        if (wx.getStorageSync('save') == null) {
            this.setData({
                save: false,
            })
        } else {
            this.setData({
                save: wx.getStorageSync('save').save,
                phone: wx.getStorageSync('save').phone,
                password: wx.getStorageSync('save').pw,
            })
        }
        wx.request({
            url: 'https://pv.sohu.com/cityjson?ie=utf-8',
            success: function(e) {
                console.log(e.data);
                var aaa = e.data.split(' ');
                console.log(aaa)
                var bbb = aaa[4]
                console.log(bbb)
                var ccc = bbb.replace('"', '')
                console.log(ccc)
                var ddd = ccc.replace('"', '')
                console.log(ddd)
                var eee = ddd.replace(',', '')
                console.log(eee)
                that.setData({
                    IP: eee
                })

            },
            fail: function() {
                console.log("失败了");
            }

        })
        //获取系统信息
        wxfaceapp.checkWxFacePayOsInfo({
            success(res) {
                // console.log("success [checkWxFacePayOsInfo]")
                // console.log(res.osVersion)
                // console.log(res.osStatus)
                wx.showModal({
                    title: 'res.osVersion',
                    content: res.osVersion
                })
                wx.showModal({
                    title: 'res.osStatus',
                    content: res.osStatus
                })
                wx.showModal({
                    title: 'success',
                    content: "获取系统信息成功"
                })
            },
            fail(res) {
                // console.log("fail [checkWxFacePayOsInfo]")
                // console.log(res.osErrorMsg)
                wx.showModal({
                    title: 'fail',
                    content: "获取系统信息失败"
                })
                wx.showModal({
                    title: 'res.osErrorMsg',
                    content: JSON.stringify(res.osErrorMsg)
                })
            }
        })
        //注册键盘监听
        // wxfaceapp.registKeyBoard({
        //     keyCodeList: this.data.keyCodeLst,
        //     success(res) {
        //         console.log("success [registKeyBoard]")
        //         console.log(res.replyCode)
        //         console.log(res.reply)
        //         wx.showModal({
        //             title: 'res.replyCode',
        //             content: JSON.stringify(res.replyCode),
        //         })
        //         wx.showModal({
        //             title: 'res.reply',
        //             content: JSON.stringify(res.reply),
        //         })
        //         wx.showModal({
        //             title: 'success',
        //             content: "注册键盘监听成功",
        //         })
        //         //注册成功后，设置键盘按键响应回调
        //         wxfaceapp.onKeyBoardEvent(function(res) {
        //             // console.log("onKeyBoardEvent name = " + res.keyName)
        //             wx.showModal({
        //                 title: '键盘按键响应回调',
        //                 content: JSON.stringify(res.keyName)
        //             })
        //         })
        //     },
        //     fail(res) {
        //         console.log("fail [registKeyBoard]")
        //         console.log(res.replyCode)
        //         console.log(res.reply)
        //         wx.showModal({
        //             title: 'res.replyCode',
        //             content: JSON.stringify(res.replyCode),
        //         })
        //         wx.showModal({
        //             title: 'res.reply',
        //             content: JSON.stringify(res.reply),
        //         })

        //         wx.showModal({
        //             title: 'fail',
        //             content: "注册键盘监听失败",
        //         })
        //     }
        // })
        //监听扫码器
        wxfaceapp.listenCodePayment({
            success(res) {
                wx.showModal({
                    title: '监听扫码器成功',
                    content: '监听扫码器成功',
                })
                //注册扫码支付事件
                wxfaceapp.onCodePayEvent(function(res) {
                    wx.showModal({
                        title: 'res.replyCode',
                        content: JSON.stringify(res.replyCode),
                    })
                    wx.showModal({
                        title: '注册扫码支付事件成功',
                        content: '注册扫码支付事件成功',
                    })
                })
            }
        })
        //数据写串口
        // wxfaceapp.writeToSerialPort({
        //     msgToFlush: "12345678910",
        //     success(res) {
        //         // console.log("success [writeToSerialPort]")
        //         // console.log(res.replyCode)
        //         // console.log(res.reply)
        //         // console.log(res.flushedMsg)
        //         wx.showModal({
        //             title: 'res.flushedMsg',
        //             content: JSON.stringify(res.flushedMsg),
        //         })
        //         wx.showModal({
        //             title: 'res.reply',
        //             content: JSON.stringify(res.reply),
        //         })
        //         wx.showModal({
        //             title: 'res.replyCode',
        //             content: JSON.stringify(res.replyCode),
        //         })
        //         wx.showModal({
        //             title: '数据写串口成功',
        //             content: '数据写串口成功',
        //         })
        //     },
        //     fail(res) {
        //         // console.log("fail [writeToSerialPort]")
        //         // console.log(res.replyCode)
        //         // console.log(res.reply)
        //         wx.showModal({
        //             title: 'res.reply',
        //             content: JSON.stringify(res.reply),
        //         })
        //         wx.showModal({
        //             title: 'res.replyCode',
        //             content: JSON.stringify(res.replyCode),
        //         })
        //         wx.showModal({
        //             title: '数据写串口失败',
        //             content: '数据写串口失败',
        //         })
        //     }
        // })



    },
    aalert(data) {
        // wx.alert({
        //     // title: '',
        //     // content: data,
        //     title: data,
        //     icon: 'none',
        //     buttonText: '我知道了',
        //     success: () => {
        //         // wx.alert({
        //         // 	title: '用户点击了「我知道了」',
        //         // });
        //     },
        // });
        wx.showModal({
            title: data,
            content: '这是一个模态弹窗',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 监听键盘输入账号（你好页面）
    phone: function(e) {
        console.log(e)
        this.setData({
            "phone": e.detail.value
        })
    },
    pwphone: function(e) {
        this.setData({
            "pwphone": e.detail.value
        })
    },
    code: function(e) {
        console.log(e)
        this.setData({
            "code": e.detail.value
        })
    },
    pass1: function(e) {
        this.setData({
            "password1": e.detail.value
        })
    },
    pass2: function(e) {
        this.setData({
            "password2": e.detail.value
        })
    },
    // 监听键盘输入密码（你好页面）
    pass: function(e) {
        console.log(e)
        this.setData({
            "password": e.detail.value
        })
    },
    // 去登录
    login2: function() {
        var that = this
        if (that.data.pwphone == '') {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            })
            return
        }
        if (that.data.code == '') {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none'
            })
            return
        }
        if (that.data.password1 == '') {
            wx.showToast({
                title: '请输入新密码',
                icon: 'none'
            })
            return
        }
        if (that.data.password2 == '') {
            wx.showToast({
                title: '请再次输入密码',
                icon: 'none'
            })
            return
        }
        if (that.data.password2 != that.data.password1) {
            wx.showToast({
                title: '两次输入的密码不一致',
                icon: 'none'
            })
            return
        }
        if (that.data.pwusernumber == '') {
            wx.showToast({
                title: '请获取验证码',
                icon: 'none'
            })
            return
        }
        wx.showLoading({
            title: '请稍后...',
            icon: 'none'
        })
        wx.request({
            url: 'https://api.51shanhe.com/p-server/user/forgetPassword',
            method: 'POST',
            data: {
                "userNumber": that.data.pwusernumber,
                "password": that.data.password2,
                "code": that.data.code,
                "userType": '4'
            },
            success: (resp) => {
                // that.aalert(resp.data.code)
                // wx.setStorageSync('payInfo',resp.data.data);
                wx.hideLoading()
                if (resp.data.code != 1000) {
                    wx.showToast({
                        title: resp.data.msg,
                        icon: 'none'
                    })
                } else {

                    wx.showToast({
                        title: resp.data.msg,
                        icon: 'none'
                    })
                    that.setData({
                        type: 1,
                        pwphone: '',
                        code: '',
                        password1: '',
                        password2: '',
                        pwusernumber: '',
                        codeInfo: '获取验证码'
                    })

                }
                // 跳转页面
                this.setData({
                    type: 1
                })
            },
            fail: (err) => {
                console.log('error', err);
            },
        });
    },
    forget: function() {
        this.setData({
            type: 2
        })
    },
    typeBack: function() {
        this.setData({
            type: 1
        })
    },
    // 退出小程序
    tuiChu: function() {
        console.log('退出')
        wxfaceapp.exitMp({
            success(res) {
                wx.showModal({
                    title: '退出小程序',
                    content: '退出小程序'
                });
            }
        })
    },
    // 登录
    login1: function() {
        console.log('123')
        // 登录背景变白，字变绿
        // this.setData({
        //     loginWhite: 'white'
        // })
        var that = this
        var tjData
        if (that.data.phone == '') {
            console.log('请输入账号')
            wx.showToast({
                title: '请输入账号',
                icon: 'none'
            });
            return
        }
        if (that.data.password == '') {
            console.log('请输入密码')
            wx.showToast({
                title: '请输入密码',
                icon: 'none'
            })
            return
        }

        wx.showLoading({
            success: (res) => {

            },
        });
        wx.request({
            url: that.data.server + 'user/login',
            //url:'http://192.168.1.66:6017/p-server/user/login',
            method: 'POST',
            data: {
                "phone": that.data.phone,
                "password": that.data.password,
                "userType": that.data.userType,
                // "equipmentNumber": that.data.equipmentNumber,
                "equipmentNumber": 'SMIT3B2019817000336',
                "equipmentType": that.data.equipmentType,
                "institutionNumber": that.data.institutionNumber,
                "ip": that.data.IP,
                // "sdkEdition": that.data.sdk,
                "sdkEdition": '12314123132',
                "appEdition": wx.getStorageSync('version'),
                "runMode": that.data.runMode

            },
            timeout: '10000',
            success: (resp) => {
                console.log('这是resp')
                console.log(resp)
                if (resp.data.code != 1000) {
                    wx.showToast({
                        title: resp.data.msg,
                        icon: 'none'
                    })
                    wx.hideLoading();
                    return
                }
                setTimeout(function() {
                    wx.hideLoading();
                }, 500)
                console.log('这是save')
                console.log(that.data)
                if (that.data.save == true) {
                    this.setData({
                        save: true,
                        phone: that.data.phone,
                        pw: that.data.password
                    })
                    console.log('这是pw')
                    console.log(that.data.pw)
                    var saveObj = new Object()
                    saveObj.save = true
                    saveObj.phone = that.data.phone
                    saveObj.pw = that.data.password
                    wx.setStorageSync('save', saveObj)
                } else {
                    wx.removeStorageSync('save')
                }
                wx.setStorageSync('userInfo', resp.data.data)
                wx.setStorageSync('tuikuan', that.data.password.substring(that.data.password.length - 6))
                // wx.showToast({
                //     title:JSON.stringify(resp.data),
                //     icon:'none'
                // })
                wx.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration: "1000",
                    success: (res) => {
                        // setTimeout(function () {
                        //     wx.reLaunch({
                        //         // url: '../index/index'
                        //         url:'../main/main'
                        //     });
                        // }, 200)
                    },
                });
                // 跳转到设置页面
                wx.navigateTo({
                    url: '../main/main'
                    // url: '../index/index'
                });
            },
            fail: (err) => {
                console.log('接口fail')
                // that.aalert(JSON.stringify(err))
            },
        });
    }
});