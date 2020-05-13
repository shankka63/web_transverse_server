import mongoose from 'mongoose';
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];
const Schema = mongoose.Schema;

const pirateSchema = new Schema({
    pseudo: String,
    password: String,
    crew: { type: Schema.Types.ObjectId, ref: 'Crew' },
}, {collection:'Pirate'});


export const Pirate = mongoose.model('Pirate', pirateSchema);