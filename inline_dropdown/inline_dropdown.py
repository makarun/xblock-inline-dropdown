'''  Inline Dropdown XBlock main Python class'''

import pkg_resources
from django.template import Context, Template
from django.utils import translation
from collections import OrderedDict
import datetime
from pytz import utc
import random

from xblock.core import XBlock
from xblock.fields import Scope, String, Dict
from web_fragments.fragment import Fragment
from xblockutils.resources import ResourceLoader
from .utils.extensions import XBlockCapaMixin

from lxml import etree
from xml.etree import ElementTree as ET
from xml.etree.ElementTree import Element, SubElement
from StringIO import StringIO

_ = lambda text: text
loader = ResourceLoader(__name__)

@XBlock.needs('i18n')
class InlineDropdownXBlock(XBlockCapaMixin):
    '''
    Icon of the XBlock. Values : [other (default), video, problem]
    '''
    icon_class = 'problem'

    '''
    Fields
    '''
    display_name = String(
        display_name=_('Display Name'),
        default=_('Inline Dropdown'),
        scope=Scope.settings,
        help=_('This name appears in the horizontal navigation at the top of the page')
    )

    question_string = String(
        help=_('Default question content '),
        scope=Scope.content,
        default=_('''
            <inline_dropdown schema_version='1'>
                <body>
                    <p>A fruit is the fertilized ovary of a tree or plant and contains seeds. Given this, a <input_ref input="i1"/> is consider a fruit, while a <input_ref input="i2"/> is considered a vegetable.</p>
                </body>
                <optionresponse>
                    <optioninput id="i1">
                        <option correct="True">tomato<optionhint>Since the tomato is the fertilized ovary of a tomato plant and contains seeds, it is a fruit.</optionhint></option>
                        <option correct="False">potato<optionhint>A potato is an edible part of a plant in tuber form and is a vegetable, not a fruit.</optionhint></option>
                    </optioninput>
                </optionresponse>
                <optionresponse>
                    <optioninput id="i2">
                        <option correct="True">onion<optionhint>The onion is the bulb of the onion plant and contains no seeds and is therefore a vegetable.</optionhint></option>
                        <option correct="False">cucumber<optionhint>Many people mistakenly think a cucumber is a vegetable. However, because a cucumber is the fertilized ovary of a cucumber plant and contains seeds, it is a fruit.</optionhint></option>
                    </optioninput>
                </optionresponse>
                <demandhint>
                    <hint>A fruit is the fertilized ovary from a flower.</hint>
                    <hint>A fruit contains seeds of the plant.</hint>
                </demandhint>
            </inline_dropdown>
        '''),
        # default=textwrap.dedent(str(default_question))
    )

    selection_order = Dict(
        help=_('Order of selections in body'),
        scope=Scope.user_state,
        default={},
    )

    selections = Dict(
        help=_('Saved student input values'),
        scope=Scope.user_state,
        default={},
    )
    has_score = True
    skip_flag = False
    '''
    Main functions
    '''
    def student_view(self, context=None):
        '''
        The primary view of the XBlock, shown to students
        when viewing courses.
        '''
        self.init_emulation()
        frag = Fragment()
        attributes = ''

        ctx = {
            'element_id': self.location.html_id(),
            'display_name': self.display_name,
            'problem_progress': self._get_problem_progress(),
            'prompt': self._get_body(self.question_string),
            'attributes': attributes,
            'should_show_reset_button': self.should_show_reset_button(),
            'should_enable_submit_button': self.should_enable_submit_button(),
            'submit_feedback': self.submit_feedback_msg(),
            'should_show_answer_button': self.should_show_answer_button(),
            'should_show_save_button': self.should_show_save_button(),
            'should_show_hint_button': self.should_show_hint_button(),
        }

        frag.add_content(loader.render_django_template(
            'static/html/inline_dropdown_view.html',
            context = ctx,
            i18n_service=self.runtime.service(self, "i18n"),
        ))

        frag.add_css(loader.load_unicode('static/css/inline_dropdown.css'))
        frag.add_javascript(loader.load_unicode('static/js/inline_dropdown_view.js'))
        frag.add_javascript(self.get_translation_content())
        frag.initialize_js('InlineDropdownXBlockInitView')
        return frag

    def studio_view(self, context=None):
        '''
        The secondary view of the XBlock, shown to teachers
        when editing the XBlock.
        '''
        self.init_emulation()
        frag = Fragment()
        settings_ctx = dict()
        settings_fields = ['display_name', 'weight', 'show_reset_button', 'max_attempts', 'showanswer', 'submission_wait_seconds']
        settings_fields_enum =  {key: i for i, key in enumerate(settings_fields)}
        for key, value in self.fields.items():
            if key in settings_fields:
                value.value = getattr(self,key)
                settings_ctx.update({key:value})
        settings_ctx = OrderedDict(sorted(settings_ctx.items(), key=lambda d: settings_fields_enum[d[0]]))
        ctx = {
            'display_name': self.display_name,
            'settings': settings_ctx,
            'weight': self.weight,
            'xml_data': self.question_string,
        }
        frag.add_content(loader.render_django_template(
            'static/html/inline_dropdown_edit.html',
            context = ctx,
            i18n_service=self.runtime.service(self, "i18n"),
        ))
        frag.add_css(loader.load_unicode('static/css/inline_dropdown_edit.css'))
        # frag.add_javascript(self.get_translation_content())
        frag.add_javascript(loader.load_unicode('static/js/template_edit.js'))
        frag.add_javascript(loader.load_unicode('static/js/inline_dropdown_edit.js'))
        frag.initialize_js('InlineDropdownXBlockInitEdit', {'settings_fields': settings_fields})
        return frag



    @XBlock.json_handler
    def student_submit(self, submissions, suffix=''):
        '''
        Save student answer
        '''

        _ = self.runtime.service(self, "i18n").ugettext
        current_time = datetime.datetime.now(utc)
        # Wait time between resets: check if is too soon for submission.

        if self.closed():
            msg = _(u'Problem closed')
            return self.submit_feeedback(status=False, extra_element={'submit_notification' : {'status':'error','msg':msg}})

        if self.last_submission_time is not None and self.submission_wait_seconds != 0:
            seconds_since_submission = (current_time - self.last_submission_time).total_seconds()
            if seconds_since_submission < self.submission_wait_seconds:
                remaining_secs = int(self.submission_wait_seconds - seconds_since_submission)
                msg = _(u'You must wait at least {wait_secs} between submissions. {remaining_secs} remaining.').format(
                    wait_secs=self.pretty_print_seconds(self.submission_wait_seconds),
                    remaining_secs=self.pretty_print_seconds(remaining_secs))
                return self.submit_feeedback(status=False, extra_element={'submit_notification' : {'status':'error','msg':msg}})


        self.selections = submissions['responses']
        self.selection_order = submissions['responses_order']

        self.current_feedback = '<br>'

        correct_count = 0
        i18n_ = self.runtime.service(self, "i18n").ugettext
        # use sorted selection_order to iterate through selections dict
        for key,pos in sorted(self.selection_order.iteritems(), key=lambda (k,v): (v,k)):
            selected_text = self.selections[key]

            if self.correctness[key][selected_text] == 'True':
                default_feedback = ''
                if selected_text in self.feedback[key]:
                    if self.feedback[key][selected_text] is not None:
                        self.current_feedback += '<small><i>(' + str(pos) + ') ' + self.feedback[key][selected_text] + '</i></small><br>'
                    else:
                        self.current_feedback += default_feedback
                else:
                    self.current_feedback += default_feedback
                self.student_correctness[key] = 'True'
                correct_count += 1
            else:
                default_feedback = ''
                if selected_text in self.feedback[key]:
                    if self.feedback[key][selected_text] is not None:
                        self.current_feedback += '<small><i>(' + str(pos) + ') ' + self.feedback[key][selected_text] + '</i></small><br>'
                    else:
                        self.current_feedback += default_feedback
                else:
                    self.current_feedback += default_feedback
                self.student_correctness[key] = 'False'
        self.current_feedback = self.current_feedback[:-2]
        self.score = float(self.weight) * correct_count / len(self.correctness)
        self.attempts = self.attempts + 1
        self.set_last_submission_time()
        self._publish_grade()

        self.runtime.publish(self, 'dropdown_selected', {
            'selections': self.selections,
            'correctness': self.student_correctness,
        })
        self._publish_problem_check()

        self.completed = True

        result = self.submit_feeedback(status=True, extra_element={'submit_notification': self._get_answer_notification()})
        return result

    @XBlock.json_handler
    def student_reset(self, submissions, suffix=''):
        '''
        Reset student answer
        '''
        _ = self.runtime.service(self, "i18n").ugettext

        if not self.should_show_reset_button():
            result = {
            'status': False,
            'problem_progress': self._get_problem_progress(),
            'submit_feedback': self.submit_feedback_msg(),
            'should_enable_submit_button': self.should_enable_submit_button(),
            'should_show_answer_button': self.should_show_answer_button(),
            'should_show_save_button': self.should_show_save_button(),
            'reset_notification' : {'status':'error','msg':_("You cannot select Reset for a problem that is closed.")}
            }
            return result

        self.selections = {}
        self.student_correctness = {}
        self.has_saved_answers = False

        result = {
            'success': True,
            'problem_progress': self._get_problem_progress(),
            'submit_feedback': self.submit_feedback_msg(),
            'should_enable_submit_button': self.should_enable_submit_button(),
            'should_show_answer_button': self.should_show_answer_button(),
            'should_show_save_button': self.should_show_save_button(),
        }
        return result

    @XBlock.json_handler
    def studio_submit(self, submissions, suffix=''):
        '''
        Save studio edits
        '''
        for key, value in submissions.items():
            if key=='question_string':
                try:
                    etree.parse(StringIO(value))
                    setattr(self, key, value)
                except etree.XMLSyntaxError as e:
                    return {
                        'result': 'error',
                        'message': e.message
                    }
            elif key in ['weight',]:
                try:
                    setattr(self, key, int(value))
                except ValueError:
                    setattr(self, key, 0)
            elif key in ['max_attempts']:
                try:
                    setattr(self, key, int(value))
                except ValueError:
                    if isinstance(value, unicode):
                        setattr(self, key, value)
            else:
                setattr(self, key, value)

        return {
            'result': 'success',
        }


    @XBlock.json_handler
    def send_xblock_id(self, submissions, suffix=''):
        return {
            'result': 'success',
            'xblock_id': unicode(self.scope_ids.usage_id),
        }

    @XBlock.json_handler
    def restore_state(self, submissions, suffix=''):
        return {
            'result': 'success',
            'selections': self.selections,
            'correctness': self.student_correctness if self.correctness_available() else '',
            'selection_order': self.selection_order if self.correctness_available() else '',
            'current_feedback': self.current_feedback if self.correctness_available() else '',
            'completed': self.completed,
            'saved' : self.has_saved_answers,
        }

    @XBlock.json_handler
    def save_state(self, submissions, suffix=''):
        _ = self.runtime.service(self, "i18n").ugettext
        self.selections = submissions['responses']
        self.selection_order = submissions['responses_order']
        self.has_saved_answers = True
        return {
            'status': 'success',
            'msg': _('Saved')
        }

    @XBlock.json_handler
    def send_hints(self, submissions, suffix=''):
        i18n_ = self.runtime.service(self, "i18n").ugettext
        tree = etree.parse(StringIO(i18n_(self.question_string)))
        raw_hints = tree.xpath('/inline_dropdown/demandhint/hint')

        decorated_hints = list()

        if len(raw_hints) == 1:
            hint = i18n_(_('Hint')) + ': ' + etree.tostring(raw_hints[0], encoding='unicode')
            decorated_hints.append(hint)
        else:
            for i in range(len(raw_hints)):
                hint = i18n_(_('Hint')) + ' ({number} / {total}): {hint}'.format(
                    number=i + 1,
                    total=len(raw_hints),
                    hint=etree.tostring(raw_hints[i], encoding='unicode'))
                decorated_hints.append(hint)

        hints = decorated_hints

        return {
            'result': 'success',
            'hints': hints,
        }


    def _get_body(self, xmlstring):
        '''
        Helper method
        '''

        tree = etree.parse(StringIO(xmlstring))

        for input_ref in tree.iter('input_ref'):
            for optioninput in tree.iter('optioninput'):
                select = Element('select')
                valuecorrectness = dict()
                valuefeedback = dict()
                if optioninput.attrib['id'] == input_ref.attrib['input']:
                    newoption = SubElement(input_ref, 'option')
                    newoption.text = ''
                    for option in self.shuffle_sequence(optioninput.iter('option')):
                        newoption = SubElement(input_ref, 'option')
                        newoption.text = option.text
                        valuecorrectness[option.text] = option.attrib['correct']
                        for optionhint in option.iter('optionhint'):
                            valuefeedback[option.text] = optionhint.text
                    input_ref.tag = 'select'
                    input_ref.attrib['xblock_id'] = unicode(self.scope_ids.usage_id)
                    self.correctness[optioninput.attrib['id']] = valuecorrectness
                    self.feedback[optioninput.attrib['id']] = valuefeedback


        body = tree.xpath('/inline_dropdown/body')

        bodystring = etree.tostring(body[0], encoding='unicode')

        return bodystring

    def shuffle_sequence(self, sequence):
        shuffled_sequence = [element for element in sequence]
        random.shuffle(shuffled_sequence)
        return shuffled_sequence

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("InlineDropdownXBlock",
             """<inline-dropdown/>
             """),
            ("Multiple InlineDropdownXBlock",
             """<vertical_demo>
                <inline-dropdown/>
                <inline-dropdown/>
                <inline-dropdown/>
                </vertical_demo>
             """),
        ]


    def submit_feeedback(self, status, extra_element):
        result = {
        'success': status,
        'problem_progress': self._get_problem_progress(),
        'submissions': self.selections,
        'correctness': self.student_correctness if self.correctness_available() else '',
        'selection_order': self.selection_order  if self.correctness_available() else '',
        'submit_feedback': self.submit_feedback_msg(),
        'should_enable_submit_button': self.should_enable_submit_button(),
        'should_show_reset_button': self.should_show_reset_button(),
        'should_show_answer_button': self.should_show_answer_button(),
        'should_show_save_button': self.should_show_save_button(),
        }
        result.update(extra_element)
        return result

