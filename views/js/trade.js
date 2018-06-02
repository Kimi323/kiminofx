$(document).ready(() => {
    //create new record
    $('#add-new-trade').click(function() {
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
        const currencyPair = tr.find('td:first').text();
        const amount = tr.find('td:eq(1)').text();
        const entryPrice = tr.find('td:eq(2)').text();
        const exitPrice = tr.find('td:eq(3)').text();
        const entryDate = tr.find('td:eq(4)').text();
        const exitDate = tr.find('td:eq(5)').text();
        tradeToDelete.currencyPair = currencyPair;
        tradeToDelete.amount = amount;
        tradeToDelete.entryPrice = entryPrice;
        tradeToDelete.exitPrice = exitPrice;
        tradeToDelete.entryDate = entryDate;
        tradeToDelete.exitDate = exitDate;
        $.ajax({
             type: "POST",
             url: "/trade/delete",
             contentType: 'application/json',
             data: JSON.stringify(tradeToDelete)
        }).done((result) => {
            console.log(result);
            alert("successfully deleted")
        }).fail((reject) => {
            console.log('failed to POST to server');
        });
        location.reload();
    });

    //TODO:update record
    $('.show-details').click(function() {
        $('#trade-detail').modal('show');
        const tradeToShow = {};
        const tr = $(this).parent().parent().parent();
        const currencyPair = tr.find('td:first').text();
        const amount = tr.find('td:eq(1)').text();
        const entryPrice = tr.find('td:eq(2)').text();
        const exitPrice = tr.find('td:eq(3)').text();
        const entryDate = tr.find('td:eq(4)').text();
        const exitDate = tr.find('td:eq(5)').text();
        tradeToShow.currencyPair = currencyPair;
        tradeToShow.amount = amount;
        tradeToShow.entryPrice = entryPrice;
        tradeToShow.exitPrice = exitPrice;
        tradeToShow.entryDate = entryDate;
        tradeToShow.exitDate = exitDate;
        console.log(tradeToShow);
        $.ajax({
             type: "POST",
             url: "/trade/detail",
             contentType: 'application/json',
             data: JSON.stringify(tradeToShow),
             success: function(result){
               console.log(result);
               alert("success")
             }
        });
    });
});
