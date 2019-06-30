$(document).ready(() => {
    //Ako nema karta da se printa deka nema karti so takov filter

    $(function () {
        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy'
        });
    });

    airports = [{
        airport: "DME",
        city: "moscow"
    }, {
        airport: "LGW",
        city: "london"
    }, {
        airport: "CDG",
        city: "paris"
    }, {
        airport: "SKP",
        city: "skopje"
    }, {
        airport: "FCO",
        city: "rome"
    }, {
        airport: "MAD",
        city: "madrid"
    }, {
        airport: "BCN",
        city: "barcelona"
    }, {
        airport: "FRA",
        city: "frankfurt"
    }, {
        airport: "DXB",
        city: "dubai"
    }]

    //#region ------------INPUR AIRPORTS-------------
    // var options = {
    //     shouldSort: true,
    //     threshold: 0.4,
    //     maxPatternLength: 32,
    //     keys: [{
    //         name: 'iata',
    //         weight: 0.5
    //     }, {
    //         name: 'name',
    //         weight: 0.3
    //     }, {
    //         name: 'city',
    //         weight: 0.2
    //     }]
    // };

    // var fuse = new Fuse(airports, options)

    // var ac = $('#autocomplete')
    //     .on('click', function (e) {
    //         e.stopPropagation();
    //     })
    //     .on('focus keyup', search)
    //     .on('keydown', onKeyDown);

    // var wrap = $('<div>')
    //     .addClass('autocomplete-wrapper')
    //     .insertBefore(ac)
    //     .append(ac);

    // var list = $('<div>')
    //     .addClass('autocomplete-results')
    //     .on('click', '.autocomplete-result', function (e) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         selectIndex($(this).data('index'));
    //     })
    //     .appendTo(wrap);

    // $(document)
    //     .on('mouseover', '.autocomplete-result', function (e) {
    //         var index = parseInt($(this).data('index'), 10);
    //         if (!isNaN(index)) {
    //             list.attr('data-highlight', index);
    //         }
    //     })
    //     .on('click', clearResults);

    // function clearResults() {
    //     results = [];
    //     numResults = 0;
    //     list.empty();
    // }

    // function selectIndex(index) {
    //     if (results.length >= index + 1) {
    //         ac.val(results[index].iata);
    //         clearResults();
    //     }
    // }

    // var results = [];
    // var numResults = 0;
    // var selectedIndex = -1;

    // function search(e) {
    //     if (e.which === 38 || e.which === 13 || e.which === 40) {
    //         return;
    //     }

    //     if (ac.val().length > 0) {
    //         results = _.take(fuse.search(ac.val()), 7);
    //         numResults = results.length;

    //         var divs = results.map(function (r, i) {
    //             return '<div class="autocomplete-result" data-index="' + i + '">'
    //                 + '<div><b>' + r.iata + '</b> - ' + r.name + '</div>'
    //                 + '<div class="autocomplete-location">' + r.city + ', ' + r.country + '</div>'
    //                 + '</div>';
    //         });

    //         selectedIndex = -1;
    //         list.html(divs.join(''))
    //             .attr('data-highlight', selectedIndex);

    //     } else {
    //         numResults = 0;
    //         list.empty();
    //     }
    // }

    // function onKeyDown(e) {
    //     switch (e.which) {
    //         case 38: // up
    //             selectedIndex--;
    //             if (selectedIndex <= -1) {
    //                 selectedIndex = -1;
    //             }
    //             list.attr('data-highlight', selectedIndex);
    //             break;
    //         case 13: // enter
    //             selectIndex(selectedIndex);
    //             break;
    //         case 9: // enter
    //             selectIndex(selectedIndex);
    //             e.stopPropagation();
    //             return;
    //         case 40: // down
    //             selectedIndex++;
    //             if (selectedIndex >= numResults) {
    //                 selectedIndex = numResults - 1;
    //             }
    //             list.attr('data-highlight', selectedIndex);
    //             break;

    //         default: return; // exit this handler for other keys
    //     }
    //     e.stopPropagation();
    //     e.preventDefault(); // prevent the default action (scroll / move caret)
    // }
    //#endregion

    let responseDataStored;
    let radioButtonsValue;
    let flightsSearchBtn = $("#flights-search-btn");
    let flightsFrom = $("#flights-from");
    let flightsTo = $("#flights-to");
    let flightsDateFrom = $("#flights-date-from");
    let flightsDateTo = $("#flights-date-to");
    let flightsLoadingAnimation = $("#flights-animation-loading").append(`<img src="https://www.drupal.org/files/issues/throbber_12.gif" alt="" width="100px" height="auto">`);
    let filterCardsBtn = $("#filter-btn-cards");
    let filterDiv = $("#filter-div");
    let slider = document.getElementById("myRange");
    let output = document.getElementById("demo");
    let itemPerPage = 15;
    let pages = [
        []
    ];
    let count = 0;
    

    //hiding animations
    flightsLoadingAnimation.hide();
    filterDiv.hide();
    $("#sup-footer").hide();
    
    flightsSearchBtn.on("click", () => {
        $("#flights-cards-content").hide();
        $("#flights-cards-content").children().remove();
        $("#flights-cards-pages").children().remove();
        $("#popular-destination").children().remove();
        $("#footer").children().remove();

        pages = [
            []
        ];
        count = 0;
        flightsLoadingAnimation.show();

        //Changening city names to airports codes
        let flightsFromReplacing = flightsFrom.val().replace(/ /g, "-");
        let flightsToReplacing = flightsTo.val().replace(/ /g, "-");

        for (let i = 0; i < airports.length; i++) {
            if (flightsFromReplacing == airports[i].city) {
                x = airports[i].airport;
            }
            if (flightsToReplacing == airports[i].city) {
                y = airports[i].airport;
            }
        }
        Method.printPopularDestinationCards(flightsToReplacing, "../mockData/DB.json");
        Method.ajaxCall(`https://api.skypicker.com/flights?flyFrom=${x}&to=${y}&dateFrom=${flightsDateFrom.val()}&dateTo=${flightsDateTo.val()}&sort=price&curr=USD&partner=picky`, Method.processingData, Method.printingItemPerPage, Method.setPricesOnSlider);

        filterCardsBtn.on("click", () => {
            $("#flights-cards-content").hide();
            radioButtonsValue = $("input[name='exampleRadios']:checked").val();
            pages = [
                []
            ];
            count = 0;
            Method.filterData(responseDataStored);
        });
    })

    let Method = {
        ajaxCall: (url, callback, callback2, callback3) => {
            $.ajax({
                url: url,
                success: function (response) {
                    console.log(response);
                    responseDataStored = response.data;
                    callback(responseDataStored);
                    callback2(pages);
                    callback3(responseDataStored);
                },
                error: function (response) {
                    console.log(response.status);
                    console.log(response);
                }
            });
        },

        convertTime: (time) => {
            var date = new Date(time * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var day = "0" + date.getDate();
            var month = date.getMonth() + 1;
            return day.substr(-2) + "/" + month + " " + hours + 'h' + minutes.substr(-2) + "m";
        },

        processingData: (flightsData) => {
            $("#flights-cards-content").show();
            filterDiv.show();
            flightsLoadingAnimation.hide();
            $("#flights-cards-content").children().remove();

            for (let element of flightsData) {
                let cardsFlightsPrint = `
                    <div class="card" id="cardMainDiv">
                        <h5 class="card-header">${element.cityFrom}
                            <span> <img src="http://www.transparentpng.com/thumb/airplane/airplane-free-download-5.png" width="25px">
                            </span>
                            ${element.cityTo}
                        </h5>
                        <div class="row" id="cardContent">
                            <div class="col-5">
                                <p>
                                    Departure: ${Method.convertTime(element.dTime)}
                                </p>
                                <p>
                                    Arrival: ${Method.convertTime(element.aTime)}
                                </p>
                                <p>
                                    Fly Duration: ${element.fly_duration}
                                </p>
                            </div>
                            <div class="col-5">
                                <p>
                                    ${element.route.length > 1 ? `Stops: ${element.route.length}` : "Direct"}
                                </p>
                    
                                <p id="cardContentScroll">
                                    Route:${element.route.map(el => `<br>
                                    <img src="https://images.kiwi.com/airlines/64/${el.airline}.png" width="20px">
                                    ${el.cityFrom}
                                    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    ${el.cityTo}`)}
                                </p>
                            </div>
                            <div class="col-2" id="cardContentPrice">
                                <p>
                                    ${element.conversion.EUR}\u20AC / $${element.conversion.USD}
                                </p>
                                <a href="${element.deep_link}" class="btn btn-primary" target="_blank">
                                    Select
                                </a>
                            </div>
                        </div>
                    </div>`;
                if (count < itemPerPage) {
                    pages[pages.length - 1].push(cardsFlightsPrint);
                    count++;
                } else {
                    pages.push([])
                    pages[pages.length - 1].push(cardsFlightsPrint);
                    count = 1;
                };
            };
        },

        printingItemPerPage: (list) => {
            $("#flights-cards-pages").children().remove();
            list[0].forEach(el => {
                $("#flights-cards-content").append(el);
            });

            let buttons = `
            <div class="col-3"></div>
            <div class="col-9">
              <nav aria-label="Page navigation example" id="div-pagination-buttons">
                <ul class="pagination" id="pagination-buttons">
      
                </ul>
              </nav>
            </div>`;
            $("#flights-cards-pages").append(buttons);

            for (i = 0; i < list.length; i++) {
                $("#pagination-buttons").append(`<li class="page-item"><a class="page-link" href="#" value="${i}">${i + 1}</a></li>`);
            };

            $(".page-link").on("click", (e) => {
                $("#flights-cards-content").children().remove();
                let buttonClicked = e.target.getAttribute("value");
                list[buttonClicked].forEach(el => {
                    $("#flights-cards-content").append(el);
                });
            });

            Method.setFooter(`../mockData/DB.json`);
        },

        filterData: (data) => {
            $("#flights-cards-content").children().remove();
            $("#flights-cards-pages").children().remove();
            flightsLoadingAnimation.show();
            setTimeout(function () {
                flightsLoadingAnimation.hide();
                let filteredData = data.filter(d => d.route.length < radioButtonsValue && d.conversion.USD <= output.innerText);
                Method.processingData(filteredData);
                Method.printingItemPerPage(pages);
            }, 1000);
        },

        setPricesOnSlider: (data) => {
            slider.setAttribute("min", data[0].conversion.USD);
            slider.setAttribute("max", data[data.length - 1].conversion.USD);
            slider.setAttribute("value", data[data.length - 1].conversion.USD);
            output.innerHTML = slider.value; // Display the default slider value
            // Update the current slider value (each time you drag the slider handle)
            slider.oninput = function () {
                output.innerHTML = this.value;
            };
        },

        printPopularDestinationCards: (cityName, url) => {
            $.ajax({
                url: url,
                success: function (response) {
                    let card;
                    console.log(response.Array);
                    for (let city of response.Array) {
                        if (city.id == cityName) {
                            card = `<div class="card" id="testCard" style="width: 18rem;">
                        <img src="${city.img}" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${city.title}</h5>
                          <p class="card-text" style="font-size: 12px">${city.description}</p>
                          <a href="${city.deepLink}" class="btn btn-primary" target="_blank">Read more</a>
                        </div>
                      </div><br>`
                            $("#popular-destination").append(card);
                        }
                    }

                },
                error: function (response) {
                    console.log(response.status);
                    console.log(response);
                }
            });
        },

        setFooter: (data) => {
            $.ajax({
                url: data,
                success: function (response) {
                    let logo;
                    let randomNumber;
                    console.log(response.Partners);
                    let arrayNum = [];
                    var count = 5;
                    for (let i = 0; i < count; i++) {
                        randomNumber = Math.floor(Math.random() * 10)
                        if (!arrayNum.includes(randomNumber)) {
                            arrayNum.push(randomNumber);
                            console.log(randomNumber)
                        } else {
                            count++;
                        }
                    }
                    $("#footer").append(`<h1 style="color: white">Our Partners</h1>`)
                    for (const number of arrayNum) {
                        logo = `<a href="${response.Partners[number].deepLink}" target="_blank"><img src="${response.Partners[number].img}" width="150px"></a>`
                        $("#footer").append(logo);
                    }
                    $("#sup-footer").show();
                },
                error: function (response) {
                    console.log(response.status);
                    console.log(response);
                }
            })
        }
    };
})