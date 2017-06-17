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
	
	$.getJSON(url_json, function(json){
		$(div_rail).width(300*json.length);
		$("div#titles").width(300*json.length);
		$.each( json, function( key, val ) {
			$(div_rail).append("<img class='img' src='" + val.url + "' data-title='" + val.title + "' style='width:300px; height:170;'>");
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
		}
	});
	$("#pause").click(function(){
		if($(this).attr("data-value") == "pause"){
			pauseCarousel = true;
			$(this).html("Reprendre");
			$(this).attr("data-value", "reprendre");
		}else{
			pauseCarousel = false;
			$(this).attr("data-value", "pause");
			$(this).html("Pause");
		}
	});

	$( function() {
    $( "#slideshow" ).resizable({
      alsoResize: "#rail",
      alsoResize: ".img",
      aspectRatio: 16 / 9,
      start: function(){
      	pauseSlide();
      },
      stop: function(){
      	$("#rail").css('width', $('.img').width() * $('img').length);
      }
    });
  } );

	function pauseSlide(){
		pauseCarousel = true;
		$("#pause").html("Reprendre");
		$("#pause").attr("data-value", "reprendre");
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
	    $("#rail").animate({"margin-left":"-" + $('.img').css('width')}, 2000, changeFirstImg);
	    $( "div#title" ).toggle( "clip" );
	}

	function changeFirstImg() {
	    $("#rail img:last").after($("#rail img:first"));
	    $('title').html($('img:first').attr("data-title"));
   	    $("div#title").html($("#rail img:first").attr("data-title"));
   	    $( "div#title" ).toggle( "clip" );
	    $("#rail").css('margin-left', '0px');
	    $("#next").prop('disabled', false);
	    $("#back").prop('disabled', false);
	}

	function reverseFirstImg(){
	    $("#rail").css('margin-left', '-' + $('.img').css('width'));
		$("#rail img:first").before($("#rail img:last"));
   	    $("div#title").html($("#rail img:first").attr("data-title"));
   	    $("div#title").toggle("clip");
	}

	setInterval(function(){
		if(pauseCarousel == false){
			nextImage();
		}
	}, 4000);
	
}

