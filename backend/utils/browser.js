import browserless from 'browserless'

let instance = null

export function getBrowserless() {
  if (!instance) instance = browserless()
  return instance
}

export async function closeBrowserless() {
  if (instance) {
    await instance.close()
    instance = null
  }
}