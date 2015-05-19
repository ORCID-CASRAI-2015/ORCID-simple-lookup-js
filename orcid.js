
$( document ).ready(function(){


    $('.all_info').hide();
    $('.sth').Orcid_lookup(
        false,
        function(data){
            $('.all_info').show();
            $('.education').html('');
            $('.employment').html('');
            $('.ed').hide();
            $('.em').hide();
            $('.name').html('');
            $('.orcid').html('');

            var orcid = data['orcid-profile']['orcid-identifier']['path'];
            $('.orcid').html(orcid);

            var names = data['orcid-profile']['orcid-bio']['personal-details'];
            $('.name').append(names['given-names']['value'] + ' ' + names['family-name']['value']);


            var activities = data['orcid-profile']['orcid-activities'];
            if (activities)
                var affiliations = activities['affiliations']['affiliation'];
            else var affiliations = [];

            for(aff in affiliations){
                var current = affiliations[aff];
                $('.' + current['type'].toLowerCase()).append('<li>' + current['organization']['name'] + '</li>');
                if(current['type'].toLowerCase() === 'education')
                    $('.ed').show();
                else
                    $('.em').show();
            }
        }
    );
})