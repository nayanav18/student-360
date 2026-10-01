import express from 'express';
import path from 'path';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import { PubSub } from '@google-cloud/pubsub';
import { BigQuery } from '@google-cloud/bigquery';
import crypto from 'crypto';

dotenv.config();

const FAST_API_URL = process.env.FAST_API_URL;
const PORT = process.env.PORT || 8080;
const PUBLIC_URL = process.env.PUBLIC_URL || '/';
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'vf-grp-aib-prd-mc2-sai-lab';
const TOPIC_NAME = process.env.PUBSUB_TOPIC || 'vf-grp-aib-prd-mc2-sai-lab-topic';
const TABLE_ID = process.env.BQ_TABLE_ID || 'vf-grp-datahub.vfgrp_dh_lake_iot_sales_agent_lab_s.leads';
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

// Strict normalization: ensure it starts with / and has NO trailing slash for mounting
const baseRoute = '/' + PUBLIC_URL.replace(/^\/+|\/+$/g, '');
const DIST_DIR = path.join(import.meta.dirname, 'dist');

const app = express();
const pubsub = new PubSub({ projectId: PROJECT_ID });
const bigquery = new BigQuery({ projectId: PROJECT_ID, location: 'europe-west1' });

// Production-only settings
if (isProd) {
  app.set('trust proxy', 1);
  console.log('--- Production Mode Activated ---');
}

console.log(`DIST_DIR: ${DIST_DIR}`);
console.log(`baseRoute: ${baseRoute}`);
console.log(`FAST_API_URL: ${FAST_API_URL}`);

// Basic security and setup
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Proxying Logic
const apiRouter = express.Router();
apiRouter.get('/health', (req, res) => res.json({ status: 'ok', environment: NODE_ENV }));

const auth = isProd ? new GoogleAuth() : null;

const proxyToFastAPI = (targetPath) => async (req, res) => {
  try {
    let headers = { 'Content-Type': 'application/json' };

    if (isProd && auth) {
      try {
        const client = await auth.getIdTokenClient(FAST_API_URL);
        const authHeaders = await client.getRequestHeaders();
        const identityToken = authHeaders.authorization || authHeaders.get?.('authorization');
        headers['X-Serverless-Authorization'] = identityToken;
      } catch (authErr) {
        console.warn('Identity Token fetch failed, proceeding without it:', authErr.message);
      }
    }

    const response = await fetch(`${FAST_API_URL}${targetPath}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Proxy Error (${targetPath}):`, error);
    res.status(500).json({ error: 'Backend unreachable' });
  }
};

apiRouter.post('/url-extractor', proxyToFastAPI('/url-extractor'));
apiRouter.post('/lookalikes', proxyToFastAPI('/generate-leads'));
apiRouter.post('/filter-leads', proxyToFastAPI('/filter-leads'));

// Pub/Sub Enrichment Logic
apiRouter.post('/start-enrichment', async (req, res) => {
  try {
    const { names, config = {} } = req.body;
    if (!names || !Array.isArray(names)) {
      return res.status(400).json({ error: 'Invalid names list' });
    }

    const jobId = crypto.randomUUID();
    console.log(`Starting Enrichment Job ${jobId} for ${names.length} leads`);

    const topic = pubsub.topic(TOPIC_NAME);
    const publishPromises = names.map(name => {
      const data = {
        job_id: jobId,
        lead: { name },
        config: config
      };
      return topic.publishMessage({ json: data });
    });

    await Promise.all(publishPromises);
    res.json({ job_id: jobId, status: 'started', total: names.length });
  } catch (error) {
    console.error('Error starting enrichment:', error);
    res.status(500).json({ error: 'Failed to start enrichment job' });
  }
});

apiRouter.get('/enrichment-status/:job_id', async (req, res) => {
  try {
    const { job_id } = req.params;
    console.log(`Checking status for Job ID: ${job_id}`);

    const query = `
      SELECT lead_name, data
      FROM \`${TABLE_ID}\`
      WHERE job_id = @jobId
    `;
    const options = {
      query: query,
      params: { jobId: job_id },
      location: 'europe-west1'
    };

    const [rows] = await bigquery.query(options);
    
    // Parse the JSON data from BQ
    const leads = rows.map(row => {
      let leadData = null;
      try {
        leadData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      } catch (e) {
        console.error('Failed to parse lead data for:', row.lead_name);
      }
      return {
        name: row.lead_name,
        data: leadData
      };
    });
    
    res.json({
      job_id,
      count: leads.length,
      leads: leads
    });
  } catch (error) {
    console.error('Error fetching enrichment status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// Mount API
app.use(`${baseRoute}/api`, apiRouter);
app.use('/api', apiRouter);

// 1. Static Assets
const staticMiddleware = express.static(DIST_DIR, {
  immutable: true,
  maxAge: '1y',
  fallthrough: true
});

app.use(baseRoute, staticMiddleware);
app.use('/', staticMiddleware);

// 2. Explicit Trailing Slash Redirect (Prod logic)
if (isProd && baseRoute !== '' && baseRoute !== '/') {
  app.get(baseRoute, (req, res) => {
    res.redirect(301, baseRoute + '/');
  });
}

// 3. Brute-Force SPA Routes (Deep Linking Fix)
const knownRoutes = ['Overview', 'Discovery', 'Leads', 'Settings', 'Analysis', 'configuration', 'accounts', 'overview', 'discovery', 'leads'];
knownRoutes.forEach(route => {
  const handler = (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html'));
  app.get(`${baseRoute}/${route}`, handler);
  app.get(`/${route}`, handler);
});

// 4. Absolute SPA Fallback
app.get(/(.*)/, (req, res, next) => {
  const isFileRequest = path.extname(req.url) !== '';
  if (isFileRequest) {
    return res.status(404).send('Asset not found');
  }
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} [${NODE_ENV}]`);
});
 
