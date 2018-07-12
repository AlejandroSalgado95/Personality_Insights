//href="/PIServiceTwitter"

$(document).ready(function() {


	console.log("started TWITTER script");

    /*
    $( "#myForm" ).dialog({
        autoOpen: false
    });*/

	$("#twitterButton").click (function(e){

		e.preventDefault();
        console.log("Twitter button was pressed");
		showForm();
		
		
	});


});


function showForm() {

    //$( "#myForm" ).dialog('open');

    
    $( "#myForm" ).dialog({
    open: function() {
        // On open, hide the original submit button
        //$( this ).find( "[type=submit]" ).hide();
        console.log("dialog box opened");
    }});

    
    /*
	$( "#myForm" ).dialog({
    open: function() {
        // On open, hide the original submit button
        //$( this ).find( "[type=submit]" ).hide();
    },
    buttons: [
            {
                text: "Analizar",
                click: function() {
                     form.submit();
                }
            },
            {
                text: "Cerrar",
                click: function() {
                    $( this ).dialog( "close" );
                }
            }
        ]
    });*/

}