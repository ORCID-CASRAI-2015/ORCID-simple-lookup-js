
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.fn.Orcid_lookup = function(form, sandbox){
        sandbox = typeof sandbox !== 'undefined' ? sandbox : false;
        form.each(function() {
            var elem = $(this);

            elem.bind("input", function(event){
                var content = event.target.value;
                this._search(content);
            });

            if (sandbox) {
                this.search_url = 'http://pub.sandbox.orcid.org/v1.2/search/';
            } else {
                this.search_url = 'http://pub.orcid.org/v1.2/search/';
            }

            this._search = function(query){
                $.ajax({
                    url: this.search_url + 'orcid-bio?q=' + query + '&start=0&rows=5&wt=json', 
                    dataType: 'jsonp',
                    success: function(data){
                        // TO DO Here, the list with suggestions should be created
                        // and showm
                        console.log(JSON.stringify(data), null,  2);
                    },
                    error: function(xhr){
                        console.error(xhr);
                    }
                });
            }
        });
    };


}));
