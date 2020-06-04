EventEmitter = require '../../core/events'
AVBuffer = require '../../core/buffer'

class StreamSource extends EventEmitter
    constructor: (@streamObj, @size) ->
        @stream = null
        @loaded = 0
        
    getSize: ->
        return @size
        
    start: ->
        if @stream
            return @stream.resume()
            
        @stream = @streamObj
        
        b = new Buffer(1 << 20)
        blen = 0
        @stream.on 'data', (buf) =>
            @loaded += buf.length
            buf.copy(b, blen)
            blen = blen + buf.length
            
            @emit 'progress', @loaded / @size * 100
            
            if blen >= b.length or @loaded >= @size
              if blen < b.length
                b = b.slice(0, blen)
                
              @emit 'data', new AVBuffer(new Uint8Array(b))
              blen -= b.length
              buf.copy(b, 0, blen)
    
        @stream.on 'end', =>
            @emit 'end'
            
        @stream.on 'error', (err) =>
            @pause()
            @emit 'error', err
    
    pause: ->
        @stream.pause()
        
module.exports = FileSource
