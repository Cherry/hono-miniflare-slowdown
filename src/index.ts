// src/index.ts
import {Hono} from 'hono'
import {etag} from 'hono/etag'
import {getAssetFromKV, NotFoundError} from '@cloudflare/kv-asset-handler';

import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const assetManifest = JSON.parse(manifestJSON);

async function assetMiddleware(context, next){
	try{
		const asset = await getAssetFromKV({
			request: context.req,
			waitUntil(promise){
				return context.executionCtx.waitUntil(promise);
			},
		}, {
			ASSET_NAMESPACE: context.env.__STATIC_CONTENT,
			ASSET_MANIFEST: assetManifest,
		});
		return asset;
	}catch(error){
		if(error instanceof NotFoundError){
			context.res = new Response('404', {status: 404});
			return;
		}
		if(context.env.NODE_ENV !== 'production'){
			throw error;
		}
		context.res = new Response('error', {status: 500});
	}
}


const app = new Hono()
app.use('*', etag());
app.get('/', (c) => c.text('Hello! Hono!'))

app.use('*', assetMiddleware);

export default app