$(document).ready(function() {

    //UI Controller
    let UIController = (function() {

        const DOMstrings = {
            inputCurrencyPair: '#input-currency-pair',
            inputBuyOrSell: '#input-buy-or-sell',
            inputAmount: '#input-amount',
            inputEntryPrice: '#input-entry-price',
            inputExitPrice: '#input-exit-price',
            inputEnryDate: '#input-entry-date',
            inputExitDate: '#input-exit-date',
            addNewTradeBtn: '#add-new-trade',
            searchCurrencyPair: '#search-currency-pair',
            searchExitDateFrom: '#search-exit-date-from',
            searchExitDateTo: '#search-exit-date-to',
            searchTradeBtn: '#search-trade'
        }

        return {
            getInputOfNewTrade: function() {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const day = now.getDate();
                const hour = now.getHours();
                const min = now.getMinutes();
                const sec = now.getSeconds();
                return {
                    currencyPair: $(DOMstrings.inputCurrencyPair).val(),
                    buyOrSell: $(DOMstrings.inputBuyOrSell).val(),
                    amount: $(DOMstrings.inputAmount).val(),
                    entryPrice: $(DOMstrings.inputEntryPrice).val(),
                    exitPrice: $(DOMstrings.inputExitPrice).val(),
                    entryDate: $(DOMstrings.inputEnryDate).val(),
                    exitDate: $(DOMstrings.inputExitDate).val(),
                    insertedTime: `${year}/${month}/${day} ${hour}:${min}:${sec}`
                };
            },

            getInputOfSearch: function() {
                return {
                    currencyPair: $(DOMstrings.searchCurrencyPair).val(),
                    exitDateFrom: $(DOMstrings.searchExitDateFrom).val(),
                    exitDateTo: $(DOMstrings.searchExitDateTo).val()
                }
            },

            getDOMstrings: function() {
                return DOMstrings;
            }
        }

    })();

    //Controller between UI and backend
    let controller = (function(UICtrl) {

        let DOM = UICtrl.getDOMstrings();
        let setupEventListeners = function() {
            $(DOM.addNewTradeBtn).click(function() {
                controllAddNewTrade();
            });
            $(DOM.searchTradeBtn).click(function() {
                controllSearchTrade();
                setupEventListeners();
            });

            $('.show-details').click(function(e) {
                controllShowDetail(e);
            });

            $(".delete-trade").click(function(e) {
                controllDeleteTrade(e);
            });

            $('#detail-update').click(function() {
                controllUpdateDetail();
            });

        }

        let controllAddNewTrade = function() {
            const myNewTrade = UICtrl.getInputOfNewTrade();
            console.log(myNewTrade);
            $.ajax({
                 type: "POST",
                 url: "/trade/create",
                 contentType: 'application/json',
                 data: JSON.stringify(myNewTrade)
            }).done((result) => {
                console.log(result);
            }).fail((reject) => {
                alert('Cannot insert, please contact developer');
            });
            location.reload();
        };

        let controllSearchTrade = function() {
            const tradeToSearch = UICtrl.getInputOfSearch();
            console.log(tradeToSearch);
            $.ajax({
                 type: "POST",
                 url: "/trade/search",
                 contentType: 'application/json',
                 data: JSON.stringify(tradeToSearch)
            }).done((result) => {
                console.log(result);
                $('#monthly-result-tbody tr').remove();
                const tbody = $('#monthly-result-tbody');
                var i;
                for (i = 0; i < result.length; i++) {
                    tbody.append(
                        `<tr><td>${result[i].currencyPair}</td>
                        <td>${result[i].buyOrSell}</td>
                        <td>${result[i].amount}</td>
                        <td>${result[i].entryPrice}</td>
                        <td>${result[i].exitPrice}</td>
                        <td>${result[i].entryDate}</td>
                        <td>${result[i].exitDate}</td>
                        <td>${result[i].profit}</td>
                        <td>${result[i].successOrNot}</td>
                        <td>
                          <div class="btn-group" role="group" aria-label="example">
                            <button type="button" class="btn btn-danger-outline btn-sm delete-trade">X</button>
                            <button type="button" class="btn btn-success-outline btn-sm show-details" data-toggle="modal">Details</button>
                          </div>
                        </td></tr>`
                    )
                }

            }).fail((reject) => {
                alert('Cannot search, please contact developer');
            });
        }

        let controllShowDetail = function(e) {
            const tradeToShow = {};
            const tr = $(e.target).parent().parent().parent();
            const insertedTime = tr.find('td:eq(9)').text();
            tradeToShow.insertedTime = insertedTime;
            $.ajax({
                 type: "POST",
                 url: "/trade/detail",
                 contentType: 'application/json',
                 data: JSON.stringify(tradeToShow),
                 success: function(result){
                   const detail = result[0];
                   $('#detail-amount').val(detail.amount);
                   $('#detail-buy-or-sell').val(detail.buyOrSell);
                   $('#detail-entry-price').val(detail.entryPrice);
                   $('#detail-exit-price').val(detail.exitPrice);
                   $('#detail-entry-date').val(detail.entryDate);
                   $('#detail-exit-date').val(detail.exitDate);
                   $('#detail-success-or-not').val(detail.successOrNot);
                   $('#detail-inserted-time').text(detail.insertedTime);
                   $('#trade-detail').modal('show');
                 }
            });

        }

        let controllDeleteTrade = function(e) {
            const tradeToDelete = {};
            const tr = $(e.target).parent().parent().parent();
            const insertedTime = tr.find('td:eq(9)').text();
            tradeToDelete.insertedTime = insertedTime;
            //TODO: code above is duplicated with show details.
            $.ajax({
                 type: "POST",
                 url: "/trade/delete",
                 contentType: 'application/json',
                 data: JSON.stringify(tradeToDelete)
            }).done((result) => {
                //alert("successfully deleted")
            }).fail((reject) => {
                alert('Cannot delete, please contact developer');
            });
            location.reload();
        }

        let controllUpdateDetail = function() {
            let calcProfit = function(result) {
                result.profit = Math.round((result.exitPrice - result.entryPrice) * result.amount);
                if (result.successOrNot === "success") {
                    result.profit = Math.abs(result.profit);
                } else {
                    result.profit = -Math.abs(result.profit);
                }
                return result.profit
            }

            const tradeToUpdate = {
                currencyPair: $('#detail-currency-pair').val(),
                amount: $('#detail-amount').val(), //need refactering
                buyOrSell: $('#detail-buy-or-sell').val(),
                entryPrice: $('#detail-entry-price').val(),
                exitPrice: $('#detail-exit-price').val(),
                entryDate: $('#detail-entry-date').val(),
                exitDate: $('#detail-exit-date').val(),
                successOrNot: $('#detail-success-or-not').val(),
                insertedTime: $('#detail-inserted-time').text()
            };
            tradeToUpdate.profit = calcProfit(tradeToUpdate);

            $.ajax({
                 type: "POST",
                 url: "/trade/update",
                 contentType: 'application/json',
                 data: JSON.stringify(tradeToUpdate)
            }).done((result) => {
                //alert("successfully saved")
            }).fail((reject) => {
                alert('Cannot update, please contact developer');
            });
            location.reload();
        }

        return {
            init: function() {
                setupEventListeners();

                //TODO: refactoring
                //calculate summary
                var sum = 0;
                $('#monthly-result-tbody td:nth-child(8)').each(function() {
                    const value = $(this).text();
                    // add only if the value is number
                    if (!isNaN(value) && value.length != 0) {
                        sum += parseFloat(value);
                    }
                    $('#total-profit').text(sum);
                });
                //others
                $('td:nth-child(10),th:nth-child(10)').hide();
                $('#detail-inserted-time').hide();
                $('#input-area').hide();
                $('#show-input-area').click(function() {
                    $('#input-area').toggle();
                });
            }
        }

    })(UIController);

    controller.init();

});
