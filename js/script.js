/*
	VARIABLES

	var p_error_message ---> paragraphe message d'erreur si javascript est désactivé
	var url_json ---> lien vers le fichier json
	var div_rail ---> div bloc rail
 */
	var url_json =  "https://www.skrzypczyk.fr/slideshow.php";
	var p_error_message = $("p.error-message");
	var div_rail = $("#rail");
	var div_title = $("#title");
	var next = $("#next");
	var previous = $("#previous");
	var pauseCarousel = false;

if($(p_error_message).hide()){

	$(div_rail).show();	
	var count=0;
	$.getJSON(url_json, function(json){
		$(div_rail).width(300*json.length);
		$("div#titles").width(300*json.length);
		$.each( json, function( key, val ) {
			$(div_rail).append("<div class='bgSizeCover' id='img" + count + "' style='background-image: url(" + val.url + ");' ></div>");
			count++;
		});
	    $("div#title").html($("#rail img:first").attr("data-title"));
	});

	$(document).bind('keydown', 'right', function(){
		$( "#next" ).trigger( "click" );
	});

	$(document).bind('keydown', 'left', function(){
		$( "#back" ).trigger( "click" );
	});

	$("#slideshow").on({
		mouseenter: function(){
			$("#pause").trigger("click");	
		},
		mouseleave: function(){	
			$("#pause").trigger("click");	
		}
	});

	$("#back").click(function(){
		if($("#back").attr("disabled") == undefined){
			$(this).prop('disabled', true);
			$("#next").prop('disabled', true);
		    reverseFirstImg();
			previousImage();
			pauseCarousel = true;
			$("#pause").html('Reprendre');
			$("#pause").attr("data-value", "reprendre");	
			$("#pause").attr("class", "fa fa-play");	
		}
	});
	$("#next").click(function(){
		if($("#next").attr("disabled") == undefined){
		    $(this).prop('disabled', true);
			$("#back").prop('disabled', true);
			nextImage();
			pauseCarousel = true;
			$("#pause").html('Reprendre');
			$("#pause").attr("data-value", "reprendre");	
			$("#pause").attr("class", "fa fa-play");	
		}
	});
	$("#pause").click(function(){
		if($(this).attr("data-value") == "pause"){
			pauseCarousel = true;
			$(this).html("Reprendre");
			$(this).attr("data-value", "reprendre");
			$(this).attr("class", "fa fa-play");
		}else{
			pauseCarousel = false;
			$(this).attr("data-value", "pause");
			$(this).attr("class", "fa fa-pause");
			$(this).html("Pause");
		}
	});

	$( function() {
    $( "#slideshow" ).resizable({
      alsoResize: "#rail",
      alsoResize: ".bgSizeCover",
      aspectRatio: 16 / 9,
      start: function(){
      	pauseSlide();
      },
      stop: function(){
      	$("#rail").css('width', $('.bgSizeCover').width() * $('.bgSizeCover').length);
      }
    });
  } );

	function pauseSlide(){
		pauseCarousel = true;
		$("#pause").html("Reprendre");
		$("#pause").attr("data-value", "reprendre");
		$("#pause").attr("class", "fa fa-play");
	};

	function previousImage(){
	    //$("#previous").prop('disabled', true);
		$("#rail").animate({"margin-left":"0px"}, 2000, function(){
			$("#back").prop('disabled', false);
			$("#next").prop('disabled', false);
		});
	    $( "div#title" ).toggle( "clip" );
	}
	function nextImage() {
	    $("#rail").animate({"margin-left":"-" + $('.bgSizeCover').css('width')}, 2000, changeFirstImg);
	    $( "div#title" ).toggle( "clip" );
	}

	function changeFirstImg() {
	    $("#rail .bgSizeCover:last").after($("#rail .bgSizeCover:first"));
	    $('title').html($('.bgSizeCover:first').attr("data-title"));
   	    $("div#title").html($("#rail .bgSizeCover:first").attr("data-title"));
   	    $( "div#title" ).toggle( "clip" );
	    $("#rail").css('margin-left', '0px');
	    $("#next").prop('disabled', false);
	    $("#back").prop('disabled', false);
	}

	function reverseFirstImg(){
	    $("#rail").css('margin-left', '-' + $('.bgSizeCover').css('width'));
		$("#rail .bgSizeCover:first").before($("#rail .bgSizeCover:last"));
   	    $("div#title").html($("#rail .bgSizeCover:first").attr("data-title"));
   	    $("div#title").toggle("clip");
	}

	setInterval(function(){
		if(pauseCarousel == false){
			nextImage();
		}
	}, 4000);
	
}

