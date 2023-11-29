//--npm modules
import express from 'express';
import cors from 'cors';
export const app = express();
import dotenv from 'dotenv';

dotenv.config();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import getDocuments from './getDocuments.js';
import signpdf from './signpdf.min.js';

app.get('/getdocuments', getDocuments);
app.post('/signpdf', signpdf);
