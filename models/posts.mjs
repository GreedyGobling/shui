import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../services/db.mjs';

export const addPost = (post) => db.send(new PutCommand({
    TableName: 'ShuiDB',
    Item: {
        PK: 'POST',
        SK: post.id,
        GSI1PK: 'POST',
        GSI1SK: `${post.createdAt}#${post.id}`,
        ...post
    },
    ConditionExpression: 'attribute_not_exists(SK)'
}));
