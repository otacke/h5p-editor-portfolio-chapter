import Dictionary from '@services/dictionary';
import Util from '@services/util';
import H5PLibrary from '@root/library.json';

/** Class Portfolio chapter */
export default class PortfolioChapter {

  /**
   * @class
   * @param {object} parent Parent element in semantics.
   * @param {object} field Semantics field properties.
   * @param {object} params Parameters entered in editor form.
   * @param {function} setValue Callback to set parameters.
   */
  constructor(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;

    // Fill dictionary
    this.dictionary = new Dictionary();
    this.dictionary.fill({
      l10n: {
        chapterTitle: H5PEditor.t('H5PEditor.PortfolioChapter', 'chapterTitle')
      }
    });

    // Callbacks to call when parameters change
    this.changes = [];

    // Let parent handle ready callbacks of children
    this.passReadies = true;

    // DOM
    this.$container = H5P.jQuery('<div>', {
      class: 'h5peditor-portfolio-chapter'
    });

    // Instantiate original field (or create your own and call setValue)
    this.fieldInstance = new H5PEditor.widgets[this.field.type](this.parent, this.field, this.params, this.setValue);
    this.fieldInstance.appendTo(this.$container);

    // Keep track of placeholders that have been instantiated
    this.placeholdersDone = [];
    this.placeholdersPending = this.params?.contents?.length;

    // Relay changes
    if (this.fieldInstance.changes) {
      this.fieldInstance.changes.push(() => {
        this.handleFieldChange();
      });
    }

    // Errors (or add your own)
    this.$errors = this.$container.find('.h5p-errors');

    // Find main portfolio editor instance
    this.mainEditor = Util.findParentLibrary('Portfolio', this);

    this.parent.ready(() => {
      this.passReadies = false;

      this.overrideH5PCoreTitleField();
    });
  }

  /**
   * Append field to wrapper. Invoked by H5P core.
   * @param {H5P.jQuery} $wrapper Wrapper.
   */
  appendTo($wrapper) {
    this.$container.appendTo($wrapper);
  }

  /**
   * Validate current values. Invoked by H5P core.
   * @returns {boolean} True, if current value is valid, else false.
   */
  validate() {
    return this.fieldInstance.validate();
  }

  /**
   * Remove self. Invoked by H5P core.
   */
  remove() {
    this.$container.remove();
  }

  /**
   * Override H5P Core title field.
   */
  overrideH5PCoreTitleField() {
    const editorContainer = this.$container.get(0)
      .closest('.h5p-portfoliochapter-editor');

    if (editorContainer) {
      const titleField = editorContainer
        .querySelector('.field-name-extraTitle .h5peditor-label');

      if (titleField) {
        titleField.innerHTML = this.dictionary.get('l10n.chapterTitle');
      }

      const titleInput = editorContainer
        .querySelector('.field-name-extraTitle .h5peditor-text');

      if (titleInput) {
        titleInput.addEventListener('keydown', (event) => {
          if (event.code === 'Enter') {
            titleInput.dispatchEvent(new CustomEvent('change'));
          }
        });
      }
    }
  }

  /**
   * Handle change of field.
   */
  handleFieldChange() {
    this.params = this.fieldInstance.params;
    this.changes.forEach((change) => {
      change(this.params);
    });
  }

  /**
   * Handle placeholder done instantiating.
   * @param {string} id Subcontent id.
   */
  handlePlaceholderDone(id) {
    if (!this.placeholdersDone.includes(id)) {
      this.placeholdersDone.push(id);

      this.placeholdersPending--;
      if (this.placeholdersPending === 0 && this.mainEditor) {
        this.mainEditor.handleChapterDone(this.parent.params.subContentId);
      }
    }
  }

  /**
   * Get machineName.
   * @returns {string} Machine name.
   */
  getMachineName() {
    return H5PLibrary.machineName;
  }
}
