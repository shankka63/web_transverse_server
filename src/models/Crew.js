import mongoose from 'mongoose';

const dummy = require('mongoose-dummy');
const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const Schema = mongoose.Schema;

const crewSchema = new Schema({
    name: String,
    creator: {type: Schema.Types.ObjectId, ref: 'Pirate'},
    roles: [{type: Schema.Types.ObjectId, ref: 'Role'}]
}, {collection: 'Crew'});


export const Crew = mongoose.model('Crew', crewSchema);