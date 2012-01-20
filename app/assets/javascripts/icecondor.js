var iceCondor = {
  callbacks: {}, 

  setup: function() {
    var self = this
    this.io = io.connect()
    this.io.on('dispatch', function(msg){self.dispatch(self,msg)})
    this.io.on('connect', function(msg){self.dispatch(self,{type:'connect'})})
    this.io.on('disconnect', function(msg){self.dispatch(self,{type:'disconnect'})})
  },

  api: function(data) {
    /* todo: one-shot callback */
    console.log('iceCondor.api')
    console.log(data)
    this.io.emit('api', data)
  },

  on: function(type, callback) {
    this.callbacks[type] = callback
  },

  dispatch: function(self, msg) {
    var callback = this.callbacks[msg.type]
    if (callback) { 
      callback(msg) 
    } else {
      console.log('warning: no callback defined for '+msg.type)
    }
  },
}