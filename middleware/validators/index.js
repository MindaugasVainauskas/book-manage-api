import {
    newBookValidator,
    updateBookValidator,
} from "./bookValidator.js";

/**
 * Reasoning for this is that this way new validators can be added and only single import will be needed in importing file.
 */
export {
    newBookValidator as validateBookAdd,
    updateBookValidator as validateBookUpdate
};