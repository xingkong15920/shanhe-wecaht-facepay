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
        pwphone: '',                //手机号（找回密码页面）
        code: '',
        password1: '',
        password2: '',
        pwusernumber: '',           //验证码
        codeInfo: '获取验证码',
        focus: true,
        passwordDain: true, //你好的密码是本身还是**
        passwordZhao: true, //找回密码的新密码是本身还是**
        passZhao: true, //找回密码的确认密码是本身还是**
        loginWhite: '', //登录的白背景
    },
    // 你好的密码变成*
    passYin: function() {
        console.log('aaaaaaa')
        this.setData({
            passwordDain: true
        })
    },
    // 你好的密码变成数字
    passXian: function() {
        console.log('bbbbbb')
        this.setData({
            passwordDain: ''
        })
    },
    // 找回密码的密码变成*
    mimaYin: function() {
        console.log('aaaaaaa')
        this.setData({
            passwordZhao: true
        })
    },
    // 找回密码的密码变成数字
    mimaXian: function() {
        console.log('bbbbbb')
        this.setData({
            passwordZhao: ''
        })
    },
    // 找回密码的确认密码变成*
    miYin: function() {
        console.log('aaaaaaa')
        this.setData({
            passZhao: true
        })
    },
    // 找回密码的确认密码变成数字
    miXian: function() {
        console.log('bbbbbb')
        this.setData({
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
        console.log('这是res')
        console.log(res)
        this.setData({
            save: res.detail.value
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
                codeInfo: 5
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
    onLoad: function() {
        let that = this
        if (wx.getStorageSync('save').data == null) {
            this.setData({
                save: false,
            })
        } else {
            this.setData({
                save: wx.getStorageSync('save').data.save,
                phone: wx.getStorageSync('save').data.phone,
                password: wx.getStorageSync('save').data.pw,
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
        // wx.ix.getVersion({
        //     success: (r) => {
        //         this.setData({
        //             sdk: r.versionName + '-' + r.versionCode
        //         })
        //     }
        // });
        // wx.ix.getSysProp({
        //     key: 'ro.serialno',
        //     success: (r) => {
        //         console.log(r)
        //         this.setData({
        //             "equipmentNumber": r.value
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
                // wx.setStorageSync({
                // 	key: 'payInfo', // 缓存数据的key
                // 	data: resp.data.data, // 要缓存的数据
                // });
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
    // 登录
    login1: function() {
        console.log('123')
        // 登录背景变白，字变绿
        this.setData({
            loginWhite: 'white'
        })
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
                "appEdition": wx.getStorageSync('version').data,
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
                if (that.data.save == true) {
                    this.setData({
                        save: true,
                        phone: that.data.phone,
                        pw: that.data.password
                    })
                    var saveObj = new Object()
                    saveObj.save = true
                    saveObj.phone = that.data.phone
                    saveObj.pw = that.data.password
                    wx.setStorageSync('save', 'saveObj')
                } else {
                    wx.removeStorageSync('save')
                }
                wx.setStorageSync('userInfo', resp.data.data)
                wx.setStorageSync('tuikuan', that.data.password.substring(that.data.password.length - 6))
                wx.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration: "1000",
                    success: (res) => {
                        setTimeout(function() {
                            wx.reLaunch({
                                url: '../index/index'
                                // url:'../main/main'
                            });
                        }, 200)
                    },
                });
                // 跳转到设置页面
                wx.navigateTo({
                    url: '../main/main'
                });
            },
            fail: (err) => {
                console.log('接口fail')
                // that.aalert(JSON.stringify(err))
            },
        });
    }
});