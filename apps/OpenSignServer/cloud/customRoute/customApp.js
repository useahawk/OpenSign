//--npm modules
import express from 'express';
import cors from 'cors';
export const app = express();
import dotenv from 'dotenv';
dotenv.config();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
import uploadFile from './uploadFile.js';
// import getDocuments from './v1/getDocuments.js';
// import signpdf from './v1/signpdf.min.js';
app.post('/file_upload', uploadFile);
// app.get('/getdocuments', getDocuments);
// app.post('/signpdf', signpdf);
