"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { EventEmitter } = require('node:events');
module.exports = () => {
    return new EventEmitter();
};
