export async function withRetry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (err) {
        console.error(`Attempt ${i + 1} failed: ${err.message}`);
      }
    }
    throw new Error(`Failed after ${maxRetries} attempts`);
}