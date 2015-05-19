
/*
Usage:

var sandbox = false;
var callback = function(data){
    console.log(data);
}
$('.coolinput').Orcid_lookup(sandbox, callback)

// ENJOY!!!

*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.fn.Orcid_lookup = function(sandbox, select){
        /*
            param sandbox - boolean - whether to use sandbox or not
            param select - function(data) - callback which receives the
                whole profile of the selected person. It is a json which
                was retrieved using public `orcid-profile` call.
        */
        var people_minified = [];
        var timeout;
        var found_number = 0;
        var response_function = null;

        handler = function(person){
            var given_name = person['orcid-profile']['orcid-bio']['personal-details']['given-names']['value'];
            var family_name = person['orcid-profile']['orcid-bio']['personal-details']['family-name']['value'];
            var orcid = person['orcid-profile']['orcid-identifier']['path'];
            var affiliation = null;
            $.ajax({
              url: search_url + 'v2.0_rc1/' + orcid + '/activities',
              dataType: 'jsonp',
              success: function(data) {
                var last_employment = data['employments'];
                if(last_employment){
                    var affiliation_putcode = last_employment['employment-summary'][0]['put-code'];
                    $.ajax({
                        url: search_url + 'v2.0_rc1/' + orcid + '/employment/' + affiliation_putcode,
                        dataType: 'jsonp',
                        success: function(data){
                            affiliation = data['organization']['name'];
                            people_minified.push(given_name + ' ' + family_name + ' (' + affiliation + '), ' + orcid);
                        
                            if(people_minified.length >= found_number){
                                response_function(people_minified);
                                clearInterval(timeout);
                            }
                        },
                        error: function(data){
                            console.error(xhr);
                        }
                    })
                    
                } else
                    people_minified.push(given_name + ' ' + family_name + ', ' + orcid);
                if(people_minified.length >= found_number){
                    response_function(people_minified);
                    clearInterval(timeout);
                }
              },
              error: function(xhr){
                console.error(xhr);
              }
            });
        }
        select = typeof select !== 'undefined' ? select : function(orcid, data){
            console.log(data);
        }

        var select_main = function(event, ui){
            var orcid = ui.item.label.split(", ")[1];
            $.ajax({
                url: search_url + 'v1.2/' + orcid + '/orcid-profile',
                dataType: 'jsonp',
                success: select,
                error: function(xhr){
                    console.error(xhr);
                }
            })
            event.stopPropagation();
            event.preventDefault();
        }

        var search_url;
        if (sandbox) {
            search_url = 'http://pub.sandbox.orcid.org/';
        } else {
            search_url = 'http://pub.orcid.org/';
        }

        var cache = {};

        var _search = function(query, response){
            response_function = response;
            splitted = query.term.split(" ");
            var search_query = null;
            if (splitted[0][0] - parseFloat(splitted[0][0]) >= 0)
                search_query = "orcid:" + splitted[0]
            else {
                if(splitted.length == 1)
                    search_query = 'family-name:' + splitted[0] + "+OR+given-names:" + splitted[0]
                else
                    search_query = 'given-names:' + splitted[0] + "+AND+family-name:" + splitted[1]
            }

            $.ajax({
                url: search_url + 'v1.2/search/orcid-bio?q=' + search_query + '&start=0&rows=5&wt=json', 
                dataType: 'jsonp',
                success: function(data){
                    var people = data["orcid-search-results"]["orcid-search-result"];
                    people_minified = [];
                    found_number = people.length;
                    for (var person in people){
                        handler(people[person]);
                    };
                    timeout = setInterval(function(){response(people_minified)}, 100);
                },
                error: function(xhr){
                    console.error(xhr);
                }
            });
        }

        this.autocomplete({
            source: function(request, response){
                _search(request, response);
            },
            select: select_main,
            response: function(event, ui){},
            minLength: 3
        })

        return this;

    };


}));
