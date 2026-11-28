import { createError } from '@middy/util';

// Replaces the selected event field with validated data.
export const validate = (schema, property = 'body') => ({
    before: (handler) => {
        const result = schema.safeParse(handler.event[property] ?? {});

        if (!result.success) {
            const message = result.error.issues
                .map(({ path, message }) => (path.length ? `${path.join('.')}: ${message}` : message))
                .join('; ');
            throw createError(400, message);
        }

        handler.event[property] = result.data;
    }
});
