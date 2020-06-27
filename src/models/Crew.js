import mongoose from 'mongoose';
import {Pirate} from "./Pirate";
import {Role} from "./Role";

const dummy = require('mongoose-dummy');
const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const Schema = mongoose.Schema;

const crewSchema = new Schema({
    name: String,
    score: Number,
    creator: {type: Schema.Types.ObjectId, ref: 'Pirate'},
    roles: [{type: Schema.Types.ObjectId, ref: 'Role'}]
}, {collection: 'Crew'});

crewSchema.pre('remove', function (next) {

    Pirate.updateMany({crew: this._id}, {"$unset":{crew: 1}}).exec();
    Role.deleteMany({
        _id: {
            $in: this.roles
        }
    }).exec();
    next();
});


export const Crew = mongoose.model('Crew', crewSchema);