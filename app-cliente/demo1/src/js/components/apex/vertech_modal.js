/**
 * Modal
 **/
var vertech = {};
var vchModalElement;
var vchModal;
vertech.modal = {};

if(!apex){
    var apex = {};
    apex.jQuery = jQuery;
}

(function(modal,$,$apex){
    "use strict";

    var lWindow;

    modal.open = function(url, opts, dialogcss, trgelement){

        var dialog = '<div id="vch-modal" class=\"modal modal-lg '+dialogcss+'\">'+
                       '<div id="vch-modal-dialog" class=\"modal-dialog\">'+
                         '<div id="vch-modal-content" class=\"modal-content\">'+
                           '<div class=\"modal-header\">'+
                             '<h5 id="vch-modal-title" class=\"modal-title\">'+opts.title+'</h5>'+
                             '<button type="button" class="btn-close" onclick=\"vertech.modal.close(true, false);\" aria-label=\"Close\"></button>'+
                           '</div>'+
                           '<div style="height: 100%;" class=\"p-0 modal-body\">'+
                              '<iframe src=" '+url+'" width="100%" height="100%" id="vch-modal-iframe" frameborder="0"></iframe>'+
                           '</div>'+
                         '</div>'+
                       '</div>'+
                     '</div>';

        const vchcDiv = document.getElementById('vch-modal');
        if(!vchcDiv){
            const novaDiv = document.createElement('div');
            document.body.appendChild(novaDiv);
            novaDiv.outerHTML = dialog;
            vchModalElement = document.getElementById('vch-modal');
            vchModal = new bootstrap.Modal(vchModalElement);
        }else{
            vchModalElement = document.getElementById('vch-modal');
            vchModal = new bootstrap.Modal(vchModalElement);
            document.getElementById('vch-modal-iframe').src = url;
            document.getElementById('vch-modal-title').textContent  = opts.title;
            // document.getElementById('vch-modal-content').style.width = opts.width;
            // document.getElementById('vch-modal-content').style.height  =opts.height;
        }

        vchModalElement.addEventListener('hidden.bs.modal', event => {
            apex.util.getTopApex().jQuery("#vch-modal" ).find( "iframe" )[0].contentWindow.apex.page.cancelWarnOnUnsavedChanges();
        });
        vchModalElement.addEventListener('shown.bs.modal', event => {
           modal.registerCloseHandler({
                   handler$:           apex.util.getTopApex().jQuery("#vch-modal" ),
                   dialog:             apex.util.getTopApex().jQuery("#vch-modal" ),
                   triggeringElement$: $apex(trgelement, apex.gPageContext$),
                   closeFunction:      function() {
                       vchModal.hide();
                   }
               });
        });
        vchModal.show();
        const modalIframe = document.getElementById('vch-modal-iframe');
        window.addEventListener('message', (event) => {
            // Importante: Verifique a origem da mensagem para segurança em produção!
            // Ex: if (event.origin !== 'https://seusite.com.br') return;

            // Verifica se a mensagem é do tipo que esperamos (altura do iframe)
            if (event.data && event.data.type === 'iframeAltura' && event.data.height) {
                const receivedHeight = event.data.height;
                console.log(`Página pai recebeu altura: ${receivedHeight}px`);

                // Aplica a altura ao iframe
                // Adiciona um pequeno padding extra se necessário para garantir que não corte
                modalIframe.style.height = `${receivedHeight}px`; // Adicionando 20px de padding
            }
        });

        if (opts.modal){
                    /*
            if(opts.dialog !== null){
                window.dialogVertech = opts.dialog;
                opts.dialog.find('.modal-title').text(opts.title);
                opts.dialog.find('iframe').attr('src', url);
                opts.dialog.find('.modal-dialog').css('width', opts.width);
                opts.dialog.find('.modal-dialog').css('height', opts.height);
            }else{
                if($('.vch-modal-dialog').length > 0){
                    $('.vch-modal-dialog .modal-title').text(opts.title);
                    $('.vch-modal-dialog iframe').attr('src', url);
                    $('.vch-modal-dialog .modal-dialog').css('width', opts.width);
                    $('.vch-modal-dialog .modal-dialog').css('height', opts.height);
                    new bootstrap.Modal(document.getElementById('#vch-modal'));
                }else{
                    new bootstrap.Modal(document.getElementById('#vch-modal'))
                    .off('shown.bs.modal')
                    .on('shown.bs.modal', function(){
                        modal.registerCloseHandler({
                                handler$:           apex.util.getTopApex().jQuery(".vch-modal-dialog" ),
                                dialog:             apex.util.getTopApex().jQuery(".vch-modal-dialog" ),
                                triggeringElement$: $apex(trgelement, apex.gPageContext$),
                                closeFunction:      function() {
                                    $(".vch-modal-dialog").modal("hide");
                                }
                            });
                    })
                    .on('hidden.bs.modal', function(){
                        apex.util.getTopApex().jQuery(".vch-modal-dialog" ).find( "iframe" )[0].contentWindow.apex.page.cancelWarnOnUnsavedChanges();
                    });
                }
            }
            */
        }else{
            lWindow = window.open(
                url,
                // force name to be a string in case some misguided callers pass in a number
                $apex(trgelement, apex.gPageContext$)[ 0 ].id + "_" + $v( "pInstance" ),
                "toolbar=no," +
                "scrollbars=yes," +
                "location=no," +
                "status=no," +
                "menubar=no," +
                "resizable=yes," +
                "width="        + opts.width        + "," +
                "height="       + opts.height
            );

            if ( lWindow ) {
                if ( lWindow.opener === null ) {
                    lWindow.opener = window.self;
                }
                lWindow.focus();
            }

            modal.registerCloseHandler({
                    handler$:           $apex(trgelement, apex.gPageContext$),
                    dialog:             lWindow,
                    triggeringElement$: $apex(trgelement, apex.gPageContext$),
                    closeFunction:      function() {
                        lWindow.close();
                    }
                });
        }

        //window.opener.$x_Value( pItem, pValue );
        //window.close();

    };

    modal.close = function(ismodal, url){

        function getValuesForItems( pItemNames ) {
            var i, val, name,
                lItems = {};

            for ( i = 0; i < pItemNames.length; i++ ) {
                name = pItemNames[i];
                val = $v( name );
                lItems[ name ] = val;
            }
            return lItems;
        }

        if ( $.isArray( url ) ) {
            url = getValuesForItems( url );
        }

        if(ismodal){
            apex.util.getTopApex().jQuery("#vch-modal" ).last().trigger( 'apexclosedialoginternal', url );
        }else{
            console.log(url);
            var lTriggeringId = window.name;
            console.log(lTriggeringId);
            lTriggeringId = lTriggeringId.substring( 0, lTriggeringId.lastIndexOf( "_" ) );
            window.opener.apex.jQuery( "#" + lTriggeringId ).trigger( 'apexclosedialoginternal', url );
        }
    };

    modal.registerCloseHandler = function(opts){

        opts.handler$
            .off( 'apexclosedialoginternal' )
            .on( 'apexclosedialoginternal', function( pEvent, pAction ) {
                if ( $.isFunction( pAction) ){
                    pAction.call( this, opts.dialog );
                } else if($.type( pAction ) === "string"){
                    apex.navigation.redirect( pAction );
                    opts.closeFunction();
                } else if ( pAction === false ) {
                    opts.closeFunction();
                } else {
                    opts.closeFunction();
                    opts.triggeringElement$.trigger( "apexafterclosedialog", [ pAction ]);
                }
            });

    };


})(vertech.modal, jQuery, apex.jQuery);