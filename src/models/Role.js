import mongoose from 'mongoose';
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];
const Schema = mongoose.Schema;

const crewSchema = new Schema({
    name: String,
    workers: [{type: Schema.Types.ObjectId, ref: 'Pirate'}]
}, {collection:'Role'});


export const Role = mongoose.model('Role', crewSchema);