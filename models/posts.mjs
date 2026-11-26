import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
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

export const getPostById = async (postId) => {
    const result = await db.send(new GetCommand({
        TableName: 'ShuiDB',
        Key: { PK: 'POST', SK: postId }
    }));
    return result.Item;
};

// shortcut: username filtering reads the shared posts index; add a username index when traffic warrants it.
export const getPosts = async (username) => {
    const posts = [];
    let lastKey;
    do {
        const result = await db.send(new QueryCommand({
            TableName: 'ShuiDB',
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'POST',
                ...(username === undefined ? {} : { ':username': username })
            },
            ...(username === undefined ? {} : {
                FilterExpression: '#username = :username',
                ExpressionAttributeNames: { '#username': 'username' }
            }),
            ScanIndexForward: false,
            ExclusiveStartKey: lastKey
        }));
        posts.push(...(result.Items ?? []));
        lastKey = result.LastEvaluatedKey;
    } while (lastKey);
    return posts;
};
