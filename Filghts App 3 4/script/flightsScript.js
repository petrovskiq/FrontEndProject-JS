$(document).ready(() => {
    $(function () {
        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy'
        });
    });

    let flightsSearchBtn = $("#flights-search-btn");
    let flightsFrom = $("#flights-from");
    let flightsTo = $("#flights-to");
    let flightsDateFrom = $("#flights-date-from");
    let flightsDateTo = $("#flights-date-to");
    let flightsLoadingAnimation = $("#flights-animation-loading");
    //Animation upload and hiding
    flightsLoadingAnimation.append(`<img src="https://www.drupal.org/files/issues/throbber_12.gif" alt="" width="100px" height="auto">`)
    flightsLoadingAnimation.hide()

    let itemPerPage = 15;

    let numberOfPages;
    let pages = [[]];
    let count = 0;

    flightsSearchBtn.on("click", () => {
        
        $("#flights-cards-content").children().remove();
        $("#flights-cards-pages").children().remove();
        pages = [[]];
        count = 0;
        index = 0;
        flightsLoadingAnimation.show();
        let flightsFromReplacing = flightsFrom.val().replace(/ /g, "-");
        let flightsToReplacing = flightsTo.val().replace(/ /g, "-")
        Method.ajaxCall(`https://api.skypicker.com/flights?flyFrom=${flightsFromReplacing}&to=${flightsToReplacing}&dateFrom=${flightsDateFrom.val()}&dateTo=${flightsDateTo.val()}&sort=price&curr=USD&partner=picky`, Method.processingData, Method.printingItemPerPage)
    })

    let Method = {
        ajaxCall: (url, callback, callback2) => {
            $.ajax({
                url: url,
                success: function (response) {
                    console.log(response);
                    callback(response);
                    callback2();
                    flightsLoadingAnimation.hide();
                },
                error: function (response) {
                    console.log(response.status)
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
            //odreduvanje kolku pages ke ni treba da odreden search
            //zaokruzuvame na pogolemo so Math.ceil
            numberOfPages = Math.ceil(flightsData.data.length / itemPerPage);
            console.log(numberOfPages);

            for (const element of flightsData.data) {
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
                    </div>`
                if (count < itemPerPage) {
                    pages[pages.length - 1].push(cardsFlightsPrint)
                    count++;
                }
                else{
                    pages.push([])
                    pages[pages.length - 1].push(cardsFlightsPrint)
                    count = 1;
                }
            };
            console.log(pages)
        },

        printingItemPerPage: () => {
            pages[0].forEach(el => {
                $("#flights-cards-content").append(el);
            });
            //Dodavanje div so UL-Lista za podocna da dodaeme pagination kopcinja
            let buttons = `
            <div class="col-3"></div>
            <div class="col-6">
              <nav aria-label="Page navigation example" id="div-pagination-buttons">
                <ul class="pagination" id="pagination-buttons">
      
                </ul>
              </nav>
            </div>
            <div class="col-3"></div>
            `
            $("#flights-cards-pages").append(buttons)
            
            
            //Dodavanje pagination kopcinja
            for (i = 0; i < numberOfPages; i++) {
                $("#pagination-buttons").append(`<li class="page-item"><a class="page-link" href="#" value="${i}">${i + 1}</a></li>`)
            }

            // Page link e bootstrap klasa na kopcinjata, ovde go targetirame so e.target
            // indexot na sekoe kopce, i so pages[buttonClicked] znaese koja lista treba da ja prikazeme
            $(".page-link").on("click", (e) => {
                $("#flights-cards-content").children().remove();
                let buttonClicked = e.target.getAttribute("value");
                console.log(e.target.getAttribute("value"))
                pages[buttonClicked].forEach(el => {
                    $("#flights-cards-content").append(el);
                });
            })
        }
    }
})