import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';

class UnsplashService {
  private unsplash: ReturnType<typeof createApi>;
  constructor() {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY as string;
    this.unsplash = createApi({
      accessKey,
      fetch: nodeFetch.default as unknown as typeof fetch,
    });
  }

  get unsplashInstance() {
    return this.unsplash;
  }
}

export default new UnsplashService();
