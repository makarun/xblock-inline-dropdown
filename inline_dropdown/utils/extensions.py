""" Embedded Responses XBlock main Python class """

from django.template.base import Origin
import pkg_resources
from django.template import Context, Template
from django.utils import translation
import datetime
from pytz import utc
import re

from xblock.core import XBlock
from xblock.fields import Scope, String, List, Float, Integer, Dict, Boolean, DateTime, Sentinel
from xblockutils.resources import ResourceLoader

from lxml import etree
from StringIO import StringIO

UNSET = Sentinel("fields.UNSET")
_ = lambda text: text
loader = ResourceLoader(__name__)

class SHOWANSWER(object):
    """
    Constants for when to show answer
    """
    ALWAYS = "always"
    ANSWERED = "answered"
    ATTEMPTED = "attempted"
    CLOSED = "closed"
    FINISHED = "finished"
    CORRECT_OR_PAST_DUE = "correct_or_past_due"
    PAST_DUE = "past_due"
    NEVER = "never"


class ShowCorrectness(object):
    """
    Helper class for determining whether correctness is currently hidden for a block.

    When correctness is hidden, this limits the user's access to the correct/incorrect flags, messages, problem scores,
    and aggregate subsection and course grades.
    """

    """
    Constants used to indicate when to show correctness
    """
    ALWAYS = "always"
    PAST_DUE = "past_due"
    NEVER = "never"

    @classmethod
    def correctness_available(cls, show_correctness='', due_date=None, has_staff_access=False):
        """
        Returns whether correctness is available now, for the given attributes.
        """
        if show_correctness == cls.NEVER:
            return False
        elif has_staff_access:
            # This is after the 'never' check because course staff can see correctness
            # unless the sequence/problem explicitly prevents it
            return True
        elif show_correctness == cls.PAST_DUE:
            # Is it now past the due date?
            return (due_date is None or
                    due_date < datetime.datetime.now(utc))

        # else: show_correctness == cls.ALWAYS
        return True

class BooleanI18n(Boolean):
    """
    Internationalization fields values of Boolean
    """
    def __init__(self, help=None, default=UNSET, scope=Scope.content, display_name=None, **kwargs):  # pylint: disable=redefined-builtin
        super(Boolean, self).__init__(help, default, scope, display_name, values=({'display_name': _("True"), "value": True},{'display_name': _("False"), "value": False}),**kwargs)

class XBlockCapaMixin(XBlock):
    """
    Adding capa capabilities to XBlock
    """
    hints = List(
        default=[],
        scope=Scope.content,
        help=_('Hints for the question'),
    )

    score = Float(
        default=0.0,
        scope=Scope.user_state,
    )

    correctness = Dict(
        help=_('Correctness of input values'),
        scope=Scope.user_state,
        default={},
    )

    input_text_order = Dict(
        help=_('Order of input_texts in body'),
        scope=Scope.user_state,
        default={},
    )

    input_texts = Dict(
        help=_('Saved student input values'),
        scope=Scope.user_state,
        default={},
    )

    student_correctness = Dict(
        help=_('Saved student correctness values'),
        scope=Scope.user_state,
        default={},
    )

    feedback = Dict(
        help=_('Feedback for input values'),
        scope=Scope.user_state,
        default={},
    )

    current_feedback = String(
        help=_('Current feedback state'),
        scope=Scope.user_state,
        default='',
    )

    completed = Boolean(
        help=_('Indicates whether the learner has completed the problem at least once'),
        scope=Scope.user_state,
        default=False,
    )

    weight = Integer(
        display_name=_('Weight'),
        help=_(
            'This assigns an integer value representing '
            'the weight of this problem'
        ),
        default=2,
        scope=Scope.settings,
    )

    force_save_button = BooleanI18n(
        display_name=_("Force Save Button"),
        help=_("Whether to force the save button to appear on the page"),
        scope=Scope.settings,
        default=False
    )

    showanswer = String(
        display_name=_("Show Answer"),
        help=_("Defines when to show the answer to the problem. "
               "A default value can be set in Advanced Settings."),
        scope=Scope.settings,
        default=SHOWANSWER.FINISHED,
        values=[
            {"display_name": _("Always"), "value": SHOWANSWER.ALWAYS},
            {"display_name": _("Answered"), "value": SHOWANSWER.ANSWERED},
            {"display_name": _("Attempted"), "value": SHOWANSWER.ATTEMPTED},
            {"display_name": _("Closed"), "value": SHOWANSWER.CLOSED},
            {"display_name": _("Finished"), "value": SHOWANSWER.FINISHED},
            {"display_name": _("Correct or Past Due"), "value": SHOWANSWER.CORRECT_OR_PAST_DUE},
            {"display_name": _("Past Due"), "value": SHOWANSWER.PAST_DUE},
            {"display_name": _("Never"), "value": SHOWANSWER.NEVER}]
    )

    show_reset_button = BooleanI18n(
        help=_("Determines whether a 'Reset' button is shown so the user may reset their answer. "
               "A default value can be set in Advanced Settings."),
        default=False,
        scope=Scope.settings,
        display_name=_("Show Reset Button"),
    )

    last_submission_time = DateTime(help=_("Last submission time"), scope=Scope.user_state)
    submission_wait_seconds = Integer(
        display_name=_("Timer Between Attempts"),
        help=_("Seconds a student must wait between submissions for a problem with multiple attempts."),
        scope=Scope.settings,
        default=0)

    attempts = Integer(
        help=_("Number of attempts taken by the student on this problem"),
        default=0,
        scope=Scope.user_state
    )

    max_attempts = Integer(
        display_name=_("Maximum Attempts"),
        help=_("Defines the number of times a student can try to answer this problem. "
               "If the value is not set, infinite attempts are allowed."),
        scope=Scope.settings
    )
    has_saved_answers = Boolean(help=_("Whether or not the answers have been saved since last submit"),
                                scope=Scope.user_state, default=False)
    skip_flag = False

    '''
        Util functions
    '''
    @XBlock.json_handler
    def publish_event(self, data, suffix=''):
        try:
            event_type = data.pop('event_type')
        except KeyError:
            return {'result': 'error', 'message': 'Missing event_type in JSON data'}

        data['user_id'] = self.scope_ids.user_id
        data['component_id'] = self._get_unique_id()
        self.runtime.publish(self, event_type, data)

        return {'result': 'success'}

    @XBlock.json_handler
    def get_answer(self, data, suffix=''):

        _ = self.runtime.service(self, "i18n").ugettext
        if not self.should_show_answer_button():
            msg = _(u'Problem closed')
            return {'result': 'error',
                'correct_answers':  msg}
        # Example: "Answer: Answer_1 or Answer_2 or Answer_3".
        separator = ' {b_start}{or_separator}{b_end} '.format(
            # Translators: Separator used in NumericalResponse to display multiple answers.
            or_separator=_('or'),
            b_start='<b>',
            b_end='</b>',
        )

        main = _('Correct answers')+": " if len(self.input_text_order.items()) > 1 else _('Correct answer')+": "
        elem = '<small><i>({id}) {answer_list}</i></small> '
        main += '</br>'

        i = 1

        for key, value in sorted(self.correctness.items(), key=lambda x: int(re.search(r'\d+', x[0]).group())):
            correctness_list = value.items()
            for element in correctness_list:
                if element[1]=="True":
                    main += elem.format(id=i, answer_list=element[0])
                    main += '</br>'
                    i += 1

        # removing last </br>
        main = main[:-5]
        return {'result': 'success',
                'correct_answers':  main}

    def load_resource(self, resource_path):
        '''
        Gets the content of a resource
        '''
        resource_content = pkg_resources.resource_string(__name__, resource_path)
        return unicode(resource_content)

    def render_template(self, template_path, context={}):
        '''
        Evaluate a template by resource path, applying the provided context
        '''
        template_str = self.load_resource(template_path)
        return Template(template_str).render(Context(context))

    def resource_string(self, path):
        '''Handy helper for getting resources from our kit.'''
        data = pkg_resources.resource_string(__name__, path)
        return data.decode('utf8')

    def _get_unique_id(self):
        try:
        	unique_id = self.location.name
        except AttributeError:
            # workaround for xblock workbench
            unique_id = 'workbench-workaround-id'
        return unique_id

    def submit_feedback_msg(self):
        submit_feedback = ''
        if self.max_attempts > 0:
            ungettext = self.runtime.service(self, "i18n").ungettext
            submit_feedback = ungettext("You have used {num_used} of {num_total} attempt", "You have used {num_used} of {num_total} attempts", self.max_attempts).format(num_used=self.attempts, num_total=self.max_attempts)
        return submit_feedback

    def pretty_print_seconds(self, num_seconds):
        """
        Returns time duration nicely formated, e.g. "3 minutes 4 seconds"
        """
        # Here _ is the N variant ungettext that does pluralization with a 3-arg call
        ungettext = self.runtime.service(self, "i18n").ungettext
        hours = num_seconds // 3600
        sub_hour = num_seconds % 3600
        minutes = sub_hour // 60
        seconds = sub_hour % 60
        display = ""
        if hours > 0:
            display += ungettext("{num_hour} hour", "{num_hour} hours", hours).format(num_hour=hours)
        if minutes > 0:
            if display != "":
                display += " "
            # translators: "minute" refers to a minute of time
            display += ungettext("{num_minute} minute", "{num_minute} minutes", minutes).format(num_minute=minutes)
        # Taking care to make "0 seconds" instead of "" for 0 time
        if seconds > 0 or (hours == 0 and minutes == 0):
            if display != "":
                display += " "
            # translators: "second" refers to a second of time
            display += ungettext("{num_second} second", "{num_second} seconds", seconds).format(num_second=seconds)
        return display

    def set_last_submission_time(self):
        """
        Set the module's last submission time (when the problem was submitted)
        """
        self.last_submission_time = datetime.datetime.now(utc)

    def closed(self):
        """
        Is the student still allowed to submit answers?
        """
        if self.max_attempts is not None and self.attempts >= self.max_attempts:
            return True
        if self.is_past_due():
            return True

        return False

    def should_enable_submit_button(self):
        """
        Return True/False to indicate whether to enable the "Submit" button.
        """
        # If the problem is closed (past due / too many attempts)
        # then we disable the "submit" button
        # Also, disable the "submit" button if we're waiting
        # for the user to reset a randomized problem
        if self.closed() or self.is_correct():
            return False
        else:
            return True

    def should_show_reset_button(self):
        """
        Return True/False to indicate whether to show the "Reset" button.
        """
        is_survey_question = (self.max_attempts == 0)

        # if self.runtime.user_is_staff:
        #     return True
        # If the problem is closed (and not a survey question with max_attempts==0),
        # then do NOT show the reset button.
        if self.closed() and not is_survey_question:
            return False

        # Button only shows up for randomized problems if the question has been submitted
                    # Do NOT show the button if the problem is correct
        if self.is_correct():
            return False
        else:
            return self.show_reset_button

    def _get_problem_progress(self):
        """
        Returns a statement of progress for the XBlock, which depends
        on the user's current score
        """
        ungettext = self.runtime.service(self, "i18n").ungettext

        if not self.correctness_available():
            if self.graded:
                return ungettext(
                            '{weight} point possible (graded, results hidden)',
                            '{weight} points possible (graded, results hidden)',
                            self.weight).format(weight=self.weight)
            elif not self.graded:
                return ungettext(
                            '{weight} point possible (ungraded, results hidden)',
                            '{weight} points possible (ungraded, results hidden)',
                            self.weight).format(weight=self.weight)

        else:
            if self.attempts == 0:
                if self.graded:
                    return ungettext(
                                '{weight} point possible (graded)',
                                '{weight} points possible (graded)',
                                self.weight).format(weight=self.weight)
                elif not self.graded:
                    return ungettext(
                                '{weight} point possible (ungraded)',
                                '{weight} points possible (ungraded)',
                                self.weight).format(weight=self.weight)
            else:
                score_string = ('{0:.0f}' if self.score.is_integer() else '{0:.1f}').format(self.score)
                if self.graded:
                    return score_string + ungettext(
                                "/{weight} point (graded)",
                                "/{weight} points (graded)",
                                self.weight).format(weight=self.weight)
                elif not self.graded:
                    return score_string + ungettext(
                                "/{weight} point (ungraded)",
                                "/{weight} points (ungraded)",
                                self.weight).format(weight=self.weight)

                else:
                    return ''

    def _get_answer_notification(self):
        """
        Generate the answer notification type and message from the current problem status.

        """
        _ = self.runtime.service(self, "i18n").ugettext
        ungettext = self.runtime.service(self, "i18n").ungettext
        answer_notification_message = None
        answer_notification_type = None

        score_string = ('{0:.0f}' if self.score.is_integer() else '{0:.1f}').format(self.score)

        # Show only a generic message if hiding correctness
        if not self.correctness_available():
            answer_notification_type = 'submitted'
            answer_notification_message = _("Answer submitted.") + ' '

        elif self.score == 0:
            answer_notification_type = 'incorrect'
            answer_notification_message= _('Incorrect.') + ' '
            answer_notification_message =  ungettext(
                    "Incorrect ({progress} point).",
                    "Incorrect ({progress} points).",
                    self.score
                ).format(progress=score_string)
        elif self.score != self.weight:
            answer_notification_type = 'partially-correct'
            answer_notification_message = ungettext(
                    "Partially correct ({progress} point).",
                    "Partially correct ({progress} points).",
                    self.score
                ).format(progress=score_string) + ' '
        elif self.score == self.weight:
            answer_notification_type = 'correct'
            answer_notification_message = ungettext(
                    "Correct ({progress} point).",
                    "Correct ({progress} points).",
                    self.score
                ).format(progress=score_string) + ' '

        if answer_notification_type == 'incorrect':
            status = 'error'
        elif answer_notification_type == 'submitted':
            status = 'general'
        elif answer_notification_type == 'partially-correct':
            status = 'warning'
        else:
            status = 'success'
        answer_notification_message = answer_notification_message + (self.current_feedback if self.correctness_available() else '')
        return {'status': status, 'msg': answer_notification_message}

    def _publish_grade(self):
        self.runtime.publish(
            self,
            'grade',
            {
                'value': self.score,
                'max_value': self.weight,
            }
        )

    def _publish_problem_check(self):
        self.runtime.publish(
            self,
            'problem_check',
            {
                'grade': self.score,
                'max_grade': self.weight,
            }
        )

    def get_translation_content(self):
        try:
            return self.resource_string('../static/js/translations/{lang}/text.js'.format(
                lang=translation.get_language(),
            ))
        except IOError:
            return self.resource_string('../static/js/translations/en/text.js')

    def init_emulation(self):
        """
        Emulation of init function, for translation purpose.
        """
        if not self.skip_flag:
            _ = self.runtime.service(self, "i18n").ugettext
            self.fields['display_name']._default = _(self.fields['display_name']._default)
            self.fields['question_string']._default = _(self.fields['question_string']._default)
            self.skip_flag = True

    def should_show_save_button(self):
        """
        Return True/False to indicate whether to show the "Save" button.
        """

        # If the user has forced the save button to display,
        # then show it as long as the problem is not closed
        # (past due / too many attempts)
        if self.force_save_button:
            return not self.closed()
        else:
            is_survey_question = (self.max_attempts == 0)
            if self.is_correct():
                return False
            # If the student has unlimited attempts, and their answers
            # are not randomized, then we do not need a save button
            # because they can use the "Check" button without consequences.
            #
            # The consequences we want to avoid are:
            # * Using up an attempt (if max_attempts is set)
            # * Changing the current problem, and no longer being
            #   able to view it (if rerandomize is "always")
            #
            # In those cases. the if statement below is false,
            # and the save button can still be displayed.
            #
            elif self.max_attempts is None:
                return False

            # If the problem is closed (and not a survey question with max_attempts==0),
            # then do NOT show the save button
            # If we're waiting for the user to reset a randomized problem
            # then do NOT show the save button
            elif (self.closed() and not is_survey_question):
                return False
            else:
                return True

    def should_show_hint_button(self):
        tree = etree.parse(StringIO(self.question_string))
        raw_hints = tree.xpath('/inline_dropdown/demandhint/hint')

        if len(raw_hints) >= 1:
            return True
        else:
            return False

    def close_date(self):
        if self.graceperiod is not None and self.due:
           return  self.due + self.graceperiod
        else:
            return self.due

    def is_correct(self):
        """
        True iff full points
        """
        return self.score==self.weight

    def is_past_due(self):
        """
        Is it now past this problem's due date, including grace period?
        """
        return (self.close_date() is not None and
                datetime.datetime.now(utc) > self.close_date())

    def is_attempted(self):
        """
        Has the problem been attempted?

        used by conditional module
        """
        return self.attempts > 0

    def max_score(self):
        """
        Returns the configured number of possible points for this component.
        Arguments:
            None
        Returns:
            float: The number of possible points for this component
        """
        return self.weight if self.has_score else None

    def should_show_answer_button(self):
        """
        Is the user allowed to see an answer?
        """
        if not self.correctness_available():
            # If correctness is being withheld, then don't show answers either.
            return False
        elif self.showanswer == '':
            return False
        elif self.showanswer == SHOWANSWER.NEVER:
            return False
        elif self.runtime.user_is_staff:
            # This is after the 'never' check because admins can see the answer
            # unless the problem explicitly prevents it
            return True
        elif self.showanswer == SHOWANSWER.ATTEMPTED:
            return self.attempts > 0
        elif self.showanswer == SHOWANSWER.ANSWERED:
            # NOTE: this is slightly different from 'attempted' -- resetting the problems
            # makes lcp.done False, but leaves attempts unchanged.
            return self.is_correct()
        elif self.showanswer == SHOWANSWER.CLOSED:
            return self.closed()
        elif self.showanswer == SHOWANSWER.FINISHED:
            return self.closed() or self.is_correct()

        elif self.showanswer == SHOWANSWER.CORRECT_OR_PAST_DUE:
            return self.is_correct() or self.is_past_due()
        elif self.showanswer == SHOWANSWER.PAST_DUE:
            return self.is_past_due()
        elif self.showanswer == SHOWANSWER.ALWAYS:
            return True

        return False

    def correctness_available(self):
        """
        Is the user allowed to see whether she's answered correctly?

        Limits access to the correct/incorrect flags, messages, and problem score.
        """
        return ShowCorrectness.correctness_available(
            show_correctness=self.show_correctness,
            due_date=self.close_date(),
            has_staff_access=self.runtime.user_is_staff,
        )

    @staticmethod
    def get_dummy():
        """
        Dummy method to generate initial i18n
        """
        return translation.gettext_noop('Dummy')
