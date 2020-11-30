
            (function(global){
                var inline_dropdowni18n = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "\n            <inline_dropdown schema_version='1'>\n                <body>\n                    <p>A fruit is the fertilized ovary of a tree or plant and contains seeds. Given this, a <input_ref input=\"i1\"/> is consider a fruit, while a <input_ref input=\"i2\"/> is considered a vegetable.</p>\n                </body>\n                <optionresponse>\n                    <optioninput id=\"i1\">\n                        <option correct=\"True\">tomato<optionhint>Since the tomato is the fertilized ovary of a tomato plant and contains seeds, it is a fruit.</optionhint></option>\n                        <option correct=\"False\">potato<optionhint>A potato is an edible part of a plant in tuber form and is a vegetable, not a fruit.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <optionresponse>\n                    <optioninput id=\"i2\">\n                        <option correct=\"True\">onion<optionhint>The onion is the bulb of the onion plant and contains no seeds and is therefore a vegetable.</optionhint></option>\n                        <option correct=\"False\">cucumber<optionhint>Many people mistakenly think a cucumber is a vegetable. However, because a cucumber is the fertilized ovary of a cucumber plant and contains seeds, it is a fruit.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <demandhint>\n                    <hint>A fruit is the fertilized ovary from a flower.</hint>\n                    <hint>A fruit contains seeds of the plant.</hint>\n                </demandhint>\n            </inline_dropdown>\n        ": "\n            <inline_dropdown schema_version='1'>\n                <body>\n                    <p> Owoce powstaj\u0105 z kwiat\u00f3w drzew, krzew\u00f3w i ro\u015blin ogrodowych oraz zawieraj\u0105 nasiona. W zwi\u0105zku z tym,  <input_ref input=\"i1\"/> jest owocem, a <input_ref input=\"i2\"/> jest warzywem. </p>\n                </body>\n                <optionresponse>\n                    <optioninput id=\"i1\">\n                        <option correct=\"True\">pomidor<optionhint>W zwi\u0105zku z tym, \u017ce pomidor powstaje z kwiatu i zawiera nasiona, jest owocem.</optionhint></option>\n                        <option correct=\"False\">ziemniak<optionhint>Ziemniak jest jadaln\u0105 cz\u0119\u015bci\u0105 ro\u015bliny w postaci bulwy i jest warzywem, nie owocem.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <optionresponse>\n                    <optioninput id=\"i2\">\n                        <option correct=\"True\">cebula<optionhint>Cebula wyrasta z cebulki, nie zawiera nasion wi\u0119c jest warzywem. </optionhint></option>\n                        <option correct=\"False\">og\u00f3rek<optionhint>Wiele os\u00f3b b\u0142\u0119dnie uwa\u017ca og\u00f3rka za warzywo. Ze wzgl\u0119du na to, \u017ce og\u00f3rek zawiera nasiona i powstaje z kwiatu jest owocem.</optionhint></option>\n                    </optioninput>\n                </optionresponse>\n                <demandhint>\n                    <hint>Owoc zawiera nasiona i powstaje z kwiatu.</hint>\n                    <hint>Owoc zawiera nasiona ro\u015bliny.</hint>\n                </demandhint>\n            </inline_dropdown>\n        ", 
    "(Loading...)": "(Wczytywanie...)", 
    "/{weight} point (graded)": [
      "/{weight} punkt (klasyfikowany)", 
      "/{weight} punkty (klasyfikowane)", 
      "/{weight} punkt\u00f3w (klasyfikowanych)", 
      "/{weight} punkt\u00f3w (klasyfikowanych)"
    ], 
    "/{weight} point (ungraded)": [
      "/{weight} punkt (nieklasyfikowany)", 
      "/{weight} punkty (nieklasyfikowane)", 
      "/{weight} punkt\u00f3w (nieklasyfikowanych)", 
      "/{weight} punkt\u00f3w (nieklasyfikowanych)"
    ], 
    "A text which will appear after giving a correct response": "Tekst, kt\u00f3ry wy\u015bwietli si\u0119 po udzieleniu poprawnej odpowiedzi", 
    "A text which will appear after giving a incorrect response": "Tekst, kt\u00f3ry wy\u015bwietli si\u0119 po udzieleniu b\u0142\u0119dnej odpowiedzi", 
    "Add a hint": "Dodaj podpowied\u017a", 
    "Add incorrect option": "Dodaj odpowied\u017a niepoprawn\u0105", 
    "Always": "Zawsze", 
    "Answer submitted.": "Odpowied\u017a przes\u0142ana", 
    "Answered": "Odpowiedziano", 
    "Attempted": "Podj\u0119to pr\u00f3b\u0119", 
    "Beneath there is a list of hints. You can modify, add and delete them.": "Pod spodem znajduje si\u0119 lista podpowiedzi. Mo\u017cesz je modyfikowa\u0107, dodawa\u0107 i usuwa\u0107.", 
    "Beneath you have a list of words extracted from the square brackets []. You can add feedback message which will appear after giving the correct response. You should also add Incorrect responses.": "Pod spodem znajduje si\u0119 lista s\u0142\u00f3w wyodr\u0119bnionych w \u0107wiczeniu nawiasami kwadratowymi []. Mo\u017cesz tu doda\u0107 informacj\u0119 zwrotn\u0105, kt\u00f3ra pojawi si\u0119 po udzieleniu poprawnej odpowiedzi. Nale\u017cy r\u00f3wnie\u017c doda\u0107 warianty niepoprawne.", 
    "Cancel": "Anuluj", 
    "Check": "Prze\u015blij", 
    "Closed": "Zamkni\u0119te", 
    "Correct ({progress} point).": [
      "Poprawnie ({progress} punkt).", 
      "Poprawnie ({progress} punkty).", 
      "Poprawnie ({progress} punkt\u00f3w).", 
      "Poprawnie ({progress} punkt\u00f3w)."
    ], 
    "Correct answer": "Prawid\u0142owa odpowied\u017a", 
    "Correct answers": "Prawid\u0142owe odpowiedzi", 
    "Correct option: ": "Poprawna odpowied\u017a: ", 
    "Correct or Past Due": "Prawid\u0142owo lub po terminie", 
    "Correctness of input values": "Poprawno\u015b\u0107 wprowadzonych danych", 
    "Current feedback state": "Aktualny stan informacji zwrotnej", 
    "Default question content ": "Domy\u015blna tre\u015b\u0107 pytania", 
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Pozwala okre\u015bli\u0107 liczb\u0119 pr\u00f3b jak\u0105 student mo\u017ce podj\u0105\u0107 w celu wykonania \u0107wiczenia. W przypadku niewpisania warto\u015bci, dopuszcza si\u0119 nielimitowan\u0105 liczb\u0119 pr\u00f3b.", 
    "Defines when to show the answer to the problem. A default value can be set in Advanced Settings.": "Okre\u015bl, kiedy wy\u015bwietli\u0107 odpowied\u017a na \u0107wiczenie. Mo\u017cna wskaza\u0107 domy\u015bln\u0105 warto\u015b\u0107 w ustawieniach zaawansowanych.", 
    "Definition": "Definicja", 
    "Delete": "Usu\u0144", 
    "Determines whether a 'Reset' button is shown so the user may reset their answer. A default value can be set in Advanced Settings.": "Okre\u015bl, kiedy wy\u015bwietli\u0107 odpowied\u017a na \u0107wiczenie. Mo\u017cna wskaza\u0107 domy\u015bln\u0105 warto\u015b\u0107 w ustawieniach zaawansowanych.", 
    "Display Name": "Nazwa", 
    "Dummy": "Lorem ipsum", 
    "Editor": "Edytor", 
    "Enter a problem here. In square brackets [] enter the words, which will be changed into gaps.": "Tutaj wpisz tre\u015b\u0107 zadania. W nawiasach kwadratowych [] wpisz s\u0142owa, kt\u00f3re zmieni\u0105 si\u0119 w luki.", 
    "False": "Nie", 
    "Feedback": "Wiadomo\u015b\u0107 zwrotna", 
    "Feedback for input values": "Informacja zwrotna dla warto\u015bci wej\u015bciowych", 
    "Finished": "Uko\u0144czone", 
    "Force Save Button": "Wymuszenie przycisku zapisu", 
    "Hint": "Podpowied\u017a", 
    "Hints": "Podpowiedzi", 
    "Hints for the question": "Podpowiedzi do pytania", 
    "Incorrect ({progress} point).": [
      "B\u0142\u0119dnie ({progress} punkt).", 
      "B\u0142\u0119dnie ({progress} punkty).", 
      "B\u0142\u0119dnie ({progress} punkt\u00f3w).", 
      "B\u0142\u0119dnie ({progress} punkt\u00f3w)."
    ], 
    "Incorrect options": "Odpowiedzi niepoprawne", 
    "Incorrect response": "Odpowied\u017a niepoprawna", 
    "Incorrect.": "B\u0142\u0119dnie", 
    "Indicates whether the learner has completed the problem at least once": "Wskazuje, czy student przynajmniej raz podszed\u0142 do \u0107wiczenia. ", 
    "Inline Dropdown": "Zagnie\u017cd\u017cone z rozwijan\u0105 list\u0105 wyboru", 
    "Last submission time": "Data ostatniego zg\u0142oszenia", 
    "Maximum Attempts": "Maksymalna liczba pr\u00f3b", 
    "Never": "Nigdy", 
    "Number of attempts taken by the student on this problem": "Liczba pr\u00f3b podj\u0119tych przez studenta w celu rozwi\u0105zania \u0107wiczenia", 
    "Order of input_texts in body": "Kolejno\u015b\u0107 opcji w tre\u015bci", 
    "Order of selections in body": "Kolejno\u015b\u0107 opcji w tre\u015bci", 
    "Partially correct ({progress} point).": [
      "Cz\u0119\u015bciowo poprawnie ({progress} punkt).", 
      "Cz\u0119\u015bciowo poprawnie ({progress} punkty).", 
      "Cz\u0119\u015bciowo poprawnie ({progress} punkt\u00f3w).", 
      "Cz\u0119\u015bciowo poprawnie ({progress} punkt\u00f3w)."
    ], 
    "Past Due": "Po terminie", 
    "Problem": "\u0106wiczenie", 
    "Problem closed": "\u0106wiczenie zosta\u0142o zamkni\u0119te", 
    "Reset": "Zresetuj", 
    "Save": "Zapisz", 
    "Save your answer": "Zapisz odpowied\u017a", 
    "Saved": "Zapisano", 
    "Saved student correctness values": "Zapisane poprawne wyniki studenta", 
    "Saved student input values": "Zapisane warto\u015bci wej\u015bciowe studenta", 
    "Seconds a student must wait between submissions for a problem with multiple attempts.": "Liczba sekund, kt\u00f3r\u0105 student musi odczeka\u0107 pomi\u0119dzy kolejnymi pr\u00f3bami w \u0107wiczeniach pozwalaj\u0105cych na wiele podej\u015b\u0107.", 
    "Settings": "Ustawienia", 
    "Show Answer": "Poka\u017c odpowied\u017a", 
    "Show Reset Button": "Wy\u015bwietl przycisk resetu", 
    "Show hint": "Poka\u017c podpowied\u017a", 
    "Switch to Visual editor view": "Prze\u0142\u0105cz widok do edytora Wizualnego", 
    "Switch to XML editor view": "Prze\u0142\u0105cz widok do edytora XML", 
    "The XML definition for the problem": "XML definicja problemu", 
    "This assigns an integer value representing the weight of this problem": "Przypisuje liczb\u0119 ca\u0142kowit\u0105 reprezentuj\u0105c\u0105 wag\u0119 tego problemu", 
    "This name appears in the horizontal navigation at the top of the page": "Ta nazwa pojawia si\u0119 w nawigacji na g\u00f3rze strony", 
    "Timer Between Attempts": "Czas pomi\u0119dzy pr\u00f3bami", 
    "True": "Tak", 
    "Weight": "Waga", 
    "Whether or not the answers have been saved since last submit": "Czy odpowiedzi zosta\u0142y zapisane po ostatnim zg\u0142oszeniu", 
    "Whether to force the save button to appear on the page": "Czy wy\u015bwietla\u0107 przycisk zapisu stanu na tej stronie", 
    "You cannot select Reset for a problem that is closed.": "Nie mo\u017cesz zresetowa\u0107 \u0107wiczenia, kt\u00f3re zosta\u0142o zamkni\u0119te.", 
    "You have used {num_used} of {num_total} attempt": [
      "Wykorzystano {num_used} spo\u015br\u00f3d {num_total} mo\u017cliwej pr\u00f3by", 
      "Wykorzystano {num_used} spo\u015br\u00f3d {num_total} mo\u017cliwych pr\u00f3b", 
      "Wykorzystano {num_used} spo\u015br\u00f3d {num_total} mo\u017cliwych pr\u00f3b", 
      "Wykorzystano {num_used} spo\u015br\u00f3d {num_total} mo\u017cliwych pr\u00f3b"
    ], 
    "You haven't completed the question.": "Nie uzupe\u0142niono pytania.", 
    "You must wait at least {wait_secs} between submissions. {remaining_secs} remaining.": "Nale\u017cy odczeka\u0107 co najmniej {wait_secs} pomi\u0119dzy kolejnymi pr\u00f3bami. Pozosta\u0142o {remaining_secs}.", 
    "or": "lub", 
    "{num_hour} hour": [
      "{num_hour} godzina", 
      "{num_hour} godziny", 
      "{num_hour} godzin", 
      "{num_hour} godzin"
    ], 
    "{num_minute} minute": [
      "{num_minute} minuta", 
      "{num_minute} minuty", 
      "{num_minute} minut", 
      "{num_minute} minut"
    ], 
    "{num_second} second": [
      "{num_second} sekunda", 
      "{num_second} sekundy", 
      "{num_second} sekund", 
      "{num_second} sekund"
    ], 
    "{weight} point possible (graded)": [
      "{weight} mo\u017cliwy punkt (klasyfikowany)", 
      "{weight} mo\u017cliwe punkty (klasyfikowane)", 
      "{weight} mo\u017cliwych punkt\u00f3w (klasyfikowanych)", 
      "{weight} mo\u017cliwych punkt\u00f3w (klasyfikowanych)"
    ], 
    "{weight} point possible (graded, results hidden)": [
      "{weight} mo\u017cliwy punkt (klasyfikowany, wynik ukryty)", 
      "{weight} mo\u017cliwe punkty (klasyfikowane, wynik ukryty)", 
      "{weight} mo\u017cliwych punkt\u00f3w (klasyfikowanych, wynik ukryty)", 
      "{weight} mo\u017cliwych punkt\u00f3w (klasyfikowanych, wynik ukryty)"
    ], 
    "{weight} point possible (ungraded)": [
      "{weight} mo\u017cliwy punkt (nieklasyfikowany)", 
      "{weight} mo\u017cliwe punkty (nieklasyfikowane)", 
      "{weight} mo\u017cliwych punkt\u00f3w (nieklasyfikowanych)", 
      "{weight} mo\u017cliwych punkt\u00f3w (nieklasyfikowanych)"
    ], 
    "{weight} point possible (ungraded, results hidden)": [
      "{weight} mo\u017cliwy punkt (nieklasyfikowany, wynik ukryty)", 
      "{weight} mo\u017cliwe punkty (nieklasyfikowane, wynik ukryty)", 
      "{weight} mo\u017cliwych punkt\u00f3w (nieklasyfikowanych, wynik ukryty)", 
      "{weight} mo\u017cliwych punkt\u00f3w (nieklasyfikowanych, wynik ukryty)"
    ]
  };
  for (var key in newcatalog) {
    django.catalog[key] = newcatalog[key];
  }
  

  if (!django.jsi18n_initialized) {
    django.gettext = function(msgid) {
      var value = django.catalog[msgid];
      if (typeof(value) == 'undefined') {
        return msgid;
      } else {
        return (typeof(value) == 'string') ? value : value[0];
      }
    };

    django.ngettext = function(singular, plural, count) {
      var value = django.catalog[singular];
      if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value[django.pluralidx(count)];
      }
    };

    django.gettext_noop = function(msgid) { return msgid; };

    django.pgettext = function(context, msgid) {
      var value = django.gettext(context + '\x04' + msgid);
      if (value.indexOf('\x04') != -1) {
        value = msgid;
      }
      return value;
    };

    django.npgettext = function(context, singular, plural, count) {
      var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.indexOf('\x04') != -1) {
        value = django.ngettext(singular, plural, count);
      }
      return value;
    };

    django.interpolate = function(fmt, obj, named) {
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

    django.get_format = function(format_type) {
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

    django.jsi18n_initialized = true;
  }

}(this));


                  }
                };
                inline_dropdowni18n.init();
                global.inline_dropdowni18n = inline_dropdowni18n;
            }(this));
        