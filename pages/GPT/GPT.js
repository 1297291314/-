const app = getApp()
const recorderManager = wx.getRecorderManager()
Page({
  data: {
    sTopHeight: "",
    sTop: 0,
    chatOrder: true,
    statusShow: false,
    flag: false,
    sid: 0,
    
    orders: [],
    uid: "",
    dataFlag: false,
    viewId: "a20",
    viewHeight: 0,
    showContent: true,
    timer: "",
    dataFlag: "",

    imageSrc:'../../assert/talk.png',
    speakFlag: false,
    time1:null,
    cancelRecord:false,
    recording:true,
    touchBtn: false,
    touched:false,

    content: "", // 内容
    chatContent:[
      {
        name: 'GTP',
        src:'../../assert/key.png',
        content: '我是GTP,有什么可以帮您的嘛',
        userOrGTPflag:'0', // 0 是 GTP，1是用户
        group:'0',
        id:'0'
      },
      // {
      //   name: 'user',
      //   src:'../../assert/key.png',
      //   content: '',
      //   userOrGTPflag:'1', // 0 是 GTP，1是用户
      // }
    ],
    messageFocus:false,
    audioContext:null,
    keyboardHeight:0  //键盘高度
  },
  goToTalk:function(){
    this.setData({
      messageFocus: true
    })
  },
  onLoad:function(){
    this.setData({audioContext:wx.createInnerAudioContext({
      useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    })})
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {}
          })
        }
      }
    });
    wx.onKeyboardHeightChange(res => {
      this.setData({
        keyboardHeight: res.height
      });
    })
  },
  onUnload: function () {
    // 页面卸载
    this.data.audioContext && this.data.audioContext.stop()
  },
  speakChange: function(){
    this.setData({
      speakFlag:!this.data.speakFlag
    })
    console.log(this.data.speakFlag)
  },
  onLongpress() {
    this.setData({
      recording:true
    })

},
// touchstart
record() {
    // const scopeRecord = app.globalData.scopeRecord;
    // if (!scopeRecord) {
    //     getScopeRecord();
    //     return;
    // }
    this.setData({
      recording:true,
      touched:true,
      cancelRecord:false,
    })
    this.setData({
        touchBtn: true
    })
    this.start()
    this.showMicAni(1);
},
showMicAni(i) {
    let delay = 500; 
    let that = this;
    wx.showToast({
        title: '说话中...',
        duration: 60000,
        icon:'loading'
    })
},
onTouchMove(e) {
    this.setData({
      recording:true
    })
    clearTimeout(this.data.time1)
    if (e.touches[0].clientY < 520) {
        this.setData({
          cancelRecord:true
        })
        wx.showToast({
            title: '松开，取消说话',
            duration: 10000,
            // image: '/page/common/resource/image/cancel.png'
        })
    } else {
        this.showMicAni(1);
        this.setData({
          cancelRecord: false
        })
    }
},
onTouchEnd(e) {
    clearTimeout(this.data.time1)
    if (this.data.recording) {
        if (!this.data.touched) return;
        this.setData({
          touched: false
        })
        wx.hideToast();
        setTimeout(() => {
            this.stop()
        }, 400);
    } else {
        wx.showToast({
            title: '说话时间太短',
            duration: 500,
            // image: '/page/common/resource/image/warn-b.png'
        })
        // 延时处理 防止录音未调起就触发停止
        setTimeout(() => {
            this.triggerEvent('stopRecord', {send: false});
        }, 400);
    }
    this.setData({touchBtn: false})
},
start: function () {
  const options = {
    duration: 10000,//指定录音的时长，单位 ms
    sampleRate: 16000,//采样率
    numberOfChannels: 1,//录音通道数
    encodeBitRate: 96000,//编码码率
    format: 'mp3',//音频格式，有效值 aac/mp3
    frameSize: 50,//指定帧大小，单位 KB
  }
  //开始录音
  recorderManager.start(options);
  recorderManager.onStart(() => {
    console.log('recorder start')
  });
  //错误回调
  recorderManager.onError((res) => {
    console.log(res);
  })
},
//停止录音
stop: function () {
  recorderManager.stop();
  recorderManager.onStop((res) => {
    this.tempFilePath = res.tempFilePath;
    console.log('停止录音', res.tempFilePath)
    const { tempFilePath } = res
  })
},
  onReady: function () {
    
  },

  bindReplaceInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  hideFlag(){

  },
  onKeyboardHeightChange(){
    
    
  },
  bindInputBlur(){
    // this.setData({
    //   messageFocus: false
    // })
    this.setData({
      keyboardHeight: 0
    });
  },
  submitMessage(e) {
    if(!this.data.content){
      return;
    } 

    let chatContent = this.data.chatContent;
    chatContent.push(
      {
        name: 'user',
        src:'../../assert/key.png',
        content: this.data.content,
        userOrGTPflag:'1', // 0 是 GTP，1是用户
        group:1,
        id: chatContent.length+''
      }
    )
    
    chatContent.push(
      {
        name: 'GTP',
        src:'../../assert/key.png',
        content: '我是GTP',
        userOrGTPflag:'0', // 0 是 GTP，1是用户
        group:1,
        id:chatContent.length+''
      }
    )
    this.setData({chatContent:chatContent})
    this.data.audioContext.src=`https://fanyi.sogou.com/reventondc/synthesis?text=${encodeURI(this.data.content)}&lang=zh-CHS&from=translateweb&speaker=6`
    this.setData({
      content: '',
      sTop: this.data.chatContent.length*100+600,
      messageFocus: true
    })
    this.data.audioContext.play()
    // wx.request({
    //   url: 'https://fanyi.sogou.com/reventondc/synthesis?text=%E4%BD%A0%E5%A5%BD%E5%95%8A&speed=1&lang=zh-CHS&from=translateweb&speaker=6',
    //   method: 'GET',
    //   success(res){
    //     console.log(res)
    //   }
    // })
  },
  showFlag() {
  }
    
})