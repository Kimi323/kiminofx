$(document).ready(function() {
    $('td:nth-child(10),th:nth-child(10)').hide();
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
        const insertedTime = `${year}/0${month}/0${day} ${hour}:${min}:${sec}`;
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
            alert('successfully inserted'); //success not shown??
        }).fail((reject) => {
            console.log('failed to POST to server');
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
            alert("successfully deleted")
        }).fail((reject) => {
            console.log('failed to POST to server');
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
        $.ajax({
             type: "POST",
             url: "/trade/update",
             contentType: 'application/json',
             data: JSON.stringify(tradeToUpdate)
        }).done((result) => {
            alert("successfully saved")
        }).fail((reject) => {
            console.log('failed to save');
        });
        location.reload();
    });
});
