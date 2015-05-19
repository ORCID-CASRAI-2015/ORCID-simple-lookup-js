
$( document ).ready(function(){
    $('.sth').Orcid_lookup(
        undefined,
        function(orcid, data){
            $('.educations').html('');
            $('.employments').html('');
            $('.name').html('');
            if(data['educations'])
                var educations = data['educations']['education-summary'];
            if(data['employments'])
                var employments = data['employments']['employment-summary'];
            $.ajax({
                url: 'http://pub.orcid.org/v1.2/' + orcid + '/orcid-bio',
                dataType: 'jsonp',
                success: function(data2){
                    var names = data2['orcid-profile']['orcid-bio']['personal-details'];
                    $('.name').append(names['given-names']['value'] + ' ' + names['family-name']['value']);
                }
            })

            var process = function(data, div){
                for(d in data){
                    console.log(data[d]);
                    $.ajax({
                        url: 'http://pub.orcid.org/v2.0_rc1/' + orcid + '/' + div + '/' + data[d]['put-code'],
                        dataType: 'jsonp',
                        success: function(data2){
                            $('.' + div).append('<li>' + data2['organization']['name'] + '</li>');
                        }
                    })
                }
            }

            process(educations, "education");
            process(employments, "employment");
        }
    );
})