/** Class for utility functions */
export default class Util {
  /**
   * Find parent library instance.
   *
   * @param {string} libraryName Libary name.
   * @param {object} start Field.
   * @returns {object|null} Library instance.
   */
  static findParentLibrary(libraryName, start) {
    if (!start.parent) {
      return null;
    }

    if (
      typeof start.parent.currentLibrary === 'string' &&
      start.parent.currentLibrary.split(' ')[0] === `H5P.${libraryName}` &&
      Array.isArray(start.parent.children)
    ) {
      const found = start.parent.children.find((child) => {
        if (typeof child?.getMachineName !== 'function') {
          return false;
        }

        const machineName = child.getMachineName();
        return (typeof machineName === 'string' &&
          machineName.split('.')[1] === libraryName);
      });
      if (found) {
        return found;
      }
    }

    return Util.findParentLibrary(libraryName, start.parent);
  }
}
