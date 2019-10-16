'use strict'

import GameGuardClient from './gameguardclient.js';

const gg = new GameGuardClient();

gg.on('open', (ev) => console.log(ev));

gg.on('message', (ev) => console.log(ev));

gg.on('close', (ev) => console.log(ev));