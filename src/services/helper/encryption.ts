export let wasmReady = false;

export async function initWasm(): Promise<void> {
  if (wasmReady) return;

  const go = new (window as any).Go();
  const result = await WebAssembly.instantiateStreaming(fetch("/wasm/main.wasm"), go.importObject);
  go.run(result.instance);
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