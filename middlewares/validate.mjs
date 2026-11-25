import { createError } from '@middy/util';

// Replaces event.body with the parsed value, so handlers only ever see valid data.
export const validate = (schema) => ({
    before: (handler) => {
        const result = schema.safeParse(handler.event.body ?? {});

        if (!result.success) {
            const message = result.error.issues
            throw createError(400, message);
        }

        handler.event.body = result.data;
    }
});
