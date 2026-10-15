// Independent Cloudflare deployment. Sites uses app/api/[...path]/route.ts instead.
import {handleApi,authorizeBearer} from './server/api.mjs';
export default {async fetch(request,env){return handleApi(request,env,authorizeBearer)}};
