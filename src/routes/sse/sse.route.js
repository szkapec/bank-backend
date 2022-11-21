import express from 'express';
import sse from '../sse'

const app = express();

app.get("/stream", sse.init);

module.exports = app;
