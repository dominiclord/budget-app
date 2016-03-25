var app;

Ractive.load('assets/templates/newTransaction.html')
    .then( function ( NewTransactionView ) {
        // NewTransactionView is a constructor that extends Ractive
        // i.e. NewTransactionView = Ractive.extend({...})
        app = new NewTransactionView({
            el: 'main',
            data: {
                headerTitle: 'New transaction'
            }
        });

        initApp();
    })
    .catch( function ( err ) {
        // the setTimeout ensures the error doesn't get swallowed
        // (this can be a problem with promises...)
        setTimeout( function ( err ) {
            throw err;
        });
    });

function initApp() {
    app.on( 'newTransaction', function ( transaction ) {
        console.log( 'saving to server...', transaction );

        var jqxhr = $.post( '/api/v1/transactions', transaction, function() {
          alert( 'success' );
        })
          .done(function() {
            alert( 'second success' );
          })
          .fail(function() {
            alert( 'error' );
          })
          .always(function() {
            alert( 'finished' );
        });
    });
}