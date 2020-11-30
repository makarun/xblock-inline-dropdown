
const inlineDropdownProblemTip = inline_dropdowni18n.gettext('Beneath you have a list of words extracted from the square brackets []. You can add feedback message which will appear after giving the correct response. You should also add Incorrect responses.');
const inlineDropdownFeedbackMessage = inline_dropdowni18n.gettext('Feedback');
const inlineDropdownAddIncorrectResponseButtonName = inline_dropdowni18n.gettext('Add incorrect option');
const inlineDropdownIncorrectResponsesLabel = inline_dropdowni18n.gettext('Incorrect options');
const inlineDropdownTaggedWordLabel = inline_dropdowni18n.gettext('Correct option: ');
const inlineDropdownDeleteButtonLabel = inline_dropdowni18n.gettext('Delete');
var inlineDropdownQuestionBodyTemplate = `
<div>
    <br>
    <span class="tip setting-help">${inlineDropdownProblemTip}</span>
    <div class="inline-dropdown-question">
        <div class="inline-dropdown-question-header">
            <label>${inlineDropdownTaggedWordLabel} <strong></strong></label>
        </div>
        <div class="inline-dropdown-question-bottom">
            <label class="label setting-label">${inlineDropdownFeedbackMessage}</label>
            <input class="setting-input" type="text" value="">
        </div>
        <div class="inline-dropdown-question-header-secondary">
            <label>${inlineDropdownIncorrectResponsesLabel}</label>
        </div>
        <div id="question-container">
        </div>
        <div class="inline-dropdown-question-button-container">
            <button class="button inline-dropdown-button-add-incorrect">${inlineDropdownAddIncorrectResponseButtonName}</button>
        </div>
    </div>
</div>`;

var inlineDropdownQuestionIncorrectTemplate = `
<div class="inline-dropdown-question-bottom-secondary">
    <input class="label setting-label input_question_word" type="text" value="">
    <input class="setting-input input_hint" type="text" value="">
    <button type="button" class="inline-dropdown-button-delete">${inlineDropdownDeleteButtonLabel} <i class="fa fa-times" aria-hidden="true"></i></button>
</div>`;

var inlineDropdownDemandHintTemplate = `<div class="inline-dropdown-demandhints-bottom">
<input class="setting-input" type="text" value="">
<button type="button" class="inline-dropdown-button-delete">${inlineDropdownDeleteButtonLabel} <i class="fa fa-times" aria-hidden="true"></i></button></div>`;
