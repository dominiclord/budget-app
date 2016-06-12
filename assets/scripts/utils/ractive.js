
/**
 * Catches Ractive Load errors
 * The setTimeout ensures the error doesn't get swallowed (this can be a problem with promises...)
 * @param  {Object} err
 */
function ractiveLoadCatch(err) {
    setTimeout(() => {
        throw err;
    });
}

export { ractiveLoadCatch };
