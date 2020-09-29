import express from 'express';

export function logParams(req: express.Request, res: express.Response): void {
  const { originalUrl,  params, query } = req;

  console.log('originalUrl', originalUrl);
  console.log('params', params);
  console.log('query', query);
}