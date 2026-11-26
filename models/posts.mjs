import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { createError } from '@middy/util';
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

const sendPostWrite = async (command) => {
    try {
        return await db.send(command);
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(error.Item ? 403 : 404, error.Item ? 'Forbidden' : 'Post not found');
        }
        throw error;
    }
};

export const updatePostById = async (postId, username, { title, content, updatedAt }) => {
    const result = await sendPostWrite(new UpdateCommand({
        TableName: 'ShuiDB',
        Key: { PK: 'POST', SK: postId },
        UpdateExpression: 'SET #title = :title, #content = :content, updatedAt = :updatedAt',
        ConditionExpression: 'attribute_exists(SK) AND #username = :username AND isGuest = :isGuest',
        ExpressionAttributeNames: { '#username': 'username', '#title': 'title', '#content': 'content' },
        ExpressionAttributeValues: {
            ':username': username, ':isGuest': false,
            ':title': title, ':content': content, ':updatedAt': updatedAt
        },
        ReturnValues: 'ALL_NEW',
        ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
    }));
    return result.Attributes;
};

export const deletePostById = (postId, username) => sendPostWrite(new DeleteCommand({
    TableName: 'ShuiDB',
    Key: { PK: 'POST', SK: postId },
    ConditionExpression: 'attribute_exists(SK) AND #username = :username AND isGuest = :isGuest',
    ExpressionAttributeNames: { '#username': 'username' },
    ExpressionAttributeValues: { ':username': username, ':isGuest': false },
    ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
}));
