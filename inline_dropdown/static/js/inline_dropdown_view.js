/* Javascript for Embedded Answers XBlock. */
function InlineDropdownXBlockInitView(runtime, element) {
    const self = this;

    this.init = () => {
        this.initHandlersUrls();
        this.initSelectors();
        this.initAjaxRequests();
        this.initVariables();
        this.initEvents();
    }
    this.initHandlersUrls = () => {
        this.submitHandlerUrl = runtime.handlerUrl(element, 'student_submit');
        this.resetHandlerUrl = runtime.handlerUrl(element, 'student_reset');
        this.saveHandlerUrl = runtime.handlerUrl(element, 'save_state');
        this.getAnswerHandlerUrl = runtime.handlerUrl(element, 'get_answer');
        this.sendHintsHandlerUrl = runtime.handlerUrl(element, 'send_hints');
        this.senXblockIdHandlerUrl = runtime.handlerUrl(element, 'send_xblock_id');
        this.restoreStateHandlerUrl = runtime.handlerUrl(element, 'restore_state');
        this.publishEventHandlerUrl = runtime.handlerUrl(element, 'publish_event');
    }
    this.initSelectors = () => {
        this.$element = $(element);
        this.submitButton = this.$element.find('.submit');
        this.hintButton = this.$element.find('.hint_button');
        this.resetButton = this.$element.find('.reset_button');
        this.resetButtonContainer = this.resetButton.parent();
        this.saveButton = this.$element.find('.save');
        this.saveButtonContainer = this.saveButton.parent();
        this.showAnswerButton = this.$element.find('.show');
        this.showAnswerButtonContainer = this.showAnswerButton.parent();
        this.problemProgressContainer = this.$element.find('.problem-progress');
        this.questionPromptContainer = this.$element.find('.question_prompt');
        this.submissionFeedbackContainer = this.$element.find('.submission-feedback');

    }

    this.initAjaxRequests = () => {
        $.ajax({
            type: 'POST',
            url: this.sendHintsHandlerUrl,
            data: JSON.stringify({requested: true}),
            success: this.activateHintButton
        });

        $.ajax({
            type: 'POST',
            url: this.senXblockIdHandlerUrl,
            data: JSON.stringify({requested: true}),
            success: this.setXblockId
        });
    }

    this.initVariables = () => {
        this.hint;
        this.hints;
        this.hint_counter = 0;
        this.prompt = this.questionPromptContainer.html();;
        this.xblock_id = '';
    }

    this.initEvents = () => {
        this.submitButton.click(function(eventObject) {
            self.preSubmit();
            var responses = {};
            var responses_order = {};
            var complete = true;
            var counter = 1;
            $("select").each(function() {
                if (this.getAttribute('xblock_id') == self.xblock_id) {
                    if (this.value.length == 0) {
                        complete = false;
                        self.showNotification({ status: "error", msg: inline_dropdowni18n.gettext('You haven\'t completed the question.')});
                    }
                    responses[this.getAttribute('input')] = this.value;
                    responses_order[this.getAttribute('input')] = counter;
                    counter++;
                }
            });
            var data = {
                    responses: responses,
                    responses_order: responses_order,
                };
            if (complete) {
                $.ajax({
                    type: 'POST',
                    url: self.submitHandlerUrl,
                    data: JSON.stringify(data),
                    success: self.postSubmit
                });
            }
        });

        this.resetButton.click(function(eventObject) {
            var data = {};
            $.ajax({
                type: 'POST',
                url: self.resetHandlerUrl,
                data: JSON.stringify(data),
                success: self.postReset
            });
        });

        this.showAnswerButton.click(function(eventObject) {
            var data = {};
            $.ajax({
                type: 'POST',
                url: self.getAnswerHandlerUrl,
                data: JSON.stringify(data),
                success: self.showCorrectAnswer
            });
        });

        this.saveButton.click(function(eventObject) {
            var responses = {};
            var responses_order = {};
            var counter = 1;
            var complete = true;
            self.questionPromptContainer.find("select").each(function() {
                if (this.getAttribute('xblock_id') == self.xblock_id) {
                    if (this.value.length == 0) {
                        complete = false;
                        self.showNotification({ status: "error", msg: inline_dropdowni18n.gettext('You haven\'t completed the question.')});
                    }
                    responses[this.getAttribute('input')] = this.value;
                    responses_order[this.getAttribute('input')] = counter;
                    counter++;
                }
            });
            if (complete == true){
                var data = {
                        responses: responses,
                        responses_order: responses_order,
                    };
                $.ajax({
                    type: 'POST',
                    url: self.saveHandlerUrl,
                    data: JSON.stringify(data),
                    success: self.showNotification
                });
            }
        });

        this.hintButton.click(function(eventObject) {
            // this = self
            self.resetNotifications();
            hint = self.hints[self.hint_counter];
            self.showNotification({ status: "general", msg: hint});
            self.publishEvent({
                event_type:'hint_button',
                next_hint_index: self.hint_counter,
            });
            if (self.hint_counter == (self.hints.length - 1)) {
                self.hint_counter = 0;
            } else {
                self.hint_counter++;
            }
        });
    }

    this.publishEvent = (data) => {
      $.ajax({
          type: "POST",
          url: this.publishEventHandlerUrl,
          data: JSON.stringify(data)
      });
    }

    this.preSubmit = () => {
        this.problemProgressContainer.text(inline_dropdowni18n.gettext('(Loading...)'));
        if (this.prompt == '') {
            this.prompt = this.questionPromptContainer.html();
        }
    }

	this.postSubmit = (result) => {
        this.resetAllMessages()
        this.updateButtonsVisibility(result);
        this.problemProgressContainer.text(result.problem_progress);
        this.restoreSelections(result.submissions);
        this.showSubmitFeedback(result.submit_feedback);
        this.showNotification(result.submit_notification);
        this.addDecorations(result.correctness, result.selection_order);
	}

	this.postReset = (result) => {
        if (result.reset_notification){
            this.showNotification(result.reset_notification);
        } else {
        this.problemProgressContainer.text(result.problem_progress);
        this.showSubmitFeedback(result.submit_feedback);
        this.updateButtonsVisibility(result);
        this.resetAllMessages();
        }
    }

    this.showCorrectAnswer = (result) => {
        this.resetCorrectAnswers();
        if (!this.questionPromptContainer.find('span').length){
            var i = 1
            this.questionPromptContainer.find("select").each(function() {
                $('<span class="inline_dropdown feedback_number_correct correct_answer">(' + i + ')</span>').insertAfter(this);
                i += 1
            })
        }
        this.showNotification({status:'general' , msg:result.correct_answers});
	}

    this.showNotification = (result) => {
        this.resetNotifications();
        this.resetIcons();
        if (result.status==="general"){
            this.$element.find('.notification-submit .icon').addClass('fa-exclamation-circle');
        } else if (result.status==="success"){
            this.$element.find('.notification-submit .icon').addClass('fa-check')
        }
        else if (result.status==="warning") {
            this.$element.find('.notification-submit .icon').addClass('fa-exclamation-circle')
        }
        else {
            this.$element.find('.notification-submit .icon').addClass('fa-close')
        }
        this.$element.find('.notification-submit').removeClass('is-hidden').addClass(result.status);
        this.$element.find('.notification-submit .notification-message').html(result.msg);
	}

    this.showSubmitFeedback = (feedback) => {
        this.submissionFeedbackContainer.html(feedback);
        this.submissionFeedbackContainer.removeClass('is-hidden');
    }

	this.setXblockId = (result) => {
        this.xblock_id = result.xblock_id;
    	$.ajax({
            type: 'POST',
    	    url: this.restoreStateHandlerUrl,
        	data: JSON.stringify({requested: true}),
        	success: this.restoreState
    	});
	}

    this.restoreSelections = (selections) => {
        if (Object.keys(selections).length){
            this.questionPromptContainer.find("select").each(function() {
                if (this.getAttribute('xblock_id') == self.xblock_id) {
                    // reset the select value to what the student submitted
                    this.value = selections[this.getAttribute('input')];
                }
            });
        }
    }

	this.restoreState = (result) => {
        if (result.completed == true || result.saved) {
            this.restoreSelections(result.selections);
        }
		if (result.completed == true) {
            this.addDecorations(result.correctness, result.selection_order);
        }
    }

    this.resetAllMessages = () => {
        this.resetHint();
        this.resetNotifications();
        this.resetCorrectAnswers();
        this.resetPrompt();
    }

	this.addDecorations = (correctness, selection_order) => {
        if (Object.keys(correctness).length && Object.keys(selection_order).length){
            this.questionPromptContainer.find("select").each(function() {
                if (this.getAttribute('xblock_id') == self.xblock_id) {

                    var decoration_number = selection_order[this.getAttribute('input')];
                    if (decoration_number !== undefined){
                        // add new decoration to the select
                        if (correctness[this.getAttribute('input')] == 'True') {
                            $('<span class="inline_dropdown feedback_number_correct">(' + decoration_number + ')</span>').insertAfter(this);
                            $('<span class="fa fa-check status correct mx-1"/>').insertAfter(this);
                        } else {
                            $('<span class="inline_dropdown feedback_number_incorrect">(' + decoration_number + ')</span>').insertAfter(this);
                            $('<span class="fa fa-times status incorrect mx-1"/>').insertAfter(this);
                        }
                    }
                }
            });
        }
    }

    this.resetCorrectAnswers = () => {
        this.$element.find(".correct_answer").remove();
    }

    this.resetNotifications = () => {
        this.$element.find('.notification').removeClass('success error warning general').addClass('is-hidden');
    }

    this.resetIcons = () => {
        this.$element.find('.notification-submit .icon').removeClass('fa-exclamation-circle fa-check fa-close')
    }

    this.resetPrompt = () => {
        // reset the prompt to the original value to remove previous decorations
        this.questionPromptContainer.html(this.prompt);
	}

    this.resetHint = () => {
    	this.hint_counter = 0;
    }

    this.updateButtonsVisibility = (result) => {
        this.activateButton(this.resetButtonContainer, true, result.should_show_reset_button);
        this.activateButton(this.saveButtonContainer, true, result.should_show_save_button);
        this.activateButton(this.showAnswerButtonContainer, true, result.should_show_answer_button);
        this.activateButton(this.submitButton, result.should_enable_submit_button, true);
    }

    this.activateButton = (buttonSelector, isActive, isVisible) => {
        if (isActive) {
            buttonSelector.removeAttr("disabled");
        } else {
            buttonSelector.attr('disabled', 'disabled');
        }
        if (isVisible) {
            buttonSelector.removeClass('is-hidden');
        } else {
            buttonSelector.addClass('is-hidden');
        }
    }

    this.activateHintButton = (result) => {
		this.hints = result.hints;
		if (this.hints.length > 0) {
	        this.hintButton.removeClass('is-hidden');
    	}
    }
    this.init();
}


