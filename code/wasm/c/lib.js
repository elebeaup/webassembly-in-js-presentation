const utf8Encoder = new TextEncoder('utf-8');
const utf8Decoder = new TextDecoder('utf-8');

class LibModule {
  async instantiate(log) {
    const importObject = {
      env: {
        log_value: (strPtr) => {
          log(this.readStringToMemory(strPtr)); 
        },
      },
    };

    const wasmModule = await WebAssembly.compileStreaming(fetch('./wasm/c/lib.wasm'));
    const instance = await WebAssembly.instantiate(wasmModule, importObject);
    const heap8 = new Uint8Array(instance.exports.memory.buffer);
    
    this.instance = instance;
    this.heap8 = heap8;

    return {
      readStringToMemory: this.readStringToMemory,
      writeStringToMemory: this.writeStringToMemory,
      add: instance.exports.add,
      reverse: instance.exports.reverse,
      print: instance.exports.print,
      malloc: instance.exports.malloc,
      free: instance.exports.free,
      heap8
    }
  }

  writeStringToMemory(str) {
    const { malloc, heap8 } = this;

    const encodedStr = utf8Encoder.encode(str);
    const strPtr = malloc(encodedStr.length + 1);
    heap8.set(encodedStr, strPtr);
    // NULL terminating
    heap8[strPtr + encodedStr.length] = 0;

    return strPtr;
  }

  readStringToMemory(strPtr) {
    const { heap8 } = this;

    if (!strPtr) throw new Error('address of string must be defined');
    let endPtr = strPtr;
    while (heap8[endPtr]) ++endPtr;

    return utf8Decoder.decode(heap8.subarray(strPtr, endPtr));
  }
}

export default new LibModule();
