$(document).ready(() => {
    $('#monthly-result-list button').each(() => {
      console.log($(this));
      //$(this).attr('id', 'delete-exist-record');
    })
    //create new record
    $('#add-new-trade').click((e) => {
        const myNewTrade = {}
        const currencyPair = $('#input-currency-pair').val();
        const amount = $('#input-amount').val();
        const entryPrice = $('#input-entry-price').val();
        const exitPrice = $('#input-exit-price').val();
        const entryDate = $('#input-entry-date').val();
        const exitDate = $('#input-exit-date').val();
        myNewTrade.currencyPair = currencyPair;
        myNewTrade.amount = amount;
        myNewTrade.entryPrice = entryPrice;
        myNewTrade.exitPrice = exitPrice;
        myNewTrade.entryDate = entryDate;
        myNewTrade.exitDate = exitDate;
        $.ajax({
             type: "POST",
             url: "/trade/create",
             contentType: 'application/json',
             data: JSON.stringify(myNewTrade)
        }).done((result) => {
            myNewTrade._id = result.ops._id;
            //TODO: refesh page after inserting to db
            location.reload();
        }).fail((reject) => {
            console.log('failed to POST to server')
        });
    });

    //delete record
    $(".delete-trade").click(function() {
        const id = $(this).parent().parent().find('td:first').text();
        const tradeToDelete = {};
        tradeToDelete.id = id;
        $.ajax({
             type: "POST",
             url: "/trade/delete",
             contentType: 'application/json',
             data: JSON.stringify(tradeToDelete)
        }).done((result) => {
            //refesh page after inserting to db
            location.reload();
        }, 5000).fail((reject) => {
            console.log('failed to POST to server')
        });
    })
});
