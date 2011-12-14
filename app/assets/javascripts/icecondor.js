var iceCondor = {
  callbacks: {}, 

  setup: function() {
    var self = this
    this.io = io.connect()
    this.io.on('dispatch', function(msg){self.dispatch(self,msg)})
  },

  emit: function(data) {
    this.io.emit('api', data)
  },

  on: function(type, callback) {
    this.callbacks[type] = callback
  },

  dispatch: function(self, msg) {
    var callback = this.callbacks[msg.type]
    if (callback) { callback(msg) }
  }
}