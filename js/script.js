/*
	VARIABLES

	var p_error_message ---> paragraphe message d'erreur si javascript est désactivé
	var url_json ---> lien vers le fichier json
	var div_rail ---> div bloc rail
 */
	var url_json =  "https://www.skrzypczyk.fr/slideshow.php";
	var p_error_message = $("p#error-message");
	var p_internet_error_message = $("p#internet-message");
	var div_rail = $("#rail");
	var div_slideshow = $("#slideshow");
	var div_image = $(".bgSizeCover");
	var div_title = $("#title");
	var next = $("#next");
	var previous = $("#previous");
	var pauseCarousel = false;
	var largeur = 600;
	var hauteur = 340;

if($(p_error_message).hide()){

	$(div_rail).show();	
	var count=0;
	setInterval(function(){
		$(p_internet_error_message).css("visibility", "visible");
	}, 3000);
	$.getJSON(url_json, function(json){
		$(p_internet_error_message).hide();
		$(div_rail).width(largeur*json.length);
		$(div_slideshow).css("width", largeur);
		$.each( json, function( key, val ) {
			$(div_rail).append("<div class='bgSizeCover' id='img" + count + "' style='background-image: url(" + val.url + ");' data-title='" + val.title + "' data-desc='" + val.desc + "' ></div>");
			count++;
		});
		$("#timeline").progressbar({
			value: 0
		});
	    $("div#title").html($("#rail div.bgSizeCover:first").attr("data-title"));
	    $("div#desc").html($("#rail div.bgSizeCover:first").attr("data-desc"));
	    $('title').html($('.bgSizeCover:first').attr("data-title"));
	});

	$(document).bind('keydown', 'right', function(){
		$( "#next" ).trigger( "click" );
	});

	$(document).bind('keydown', 'left', function(){
		$( "#back" ).trigger( "click" );
	});

	$("#slideshow").on({
		mouseenter: function(){
			pauseCarousel = true;
			$("#back").fadeTo( "slow", 1 );
			$("#pause").fadeTo( "slow", 1 );
			$("#next").fadeTo( "slow", 1 );
			if($("#pause").attr("class") == "fa fa-pause"){
				$("#pause").attr("class", "fa fa-play");
			}else{
				$("#pause").attr("class", "fa fa-play fa-2x");
			}
			$("#pause").attr("data-value", "reprendre");
			$("#rail").pause();
  			$("#timeline").pause();
		},
		mouseleave: function(){	
			pauseCarousel = false;
			$("#back").fadeTo( "slow", 0 );
			$("#pause").fadeTo( "slow", 0 );
			$("#next").fadeTo( "slow", 0 );
			$("#pause").attr("data-value", "pause");
			if($("#pause").attr("class") == "fa fa-play"){
				$("#pause").attr("class", "fa fa-pause");
			}else{
				$("#pause").attr("class", "fa fa-pause fa-2x");
			}
			$("#rail").resume();
			$("#timeline").resume();	
		}
	});

	$("#back").click(function(){
		if($("#back").attr("disabled") == undefined){
			$(this).prop('disabled', true);
			$("#next").prop('disabled', true);
		    reverseFirstImg();
			previousImage();
			pauseCarousel = true;
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
			$("#pause").attr("data-value", "reprendre");	
			$("#pause").attr("class", "fa fa-play");
		}
	});
	$("#pause").click(function(){
		if($(this).attr("data-value") == "pause"){
			pauseCarousel = true;
			$(this).attr("class", "fa fa-play");
			$(this).attr("data-value", "reprendre");
  			$("#timeline").pause();
		}else{
			pauseCarousel = false;
			$(this).attr("data-value", "pause");
			$(this).attr("class", "fa fa-pause");
  			$("#timeline").resume();
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
	      	if($("#rail").height() > 400){
	      		$("#back").attr("class", "fa fa-chevron-left fa-2x");
	      		$("#pause").attr("class", "fa fa-pause fa-2x");
	      		$("#next").attr("class", "fa fa-chevron-right fa-2x");
	      	}
	      }
	    });
  } );


	function pauseSlide(){
		pauseCarousel = true;
		$("#pause").attr("class", "fa fa-play");
		$("#pause").attr("data-value", "reprendre");
	};

	function previousImage(){
	    //$("#previous").prop('disabled', true);
		$("#rail").animate({"margin-left":"0px"}, 2000, function(){
			$("#back").prop('disabled', false);
			$("#next").prop('disabled', false);
   	    	$("div#title").html($("#rail .bgSizeCover:first").attr("data-title"));
   	    	$("div#desc").html($("#rail .bgSizeCover:first").attr("data-desc"));
	    	$( "div#title" ).toggle( "clip" );
	    	$( "div#desc" ).toggle( "clip" );
		});
	};

	function nextImage() {
		$("#back").prop('disabled', true);
		$("#next").prop('disabled', true);
	    $("#rail").animate({"margin-left":"-" + $('.bgSizeCover').css('width')}, 2000, changeFirstImg);
	    $("#timeline").css("background-color", "red");
	    $("#timeline").animate({
	    	"width":"0px"
	    }, 2000,function(){
	    	$("#timeline").css("background-color","green");
	    	$("#timeline").animate({"width":"100%"}, 4000);
	    });
	    $( "div#title" ).toggle( "clip" );
	    $( "div#desc" ).toggle( "clip" );
	};

	function changeFirstImg() {
	    $("#rail .bgSizeCover:last").after($("#rail .bgSizeCover:first"));
	    $('title').html($('.bgSizeCover:first').attr("data-title"));
   	    $("div#title").html($("#rail .bgSizeCover:first").attr("data-title"));
   	    $( "div#title" ).toggle( "clip" );
	    $("div#desc").html($("#rail .bgSizeCover:first").attr("data-desc"));
   	    $( "div#desc" ).toggle( "clip" );
	    $("#rail").css('margin-left', '0px');
	    $("#next").prop('disabled', false);
	    $("#back").prop('disabled', false);
	};

	function reverseFirstImg(){
	    $("#rail").css('margin-left', '-' + $('.bgSizeCover').css('width'));
	    $("#timeline").stop();
	    $("#timeline").css("width", "100%");
	    $("#timeline").css("background-color","red");
	    $("#timeline").animate({
	    	"width":"0px"
	    }, 2000,function(){
	    	$("#timeline").css("background-color","green");
	    });
   	    $("div#desc").toggle("clip");
   	    $("div#title").toggle("clip");
		$("#rail .bgSizeCover:first").before($("#rail .bgSizeCover:last"));
	};

	setInterval(function(){
		if(pauseCarousel == false){
			nextImage();
		}
	}, 6000);
	

	$("#back").fadeTo( 2000, 0 );
	$("#pause").fadeTo( 2000, 0 );
	$("#next").fadeTo( 2000, 0 );

};

