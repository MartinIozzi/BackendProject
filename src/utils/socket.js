import { Server } from 'socket.io';
import http from 'http'
import express from 'express'

const app = express();

export const server = http.createServer(app)
