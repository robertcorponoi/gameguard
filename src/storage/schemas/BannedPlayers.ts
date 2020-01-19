'use strict'

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BannedPlayers = new Schema({
  pid: String,
});

export default BannedPlayers;
