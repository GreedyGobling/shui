import { db } from './db.mjs'; 
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
import { createError } from '@middy/util'


export const addUser = async (user) => {
    const command = new PutCommand({
        TableName: 'ShuiDB',
        Item: {
            PK: 'USER',
            SK: user.username,
            ...user
        },
        ConditionExpression: 'attribute_not_exists(SK)'
    });
    
    try {
        await db.send(command);
        return user;
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') throw createError(409, 'Username already registered');
        console.error('Error adding user:', error);
        throw createError(500, 'Could not add user');
    }

}