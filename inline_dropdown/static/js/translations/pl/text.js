
            (function(global){
                var inline_dropdowni18n = {
                  init: function() {
                    

(function (globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function (n) {
    var v=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  
  /* gettext library */

  django.catalog = {
    "\n            <inline_dropdown schema_version='1'>\n                <body>\n                    <p>A fruit is the fertilized ovary of a tree or plant and contains seeds. Given this, a <input_ref input=\"i1\"/> is consider a fruit, while a <input_ref input=\"i2\"/> is considered a vegetable.</p>\n                </body>\n                <optionresponse>\n                    <optioninput id=\"i1\">\n                        <option correct=\"True\">tomato<optionhint>Since the tomato is the fertilized ovary of a tomato plant and contains seeds, it is a fruit.</optionhint></option>\n                        <option correct=\"False\">potato<optionhint>A potato is an edible part of a plant in tuber form and is a vegetable, not a fruit.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <optionresponse>\n                    <optioninput id=\"i2\">\n                        <option correct=\"True\">onion<optionhint>The onion is the bulb of the onion plant and contains no seeds and is therefore a vegetable.</optionhint></option>\n                        <option correct=\"False\">cucumber<optionhint>Many people mistakenly think a cucumber is a vegetable. However, because a cucumber is the fertilized ovary of a cucumber plant and contains seeds, it is a fruit.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <demandhint>\n                    <hint>A fruit is the fertilized ovary from a flower.</hint>\n                    <hint>A fruit contains seeds of the plant.</hint>\n                </demandhint>\n            </inline_dropdown>\n        ": "\n            <inline_dropdown schema_version='1'>\n                <body>\n                    <p> Owoce powstaj\u0105 z kwiat\u00f3w drzew, krzew\u00f3w i ro\u015blin ogrodowych oraz zawieraj\u0105 nasiona. W zwi\u0105zku z tym,  <input_ref input=\"i1\"/> jest owocem, a <input_ref input=\"i2\"/> jest warzywem. </p>\n                </body>\n                <optionresponse>\n                    <optioninput id=\"i1\">\n                        <option correct=\"True\">pomidor<optionhint>W zwi\u0105zku z tym, \u017ce pomidor powstaje z kwiata i zawiera nasiona jest owocem.</optionhint></option>\n                        <option correct=\"False\">ziemniak<optionhint>Ziemniak jest jadaln\u0105 cz\u0119\u015bci\u0105 ro\u015bliny w postaci bulwy i jest warzywem, nie owocem.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <optionresponse>\n                    <optioninput id=\"i2\">\n                        <option correct=\"True\">cebula<optionhint>Cebula wyrasta z cebulki, nie zawiera nasion wi\u0119c jest warzywem. </optionhint></option>\n                        <option correct=\"False\">og\u00f3rek<optionhint>Wiele os\u00f3b b\u0142\u0119dnie uwa\u017ca og\u00f3rka za warzywo. Ze wz\u0119du na to, \u017ce og\u00f3rek zawiera nasiona i powstaje z kwiatu jest owocem.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <demandhint>\n                    <hint>Owoc zawiera nasiona i powstaje z kwiatu.</hint>\n                    <hint>Owoc zawiera nasiona ro\u015bliny.</hint>\n                </demandhint>\n            </inline_dropdown>\n        ", 
    "(Loading...)": "(Wczytywanie...)", 
    "/{weight} point": [
      "/{weight} punkt", 
      "/{weight} punkty", 
      "/{weight} punkty", 
      "/{weight} punkty"
    ], 
    "A text which will appear after giving a correct response": "Tekst, kt\u00f3ry wy\u015bwietli si\u0119 po udzieleniu poprawnej odpowiedzi", 
    "A text which will appear after giving a incorrect response": "Tekst, kt\u00f3ry wy\u015bwietli si\u0119 po udzieleniu b\u0142\u0119dnej odpowiedzi", 
    "Add a hint": "Dodaj podpowied\u017a", 
    "Add incorrect option": "Dodaj odpowied\u017a niepoprawn\u0105", 
    "Beneath there is a list of hints. You can modify, add and delete them.": "Pod spodem znajduje si\u0119 lista podpowiedzi. Mo\u017cesz je modyfikowa\u0107, dodawa\u0107 i usuwa\u0107.", 
    "Beneath you have a list of words extracted from the square brackets []. You can add feedback message which will appear after giving the correct response. You should also add Incorrect responses.": "Pod spodem znajduje si\u0119 lista s\u0142\u00f3w wyodr\u0119bnionych w \u0107wiczeniu nawiasami kwadratowymi []. Mo\u017cesz tu doda\u0107 informacj\u0119 zwrotn\u0105, kt\u00f3ra pojawi si\u0119 po udzieleniu poprawnej odpowiedzi. Powiniene\u015b r\u00f3wnie\u017c doda\u0107 warianty niepoprawne.", 
    "Cancel": "Anuluj", 
    "Check": "Prze\u015blij", 
    "Correct": "Poprawnie", 
    "Correct option: ": "Poprawna odpowied\u017a: ", 
    "Correctness of input values": "Poprawno\u015b\u0107 wprowadzonych danych", 
    "Default question content ": "Domy\u015bla tre\u015b\u0107 pytania", 
    "Definition": "Definicja", 
    "Delete": "Usu\u0144", 
    "Display Name": "Nazwa", 
    "Enter a problem here. In square brackets [] enter the words, which will be changed into gaps.": "Tutaj wpisz tre\u015b\u0107 zadania. W nawiasach kwadratowych [] wpisz s\u0142owa, kt\u00f3re zmieni\u0105 si\u0119 w luki.", 
    "Feedback": "Wiadomo\u015b\u0107 zwrotna", 
    "Hint": "Podpowied\u017a", 
    "Hints": "Podpowiedzi", 
    "Hints for the question": "Podpowied\u017a do pytania", 
    "Incorrect": "B\u0142\u0119dnie", 
    "Incorrect options": "Odpowiedzi niepoprawne", 
    "Incorrect response": "Odpowied\u017a niepoprawna", 
    "Inline Dropdown": "Zagnie\u017cd\u017cone z rozwijan\u0105 list\u0105 wyboru", 
    "Problem": "\u0106wiczenie", 
    "Reset": "Zresetuj", 
    "Save": "Zapisz", 
    "Switch to Visual editor view": "Prze\u0142\u0105cz widok do edytora Wizualnego", 
    "Switch to XML editor view": "Prze\u0142\u0105cz widok do edytora XML", 
    "The XML definition for the problem": "XML definicja problemu", 
    "This assigns an integer value representing the weight of this problem": "Przypisuje liczb\u0119 ca\u0142kowit\u0105 reprezentuj\u0105c\u0105 wag\u0119 tego problemu", 
    "This name appears in the horizontal navigation at the top of the page": "Ta nazwa pojawia si\u0119 w nawigacji na g\u00f3rze strony", 
    "Weight": "Waga", 
    "You haven't completed the question.": "Nie wype\u0142ni\u0142e\u015b pytania.", 
    "{weight} point possible": [
      "{weight} mo\u017cliwy punkt", 
      "{weight} mo\u017cliwe punkty", 
      "{weight} mo\u017cliwe punkty", 
      "{weight} mo\u017cliwych punkt\u00f3w"
    ]
  };

  django.gettext = function (msgid) {
    var value = django.catalog[msgid];
    if (typeof(value) == 'undefined') {
      return msgid;
    } else {
      return (typeof(value) == 'string') ? value : value[0];
    }
  };

  django.ngettext = function (singular, plural, count) {
    var value = django.catalog[singular];
    if (typeof(value) == 'undefined') {
      return (count == 1) ? singular : plural;
    } else {
      return value[django.pluralidx(count)];
    }
  };

  django.gettext_noop = function (msgid) { return msgid; };

  django.pgettext = function (context, msgid) {
    var value = django.gettext(context + '\x04' + msgid);
    if (value.indexOf('\x04') != -1) {
      value = msgid;
    }
    return value;
  };

  django.npgettext = function (context, singular, plural, count) {
    var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
    if (value.indexOf('\x04') != -1) {
      value = django.ngettext(singular, plural, count);
    }
    return value;
  };
  

  django.interpolate = function (fmt, obj, named) {
    if (named) {
      return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
    } else {
      return fmt.replace(/%s/g, function(match){return String(obj.shift())});
    }
  };


  /* formatting library */

  django.formats = {
    "DATETIME_FORMAT": "j E Y H:i", 
    "DATETIME_INPUT_FORMATS": [
      "%d.%m.%Y %H:%M:%S", 
      "%d.%m.%Y %H:%M:%S.%f", 
      "%d.%m.%Y %H:%M", 
      "%d.%m.%Y", 
      "%Y-%m-%d %H:%M:%S", 
      "%Y-%m-%d %H:%M:%S.%f", 
      "%Y-%m-%d %H:%M", 
      "%Y-%m-%d"
    ], 
    "DATE_FORMAT": "j E Y", 
    "DATE_INPUT_FORMATS": [
      "%d.%m.%Y", 
      "%d.%m.%y", 
      "%y-%m-%d", 
      "%Y-%m-%d"
    ], 
    "DECIMAL_SEPARATOR": ",", 
    "FIRST_DAY_OF_WEEK": "1", 
    "MONTH_DAY_FORMAT": "j F", 
    "NUMBER_GROUPING": "3", 
    "SHORT_DATETIME_FORMAT": "d-m-Y  H:i", 
    "SHORT_DATE_FORMAT": "d-m-Y", 
    "THOUSAND_SEPARATOR": "\u00a0", 
    "TIME_FORMAT": "H:i", 
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S", 
      "%H:%M:%S.%f", 
      "%H:%M"
    ], 
    "YEAR_MONTH_FORMAT": "F Y"
  };

  django.get_format = function (format_type) {
    var value = django.formats[format_type];
    if (typeof(value) == 'undefined') {
      return format_type;
    } else {
      return value;
    }
  };

  /* add to global namespace */
  globals.pluralidx = django.pluralidx;
  globals.gettext = django.gettext;
  globals.ngettext = django.ngettext;
  globals.gettext_noop = django.gettext_noop;
  globals.pgettext = django.pgettext;
  globals.npgettext = django.npgettext;
  globals.interpolate = django.interpolate;
  globals.get_format = django.get_format;

}(this));


                  }
                };
                inline_dropdowni18n.init();
                global.inline_dropdowni18n = inline_dropdowni18n;
            }(this));
        