import { check } from "express-validator";

const newBookValidator = [
    check('title')
    .exists()
    .trim()
    .notEmpty()
    .withMessage(`Title input can't be empty`),
    check('author')
    .exists()
    .trim()
    .notEmpty()
    .withMessage(`Author input can't be empty`),
    check('genre')
    .exists()
    .trim()
    .notEmpty()
    .withMessage(`Genre input can't be empty`),
    check('publishDate')
    .exists()
    .trim()
    .isISO8601({format: 'YYYY-MM-DD'})
    .withMessage(`Invalid date input`)
];

const updateBookValidator = [
    check('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Title input can't be empty`),
    check('author')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Author input can't be empty`),
    check('genre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Genre input can't be empty`),
    check('publishDate')
    .optional()
    .trim()
    .isISO8601({format: 'YYYY-MM-DD'})
    .withMessage(`Invalid date input`)
];

export {
    newBookValidator,
    updateBookValidator,
};