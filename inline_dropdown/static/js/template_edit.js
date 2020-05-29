
const problemTip = embedded_answersi18n.gettext('Beneath you have a list of words extracted from the square brackets []. You can add feedback message which will appear after giving the correct answer. You may also add Incorrect responses which will also be accepted (e.g. café cafe)');
const feedbackMessage = embedded_answersi18n.gettext('Feedback');
const addIncorrectResponseButtonName = embedded_answersi18n.gettext('Add incorrect option');
const IncorrectResponsesLabel = embedded_answersi18n.gettext('Incorrect options');
const taggedWordLabel = embedded_answersi18n.gettext('Correct option: ');
var questionBodyTemplate = `
<div>
    <br>
    <span class="tip setting-help">${problemTip}</span>
    <div class="inline-dropdown-question">
        <div class="inline-dropdown-question-header">
            <label>${taggedWordLabel} <strong></strong></label>
        </div>
        <div class="inline-dropdown-question-bottom">
            <label class="label setting-label">${feedbackMessage}</label>
            <input class="setting-input" type="text" value="">
        </div>
        <div class="inline-dropdown-question-header-secondary">
            <label>${IncorrectResponsesLabel}</label>
        </div>
        <div id="question-container">
        </div>
        <div class="inline-dropdown-question-button-container">
            <button class="button inline-dropdown-button-add-incorrect">${addIncorrectResponseButtonName}</button>
        </div>
    </div>
</div>`;

const deleteButtonLabel = embedded_answersi18n.gettext('Delete');
var questionIncorrectTemplate = `
<div class="inline-dropdown-question-bottom-secondary">
    <input class="label setting-label input_question_word" type="text" value="">
    <input class="setting-input input_hint" type="text" value="">
    <button type="button" class="inline-dropdown-button-delete">${deleteButtonLabel} <i class="fa fa-times" aria-hidden="true"></i></button>
</div>`;

var demandHintTemplate = `<div class="inline-dropdown-demandhints-bottom">
<input class="setting-input" type="text" value="">
<button type="button" class="inline-dropdown-button-delete">${deleteButtonLabel} <i class="fa fa-times" aria-hidden="true"></i></button></div>`;
