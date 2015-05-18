
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.fn.Orcid_lookup = function(handler, select, sandbox){
        sandbox = typeof sandbox !== 'undefined' ? sandbox : false;
        handler = typeof handler !== 'undefined' ? handler : function(person){
            var given_name = person['orcid-profile']['orcid-bio']['personal-details']['given-names']['value'];
            var family_name = person['orcid-profile']['orcid-bio']['personal-details']['family-name']['value'];
            var orcid = person['orcid-profile']['orcid-identifier']['path'];
            return family_name + ' ' + given_name + ', ' + orcid;
        }
        select = typeof select !== 'undefined' ? select : function(event, ui){
            console.log(ui.item);
            event.stopPropagation();
            event.preventDefault();
        }

        var search_url;
        if (sandbox) {
            search_url = 'http://pub.sandbox.orcid.org/v1.2/search/';
        } else {
            search_url = 'http://pub.orcid.org/v1.2/search/';
        }

        var cache = {};

        var _search = function(query, response){

            /*if(query.term in cache){
                var people = cache[query.term];
            }*/

            $.ajax({
                url: search_url + 'orcid-bio?q=digital-object-ids:%22' + query.term + '%22&start=0&rows=5&wt=json', 
                dataType: 'jsonp',
                success: function(data){
                    var people = data["orcid-search-results"]["orcid-search-result"];
                    // cache[query.term] = people;
                    var people_minified = [];
                    for (var person in people){
                        people_minified.push(handler(people[person]));
                    }
                    response(people_minified);
                },
                error: function(xhr){
                    console.error(xhr);
                },
                open: function() {
                  $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                },
                close: function() {
                  $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                }
            });
        }

        this.autocomplete({
            source: function(request, response){
                _search(request, response);
            },
            select: select,
            minLength: 3
        })

        return this;

    };


}));
