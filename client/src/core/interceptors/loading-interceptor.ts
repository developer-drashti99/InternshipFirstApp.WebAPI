import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service.service';
import { delay, finalize, of, tap } from 'rxjs';
// adding caching
const cache = new Map<string, HttpEvent<unknown>>();//HttpEvent<unknown> is type of response
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey=(url:string,params:HttpParams):string=>{
    // for caching filters like min age, max age..... 
    const paramString=params.keys().map(key=>`${params.get(key)}`)
    .join('&');
    return paramString ? `${url}?${paramString}`:url;
  };

  const invalidateCache=(urlPattern:string)=>{
    for(const key of cache.keys()){
      if(key.includes(urlPattern)){
        cache.delete(key);
        console.log(key);
      }
    }
  }

  const cacheKey=generateCacheKey(req.url,req.params);

  if(req.method.includes('POST') && req.url.includes('/likes')){
    invalidateCache('/likes');
  }
  if(req.method.includes('GET') && req.url.includes('/profile')){
    invalidateCache('/profile');
  }

  if (req.method === 'GET') {
    // const cachedResponse = cache.get(req.url);
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response=>{
      // cache.set(req.url,response)
      cache.set(cacheKey,response)
    }),
    finalize(() => {
      busyService.idle()
    })
  );
};
