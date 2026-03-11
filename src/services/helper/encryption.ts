let wasmReady = false;

export const isWasmReady = (): boolean => wasmReady;

export async function initWasm(): Promise<void> {
  if (wasmReady) return;

  const go = new (window as any).Go();
  const result = await WebAssembly.instantiateStreaming(fetch("/wasm/main.wasm"), go.importObject);
  go.run(result.instance);

  // Wait for Go WASM to register functions on window
  await new Promise<void>((resolve, reject) => {
    if (typeof (window as any).encryptAESPayload === 'function') {
      resolve();
      return;
    }
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 50;
      if (typeof (window as any).encryptAESPayload === 'function') {
        clearInterval(interval);
        resolve();
      } else if (elapsed >= 5000) {
        clearInterval(interval);
        reject(new Error('WASM functions not registered after 5s'));
      }
    }, 50);
  });

  wasmReady = true;
}

export function encryptAES(text: string): Promise<string> {
  if (!wasmReady) throw new Error("WASM not ready");
  return (window as any).encryptAESPayload(text);
}

export function decryptAES(cipherText: string): Promise<string> {
  if (!wasmReady) throw new Error("WASM not ready");
  return (window as any).decryptAESPayload(cipherText);
}