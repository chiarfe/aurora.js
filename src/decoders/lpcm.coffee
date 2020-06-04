Decoder = require '../decoder'

class LPCMDecoder extends Decoder
    Decoder.register('lpcm', LPCMDecoder)
    
    readChunk: =>
        stream = @stream
        littleEndian = @format.littleEndian
        chunkSize = Math.min(4096, stream.remainingBytes())
        samples = chunkSize / (@format.bitsPerChannel / 8) | 0
        if samples % @format.channelsPerFrame != 0
            floor = Math.floor(samples / @format.channelsPerFrame);
            samples = (floor + 1) * @format.channelsPerFrame;
        
        if chunkSize < @format.bitsPerChannel / 8
            return null
        
        if @format.floatingPoint
            switch @format.bitsPerChannel
                when 32
                    output = new Float32Array(samples)
                    for i in [0...samples] by 1
                        output[i] = stream.readFloat32(littleEndian)
                        
                when 64
                    output = new Float64Array(samples)
                    for i in [0...samples] by 1
                        output[i] = stream.readFloat64(littleEndian)
                        
                else
                    throw new Error 'Unsupported bit depth.'
            
        else
            switch @format.bitsPerChannel
                when 8
                    output = new Uint8Array(samples)
                    for i in [0...samples] by 1
                        output[i] = stream.readUInt8()
                
                when 16
                    output = new Int16Array(samples)
                    for i in [0...samples] by 1
                        output[i] = stream.readInt16(littleEndian)
                    
                when 24
                    output = new Int32Array(samples)
                    for i in [0...samples] by 1
                        output[i] = stream.readInt24(littleEndian)
                
                when 32
                    output = new Int32Array(samples)
                    for i in [0...samples] by 1
                        output[i] = stream.readInt32(littleEndian)
                    
                else
                    throw new Error 'Unsupported bit depth.'
        
        return output