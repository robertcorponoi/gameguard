'use strict'

/**
 * Generates various types of uuids to specifications.
 */
export default {
  /**
   * Generates a v4 compliant uuid.
   * 
   * This is derived from this post: https://stackoverflow.com/a/2117523/4274475
   * 
   * @returns {string} Returns a valid v4 uuid.
   */
  v4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
};