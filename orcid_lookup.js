
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
        sandbox = typeof sandbox !== 'undefined' ? sandbox : false;
        handler = function(person){
            var given_name = person['orcid-profile']['orcid-bio']['personal-details']['given-names']['value'];
            var family_name = person['orcid-profile']['orcid-bio']['personal-details']['family-name']['value'];
            var orcid = person['orcid-profile']['orcid-identifier']['path'];
            return given_name + ' ' + family_name + ', ' + orcid;
        }
        select = typeof select !== 'undefined' ? select : function(orcid, data){
            console.log(data);
        }

        var select_main = function(event, ui){
            var orcid = ui.item.label.split(", ")[1];
            $.ajax({
                url: search_url + 'v2.0_rc1/' + orcid + '/activities',
                dataType: 'jsonp',
                success: function(data){
                    select(orcid, data)
                },
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

            splitted = query.term.split(" ");
            var search_query = null;
            if (splitted[0][0] - parseFloat(splitted[0][0]) >= 0)
                search_query = "orcid:" + splitted[0]
            else {
                if(splitted.length == 1)
                    search_query = 'family-name:' + splitted[0] + "+OR+given-names" + splitted[0]
                else
                    search_query = 'family-name:' + splitted[0] + "+AND+given-names" + splitted[1]
            }

            $.ajax({
                url: search_url + 'v1.2/search/orcid-bio?q=' + search_query + '&start=0&rows=5&wt=json', 
                dataType: 'jsonp',
                success: function(data){
                    var people = data["orcid-search-results"]["orcid-search-result"];
                    var people_minified = [];
                    for (var person in people){
                        people_minified.push(handler(people[person]));
                    }
                    response(people_minified);
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
