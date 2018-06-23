$(document).ready(function() {

    $('td:nth-child(10),th:nth-child(10)').hide();
    $('#detail-inserted-time').hide();
    $('#input-area').hide();
    $('#show-input-area').click(function() {
        $('#input-area').toggle();
    })

    //calculate summary
    var sum = 0;
    $('#monthly-result-tbody td:nth-child(8)').each(function() {
        const value = $(this).text();
        // add only if the value is number
        if(!isNaN(value) && value.length != 0) {
            sum += parseFloat(value);
        }
        $('#total-profit').text(sum);
    });
    //create new record
    $('#add-new-trade').click(function() {
        const currencyPair = $('#input-currency-pair').val();
        const buyOrSell = $('#input-buy-or-sell').val();
        const amount = $('#input-amount').val();
        const entryPrice = $('#input-entry-price').val();
        const exitPrice = $('#input-exit-price').val();
        const entryDate = $('#input-entry-date').val();
        const exitDate = $('#input-exit-date').val();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();
        const insertedTime = `${year}/${month}/${day} ${hour}:${min}:${sec}`;
        const myNewTrade = {
          currencyPair: currencyPair,
          buyOrSell: buyOrSell,
          amount: amount,
          entryPrice: entryPrice,
          exitPrice: exitPrice,
          entryDate: entryDate,
          exitDate: exitDate,
          insertedTime: insertedTime
        }
        $.ajax({
             type: "POST",
             url: "/trade/create",
             contentType: 'application/json',
             data: JSON.stringify(myNewTrade)
        }).done((result) => {
            //alert('successfully inserted'); //success not shown??
        }).fail((reject) => {
            alert('Cannot insert, please contact developer');
        });
        location.reload();
    });

    //delete record
    $(".delete-trade").click(function() {
        const tradeToDelete = {};
        const tr = $(this).parent().parent().parent();
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
    });

    //show detail of clicked trade
    $('.show-details').click(function() {
        const tradeToShow = {};
        const tr = $(this).parent().parent().parent();
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
    });

    //update by clicking save button
    $('#detail-update').click(function() {

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
    });

    //search trade by currencyPair and exitDate
    $('#search-trade').click(function() {
        const tradeToSearch = {
            currencyPair: $('#search-currency-pair').val(),
            entryDateFrom: $('#search-entry-date-from').val(),
            entryDateTo: $('#search-entry-date-to').val(),
            exitDateFrom: $('#search-exit-date-from').val(),
            exitDateTo: $('#search-exit-date-to').val()
        };
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
    });
});
