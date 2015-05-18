(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.fn.Orcid_lookup = function(sandbox){
        sandbox = typeof sandbox !== 'undefined' ? sandbox : false;
        if(sandbox) {
            this.search_url = 'http://pub.sandbox.orcid.org/v1.2/search/';
        } else {
            this.search_url = 'http://pub.orcid.org/v1.2/search/';
        }
    };

    $.fn.Orcid_lookup.prototype._search = function(query){
        $.ajax({
            url: this.search_url + 'orcid-bio?q=' + query + '&start=0&rows=10&wt=json', 
            dataType: 'jsonp',
            success: function(data){
                console.log(JSON.stringify(data), null,  2);
            },
            error: function(xhr){
                console.error(xhr);
            }
        });
    }
}));
