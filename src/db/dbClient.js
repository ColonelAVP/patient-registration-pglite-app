const worker = new Worker(new URL('./pgliteWorker.js', import.meta.url), {
    type: 'module',
  });
  
  let isReady = false;
  const callbacks = new Map();
  
  // Wait for worker to initialize PGlite
  worker.onmessage = (e) => {
    const { id, type, result, error, success } = e.data;
  
    if (type === 'ready') {
      console.log('✅ PGlite worker ready');
      isReady = true;
      return;
    }
  
    const cb = callbacks.get(id);
    if (!cb) return;
  
    if (error) cb.reject(error);
    else cb.resolve(result ?? success);
    callbacks.delete(id);
  };
  
  function waitForReady() {
    return new Promise((resolve) => {
      if (isReady) return resolve();
      const check = setInterval(() => {
        if (isReady) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });
  }
  
  function sendMessage(type, query, values) {
    const id = crypto.randomUUID();
    return new Promise(async (resolve, reject) => {
      await waitForReady();
      callbacks.set(id, { resolve, reject });
      worker.postMessage({ id, type, query, values });
    });
  }
  
  export async function execSQL(query, values = []) {
    return sendMessage('exec', query, values);
  }
  
  export async function querySQL(query, values = []) {
    return sendMessage('query', query, values);
  }
  