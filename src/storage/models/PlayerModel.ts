'use strict'

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PlayerModel = new Schema({
  pid: String,
  status: String
});

export default PlayerModel;
