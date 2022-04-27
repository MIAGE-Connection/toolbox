var finished = false

var img_generated;

function $_id(node) {
    return document.getElementById(node)
}

function fLoadMatrix(addresses) {
    var out = "<h2>Base de remboursement</h2><table id='bdr' border='1''><tr><td>&nbsp;</td>";
    for (var i = 0; i < addresses.length; ++i) {
        out += "<th>" + addresses[i].cityname + "</th>";
    }
    out += '</tr>';
    for (i = 0; i < addresses.length; ++i) {
        out += "<tr><th>" + addresses[i].cityname + "</th>";
        for (var j = 0; j < addresses.length; ++j) {
            out += "<td id='" + i + '_' + j + "'> </td>";
        }
        out += "</tr>";
    }
    out += '</table>';
    $_id("results").innerHTML = out;
    //Geocode all addresses in one call
    VMLaunch("ViaMichelin.Api.Geocoding", addresses, {
        onSuccess: function (results) {
            for (i = 0; i < results.length; ++i) {
                for (j = i + 1; j < results.length; ++j) {
                    fLaunchRoutePlanner(results[i][0].coords, results[j][0].coords, i, j)
                }
            }
        },
        onError: function (error) {
            alert('Whoops! ' + error);
        }
    });
};

function add_to_clipboard(container_node) {
    function listener(e) {
        e.clipboardData.setData("text/html", container_node.innerHTML);
        e.clipboardData.setData("text/plain", container_node.innerHTML);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}

function copy_table() {
    let gen_button = document.getElementById("gen-button")

    gen_button.setAttribute('aria-busy', true)
    gen_button.innerHTML = ''

    setTimeout(function () {
        let template = document.getElementById('results')
        add_to_clipboard(template)
        gen_button.setAttribute('aria-busy', false)
        gen_button.innerText = 'GÉNÉRER'
    }, 2000);
}

function fLaunchRoutePlanner(coordsA, coordsB, i, j) {
    VMLaunch("ViaMichelin.Api.Itinerary", {
        steps: [//Array of Geo coodinates
            { coords: coordsA },
            { coords: coordsB }
        ],
        data: ViaMichelin.Api.Constants.Itinerary.DATA.HEADER
    }, {
        onSuccess: function (result) {
            $_id(i + '_' + j).innerHTML = $_id(j + '_' + i).innerHTML = (result.header.summaries[0].tollCost.car / 100) + Math.round((((result.header.summaries[0].totalDist / 1000) * 6.5) / 100) * 1.45)   /*+ Math.round((result.header.summaries[0].totalTime/60)/24) + 'mn'*/;
            copy_table()
        },
        onError: function (error) {
            alert('Whoops! ' + error);
        }
    });
};

function generate_table() {
    api_key = document.getElementById('input-api-key').value
    finished = false

    var addresses = new Array();

    cities = document.getElementById('input-cities').value.trim()

    let gen_button = document.getElementById("gen-button")

    gen_button.setAttribute('aria-busy', true)
    gen_button.innerHTML = ''

    cities.split('\n').forEach(c => {
        var city_name, city_token;
        if (c.includes('/') == false) {
            city_name = c
            city_token = c
        }
        else {
            city_token = c.split('/')[0]
            city_name = c.split('/')[1]
        }
        addresses.push({ city: city_token, countryISOCode: "FRA", cityname: city_name })
    });

    $.getScript('https://secure-apijs.viamichelin.com/apijsv2/api/js?key=' + api_key + '&lang=fra&protocol=https', function () {
        $(document).ready(function () {
            fLoadMatrix(addresses)
        });
    });
}