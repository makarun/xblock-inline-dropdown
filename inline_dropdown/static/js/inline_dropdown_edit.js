/* Javascript for Embedded Dropdown XBlock. */
function InlineDropdownXBlockInitEdit(runtime, element, data) {
    const self = this;
    this.settings_fields = data.settings_fields;
    // init function, assigns the DOM elements to this.variables
    this.init = () => {
      this.initSelectors();
      this.initHeaderButtons();
      this.getTemplates();
      this.initEvents();
      this.getOriginalModalEditorHeight();
      this.changeModalEditorHeight(0.75);
      this.initXMLEditor();
      this.initViews();
    };

    this.initHeaderButtons = () => {
      const tempStringOne = inline_dropdowni18n.gettext('Editor');
      const tempStringTwo = inline_dropdowni18n.gettext('Settings');
      this.headerSelector.append(`<li class="action-item" data-mode="editor"><a href="#" class="editor-button is-set">${tempStringOne}</a></li>`);
      this.headerSelector.append(`<li class="action-item" data-mode="settings"><a href="#" class="settings-button">${tempStringTwo}</a></li>`);
      this.settingsButton = $('.settings-button');
      this.editorButton = $('.editor-button');
    };

    this.initSelectors = () => {
      this.xmlEditorTextarea = $('.block-xml-editor', element);
      this.defaultEditorSelector = $('[class*="view-"] .modal-window .editor-with-buttons.wrapper-comp-settings .list-input.settings-list');
      this.defaultModalContentSelector = $('[class*="view-"] .modal-content');
      this.defaultActionsSelector = $('[class*="view-"] .modal-window .editor-with-buttons .xblock-actions');
      this.defaultCodeMirrorSelector = $('[class*="view-"] .modal-window .CodeMirror');
      this.xmlContainerSelector = $('.inline-dropdown-xml', element);
      this.visualContainerSelector = $('.inline-dropdown-visual', element);
      this.bodySelector = $('html, body');
      this.questionInput = $('#question-textarea', element);
      this.xmlButton = $('.inline-dropdown-settings-toggle-xml', element);
      this.visualButton = $('.inline-dropdown-settings-toggle-visual', element);
      this.mainContainer = $('#problem-container', element);
      this.mainHintContainer = $('#demandhint-container', element);
      this.actionCancelButton = $('.action-cancel', element);
      this.actionSaveButton = $('.action-save', element);
      this.demandHintsContainer = $('.inline-dropdown-demandhints', element);
      this.headerSelector = $('.modal-header .editor-modes');
      this.editorContainer= $('.inline-dropdown-visual-editor');
      this.settingsContainer = $('.inline-dropdown-main-settings');
    };

    this.initViews = () => {
      this.settingsContainer.addClass('is-hidden');

      // this.editorContainer
    }

    this.getTemplates = () => {
      // this elements: questionBodyTemplate, questionIncorrectTemplate, demandHintTemplate are previously imported in inline_dropdown.py. there are assigns to this.variables
      this.questionBodyTemplate = inlineDropdownQuestionBodyTemplate;
      this.questionIncorrectTemplate = inlineDropdownQuestionIncorrectTemplate;
      this.demandHintTemplate = inlineDropdownDemandHintTemplate;
    };

    this.initEvents = () => {
      // events
      this.questionInput.on('input', this.resizeTextarea);
      this.xmlButton.click(this.xmlView);
      this.visualButton.click(this.visualView);

      this.mainContainer.on('input', '.inline-dropdown-question-bottom input', this.editMainFeedbackMessage);
      this.mainContainer.on('input', '.inline-dropdown-question-bottom-secondary .input_question_word', this.editIncorrectWord);
      this.mainContainer.on('input', '.inline-dropdown-question-bottom-secondary .input_hint', this.editIncorrectFeedbackMessage);
      this.mainContainer.on('click', '.inline-dropdown-button-delete', this.deleteIncorrect);
      this.mainContainer.on('click', '.inline-dropdown-button-add-incorrect', this.addIncorrect);

      //
      this.mainHintContainer.on('click', '.inline-dropdown-button-delete', this.deleteHint);
      this.demandHintsContainer.on('click', '.inline-dropdown-button-add-demandhint', this.addHint);
      this.demandHintsContainer.on('input', '.inline-dropdown-demandhints-bottom input', this.editHint);

      this.actionCancelButton.bind('click', this.onCancel);
      this.actionSaveButton.bind('click', this.onSubmit);

      this.settingsButton.bind('click', this.settingsView);
      this.editorButton.bind('click', this.editorView);
    };

    this.getOriginalModalEditorHeight = () => {
      // asign original size of modal window to variable
      this.originalModalContentHeight = this.defaultModalContentSelector.outerHeight();
      this.originalEditorHeight = this.defaultEditorSelector.outerHeight();
    };

    this.changeModalEditorHeight = (height) => {
      // changing height of modal window to 75 perecent of
      this.modalContentHeight = height; // 75 percent of browser height;
      this.defaultModalContentSelector.outerHeight($(window).height() * this.modalContentHeight);
      this.defaultEditorSelector.outerHeight(this.defaultModalContentSelector.height() - this.defaultActionsSelector.outerHeight(true) - 2);
      this.bodySelector.scrollTop($(document).height());
    };

    this.initXMLEditor = () => {
      this.xmlEditor = CodeMirror.fromTextArea(this.xmlEditorTextarea[0], {
        mode: 'xml',
        lineWrapping: true,
      });
      this.defaultCodeMirrorSelector.refresh();
      this.defaultCodeMirrorHeight = this.defaultCodeMirrorSelector.outerHeight();
      this.defaultCodeMirrorSelector.css({
        height: 'auto',
      });
      this.xmlContainerSelector.addClass('is-hidden');
    };

    this.resetView = () => {
      this.mainContainer.empty();
      this.mainHintContainer.empty();
    };

    this.renderView = () => {
      // get data from XML editor view and draw content of Visual Editor
      this.$xml = $($.parseXML(this.xmlEditor.getValue()));
      const copyXMLBody = this.$xml.find('body').children().clone();
      const feedbackMessage = {};
      const answerName = {};
      this.$xml.find('optionresponse optioninput').each((optionInputIndex, optionInput) => {
        answerName[$(optionInput).attr('id')] = [];
        feedbackMessage[$(optionInput).attr('id')] = [];
        $(optionInput).find('option').each((optionIndex, option) => {
          answerName[$(optionInput).attr('id')].push($(option).immediateText());
          feedbackMessage[$(optionInput).attr('id')].push($(option).children().text());
        });
      });

      copyXMLBody.find('input_ref').each((inputReferenceIndex, inputReference) => {
        const inputIndex = $(inputReference).attr('input');
        const bodyContainer = $.parseHTML($.trim(self.questionBodyTemplate));
        $(bodyContainer).attr('option_id', inputIndex);
        $(answerName[inputIndex]).each((answerNameIndex) => {
          if (answerNameIndex === 0) {
            $(inputReference).replaceWith(`[${answerName[inputIndex][answerNameIndex]}]`);
            $(bodyContainer).find('.inline-dropdown-question-header strong').text(answerName[inputIndex][answerNameIndex]);
            $(bodyContainer).find('.inline-dropdown-question-bottom input').val(feedbackMessage[inputIndex][answerNameIndex]);
          } else {
            const IncorrectContainer = $.parseHTML($.trim(self.questionIncorrectTemplate));
            $(IncorrectContainer).attr('optioninput', `${inputIndex}`);
            $(IncorrectContainer).find('.input_question_word').val(answerName[inputIndex][answerNameIndex]);
            $(IncorrectContainer).find('.input_hint').val(feedbackMessage[inputIndex][answerNameIndex]);
            $(bodyContainer).find('#question-container').append(IncorrectContainer);
          }
        });
        this.mainContainer.append(bodyContainer);
      });

      this.questionInput.val(copyXMLBody.text());

      this.$xml.find('demandhint hint').each((hintIndex, hint) => {
        const htmlDemandHint = $.parseHTML(self.demandHintTemplate);
        $(htmlDemandHint).find('input').val($(hint).text());
        $('#demandhint-container', element).append(htmlDemandHint);
      });
    };

    this.refreshView = () => {
      this.resetView();
      this.renderView();
    };

    this.textareaToXML = (rawText) => {
      // Regex function for finding elements with [] and variable without []
      const regexWithBrackets = /\[(.*?)\]/g;
      const regexMatches = this.removeSquareBrackets(rawText.match(regexWithBrackets));
      // Remove optionresponse from xml, when you removed from visual editor
      if (regexMatches === null) {
        self.$xml.find('optionresponse').remove();
      } else if (self.$xml.find('optionresponse').size() > regexMatches.length) {
        let iter;
        for (iter = 0; iter < self.$xml.find('optionresponse').size() - regexMatches.length; iter++) {
          self.$xml.find('optionresponse').last().remove();
        }
      }
      // Replace [variable] tags to <input_ref>
      let i = 0;
      rawText = rawText.replace(regexWithBrackets, () => {
        i++;
        return `<input_ref input="i${i}"/>`;
      });
      // Replace / add <optionresponse> elements in xml editor
      self.$xml.find('body p').html(rawText);
      self.$xml.find('input_ref').each((inputRefIndex, inputRef) => {
        const elementIndex = $(inputRef).attr('input');
        if (self.$xml.find(`optioninput#${elementIndex}`).length) {
          self.$xml.find(`optioninput#${elementIndex}`).find('option').first().html((id, currentContent) => {
            const regex = /\<optionhint\>(.*?)\<\/optionhint\>/g;
            const wordToChange = currentContent.replace(regex, '');
            return currentContent.replace(wordToChange, regexMatches[inputRefIndex]);
          });
        } else {
          const feedbackMessage = inline_dropdowni18n.gettext('A text which will appear after giving a correct response');
          const xmlTemplate = `<optionresponse><optioninput id="${elementIndex}"><option correct="True">${regexMatches[inputRefIndex]}<optionhint>${feedbackMessage}</optionhint></option></optioninput></optionresponse>`;
          if (self.$xml.find('optionresponse').length) {
            self.$xml.find('optionresponse').last().after(xmlTemplate);
          } else {
            self.$xml.find('body').last().after(xmlTemplate);
          }
        }
      });
      // Update xml editor
      self.updateXmlEditor(self.$xml.get(0));
    };

    this.prettifyXml = (sourceXml) => {
      const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
      const xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
      ].join('\n'), 'application/xml');

      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      const resultXml = new XMLSerializer().serializeToString(resultDoc);
      return resultXml;
    };

    this.restoreDefaultEditorHeight = () => {
      this.defaultEditorSelector.outerHeight(this.defaultEditorHeight);
      this.defaultModalContentSelector.outerHeight(this.defaultModalContentHeight);
      this.defaultCodeMirrorSelector.css({
        height: this.defaultCodeMirrorHeight,
      });
    };

    this.xmlView = () => {
      self.xmlContainerSelector.removeClass('is-hidden');
      self.visualContainerSelector.addClass('is-hidden');
      self.defaultCodeMirrorSelector.css({
        height: 'auto',
      });
      self.xmlEditor.refresh();
    };

    this.visualView = () => {
      self.visualContainerSelector.removeClass('is-hidden');
      self.xmlContainerSelector.addClass('is-hidden');
      self.defaultCodeMirrorSelector.css({
        height: self.defaultCodeMirrorHeight,
      });
      self.refreshView();
    };

    this.editorView = () => {
      this.settingsContainer.addClass('is-hidden');
      this.editorContainer.removeClass('is-hidden');
      this.changeModalEditorHeight(0.75);
    };

    this.settingsView = () => {
      this.settingsContainer.removeClass('is-hidden');
      this.editorContainer.addClass('is-hidden');
      this.changeModalEditorHeight(0.55);
    };

    this.getXmlString = (xmlData)=> {
      let xmlString;
      // IE
      if (window.ActiveXObject) {
        xmlString = xmlData.xml;
      } else { // code for Mozilla, Firefox, Opera, etc.
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
      }
      return xmlString.trim().replace(/(^[ \t]*\n)/gm, '');
    };

    this.updateXmlEditor = (data, refresh = true) => {
      // if browser is Chrome use XLS to prettifyXML.
      if (/Chrome/.test(navigator.userAgent)){
        this.xmlEditor.setValue(this.prettifyXml(this.getXmlString(data)));
      }
      else {
        this.xmlEditor.setValue(this.getXmlString(data));
      }
      if (refresh) {
        this.refreshView();
      }
    };

    this.resizeTextarea = function () {
      $(this).outerHeight('6em').outerHeight(this.scrollHeight); // 38 or '1em' -min-height
      self.textareaToXML(($(this).val()));
    };

    this.deleteIncorrect = function ()  {
      const elementIndex = $(this).parent().index();
      const optionInput = $(this).parent().attr('optioninput');
      self.$xml.find(`#${optionInput}`).children().eq(parseInt(elementIndex) + 1).remove();
      self.updateXmlEditor(self.$xml.get(0));
    };

    this.addIncorrect = function () {
      const elementId = $(this).parent().parent().parent()
        .attr('option_id');
      const tempStringOne = inline_dropdowni18n.gettext('Incorrect response');
      const tempStringTwo = inline_dropdowni18n.gettext('A text which will appear after giving a incorrect response');
      const xmlTemporaryTemplate = `<option correct="False">${tempStringOne}<optionhint>${tempStringTwo}</optionhint></option>`;
      self.$xml.find(`#${elementId}`).append(xmlTemporaryTemplate);
      self.updateXmlEditor(self.$xml.get(0));
    };

    this.editIncorrectWord = function () {
      const elementId = $(this).parent().parent().parent()
        .parent()
        .attr('option_id');
      const parentElementIndex = $(this).parent().index() + 1;
      const inputValue = $(this).val().trim();
      self.$xml.find(`optioninput#${elementId}`).find('option').eq(parentElementIndex).html((id, currentContent) => {
        const regex = /\<optionhint\>(.*?)\<\/optionhint\>/g;
        const wordToChange = currentContent.replace(regex, '');
        return currentContent.replace(wordToChange, inputValue);
      });
      self.updateXmlEditor(self.$xml.get(0), false);
    };

    this.editIncorrectFeedbackMessage = function () {
      const elementId = $(this).parent().parent().parent()
        .parent()
        .attr('option_id');
      const parentElementIndex = $(this).parent().index() + 1;
      self.$xml.find(`#${elementId}`).find('optionhint').eq(parentElementIndex).text($(this).val());
      self.updateXmlEditor(self.$xml.get(0), false);
    };

    this.editMainFeedbackMessage = function () {
      const elementId = $(this).parent().parent().parent()
        .attr('option_id');
      self.$xml.find(`#${elementId}`).find('optionhint').first().text($(this).val());
      self.updateXmlEditor(self.$xml.get(0), false);
    };

    this.deleteHint = function () {
      const elementIndex = $(this).parent().index();
      self.$xml.find('demandhint').children().eq(parseInt(elementIndex)).remove();
      self.updateXmlEditor(self.$xml.get(0));
    };

    this.addHint = function () {
      self.$xml.find('demandhint').append('<hint> </hint>');
      self.updateXmlEditor(self.$xml.get(0));
    };

    this.editHint = function () {
      const elementIndex = $(this).parent().index();
      self.$xml.find('demandhint').children().eq(parseInt(elementIndex)).text($(this).val());
      self.updateXmlEditor(self.$xml.get(0), false);
    };

    this.removeSquareBrackets = function(arrayElements){
      let result = []
      $(arrayElements).each(function(index,element){
        result.push(element.replace(/\[|\]/g,''));
      });
      return result;
    };

    this.onCancel = function () {
      self.restoreDefaultEditorHeight();
      runtime.notify('cancel', {});
    };

    this.onSubmit = function () {

      var data = {
        question_string: self.xmlEditor.getValue(),
      };
      for (i in self.settings_fields){
        data[self.settings_fields[i]]=$(`#inline_dropdown_edit_${self.settings_fields[i]}`).val();
      }

      runtime.notify('save', {
        state: 'start',
      });

      const handlerUrl = runtime.handlerUrl(element, 'studio_submit');
      $.post(handlerUrl, JSON.stringify(data)).done((response) => {
        if (response.result === 'success') {
          self.restoreDefaultEditorHeight();
          runtime.notify('save', {
            state: 'end',
          });
        } else {
          runtime.notify('error', {
            msg: response.message,
          });
        }
      });
    };

    // extended jquery function to refresh the previously defined tag
    $.fn.refresh = function () {
      const $elems = $(this.selector);
      this.splice(0, this.length);
      this.push.apply(this, $elems);
      return this;
    };
    // extended jquery function to get only text (divText) from div element  eq. <div> divText <p> pText <div/> <p/>
    $.fn.immediateText = function () {
      return this.contents().not(this.children()).text();
    };

    this.init();
    this.renderView();
  }
