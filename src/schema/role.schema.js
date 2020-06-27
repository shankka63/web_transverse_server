const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];


export const typeDef = `
    type Role {
        _id: ID!
        name: String
        workers: [Pirate]
    }
`;
