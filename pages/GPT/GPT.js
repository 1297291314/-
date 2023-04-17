
Page({
  data: {
    sTopHeight: "",
    imageSrc:'../../assert/talk.png',
    sTop: 0,
    chatOrder: true,
    statusShow: false,
    flag: false,
    sid: 0,
    content: "",
    chatContent: [],
    orders: [],
    uid: "",
    dataFlag: false,
    viewId: "a20",
    viewHeight: 0,
    showContent: true,
    timer: "",
    dataFlag: ""
  },
  onUnload: function () {
    app.globalData.chatId = ""

  },
  onReady: function () {
    
  },
  socketControl() {
    

  },

  bindReplaceInput(e) {
    
  },
  submitMessage() {
    this.socketControl()
  },
  showFlag() {
  }
    
})