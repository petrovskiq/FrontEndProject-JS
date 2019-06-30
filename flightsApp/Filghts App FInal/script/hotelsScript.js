$(document).ready(() => {
    let searchCitiesBtn = $("#search-hotels-btn");
    let citiesInput = $("#city-input");
    let cityNumber;
    let dataArray = [];
    let itemPerPage = 15;
    let pages = [
        []
    ];
    let count = 0;
    let maxHotels = 200;

    var Cities = {
        london: "1265951605680882802",
        newyork: "6492440167096287044",
        rome: "6891067586610528519",
        madrid: "8453540596378121696",
        barcelona: "4091462887948187412"
    }

    searchCitiesBtn.on("click", () => {

        let citiesInputVal = citiesInput.val();
        console.log(citiesInputVal);

        for (const key in Cities) {
            if (key == citiesInputVal) {
                console.log(key + " -> " + Cities[key]);
                cityNumber = Cities[key];
                console.log(cityNumber);
            }
        }

        Method.ajaxCall(`https://api.skypicker.com/flights?flyFrom=PRG&to=LGW&dateFrom=18/11/2019&dateTo=12/12/2019&partner=picky`);
    })

    let Method = {
        ajaxCall: (url) => {
            $.ajax({
                url: url,
                success: function (response) {
                    console.log(response);
                },
                error: function (response) {
                    console.log(response.status);
                }
            });
        },

        printCards: (hotelsData) => {
            console.log(hotelsData.length);
            let hotelsCards;
            for (let hotel of hotelsData) {
                hotelsCards = `<div class="card" style="width: 18rem;">
                <img src="" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${hotel.hotel_data_node.name}</h5>
                  <p class="card-text"> Desc </p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Location: ${hotel.hotel_data_node.loc.city}, ${hotel.hotel_data_node.loc.country}</li>
                  <li class="list-group-item">Dapibus ac facilisis in</li>
                  <li class="list-group-item">Rating: ${hotel.hotel_data_node.rating}</li>
                </ul>
                <div class="card-body">
                  <a href="#" class="card-link">Card link</a>
                  <a href="#" class="card-link">Another link</a>
                </div>
              </div>`;
                //$("body").append(hotelsCards)
                if (count < itemPerPage) {
                    pages[pages.length - 1].push(hotelsCards);
                    count++;
                } else {
                    pages.push([]);
                    pages[pages.length - 1].push(hotelsCards);
                    count = 1;
                };
            };
        },

        printingItemPerPage: (list) => {
            $("#hotels-cards-pages").children().remove();
            list[0].forEach(el => {
                $("#hotels-cards-content").append(el);
            });

            let buttons = `
            <div class="col-2"></div>
            <div class="col-8">
              <nav aria-label="Page navigation example" id="div-pagination-buttons">
                <ul class="pagination" id="pagination-buttons">
      
                </ul>
              </nav>
            </div>
            <div class="col-2"></div>`;

            $("#hotels-cards-pages").append(buttons);

            for (i = 0; i < list.length; i++) {
                $("#pagination-buttons").append(`<li class="page-item"><a class="page-link" href="#" value="${i}">${i + 1}</a></li>`);
            }

            $(".page-link").on("click", (e) => {
                $("#hotels-cards-content").children().remove();
                let buttonClicked = e.target.getAttribute("value");
                console.log(e.target.getAttribute("value"));
                list[buttonClicked].forEach(el => {
                    $("#hotels-cards-content").append(el);
                });
            });
        }
    }
})