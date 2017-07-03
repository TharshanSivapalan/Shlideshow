/*
	VARIABLES

	var p_error_message ---> paragraphe message d'erreur si javascript est désactivé
	var url_json ---> lien vers le fichier json
	var div_rail ---> div bloc rail
 */
	var url_json =  "https://www.skrzypczyk.fr/slideshow.php";
	var p_error_message = "p#error-message";
	var div_rail = "#rail";
	var div_slideshow = "#slideshow";
	var div_image = "bgSizeCover";
	var next = $("#next");
	var pause = $("#pause");
	var back = $("#back");
	var previous = $("#previous");
	var div_listeVignette = "#listeVignette";
	var div_vignette = "vignette";
	var div_timeline = "#timeline";
	var h1_title = "h1#title";
	var h3_desc = "h3#desc";
	var html_title = 'title';
	var pauseCarousel = false;
	var largeur = 600; // Largeur de l'image
	var hauteur = 340; // Hauteur de l'image

if($(p_error_message).hide()){

	$(div_rail).show();	
	var count=0;
	$.getJSON(url_json, function(json){
		$(div_rail).width(largeur*json.length);
		$(div_slideshow).css("width", largeur);
		$(div_listeVignette).css('width', largeur);
		$.each( json, function( key, val ) {
			$(div_rail).append("<div class='" + div_image + "' id='img" + count + "' style='background-image: url(" + val.url + ");' data-title='" + val.title + "' data-desc='" + val.desc + "' ></div>");
			$(div_listeVignette).append("<div class='" + div_vignette + "' id='img" + count + "' style='background-image:url("+val.url+");'></div>");
			count++;
		});
		$(div_timeline).progressbar({
			value: 0
		});
		$("." + div_vignette).first().attr('class', 'vignette active');
	    $(h1_title).html($(div_rail + " ." + div_image).first().attr("data-title"));
	    $(h3_desc).html($(div_rail + " ." + div_image).first().attr("data-desc"));
	    $(html_title).html($('.'+div_image+':first').attr("data-title"));
	});

	$(document).bind('keydown', 'right', function(){
		$( next ).trigger( "click" );
	});

	$(document).bind('keydown', 'left', function(){
		$( back ).trigger( "click" );
	});

	$(div_listeVignette).on("click", "." + div_vignette, function() {
			if($(this).attr('class') != div_vignette + " active"){
			pauseCarousel = true;
			var selectedImg = $(this).attr('id').split('img')[1];
			var imgShowed = $("." + div_image).first().attr('id').split('img')[1];
			var widthToChange = (selectedImg-imgShowed)*($("." + div_image).width());
			$(div_listeVignette).find('div[class="'+ div_vignette + ' active"]').attr('class', div_vignette);
			$( h1_title ).toggle( "clip" );
			$( h3_desc ).toggle( "clip" );
			if(selectedImg > imgShowed){
				$(div_rail).animate({"margin-left":"-" + widthToChange + "px"}, 2000, function(){
					for(i=0; i<(selectedImg-imgShowed); i++){
	    				$(div_rail + " ." + div_image).last().after($(div_rail + " ."+div_image).first());
	    				$(div_rail).css('margin-left', '0px');
					}
					$(html_title).html($("." + div_image).first().attr("data-title"));
			   	    $(h1_title).html($(div_rail + " ." + div_image).first().attr("data-title"));
			   	    $(h1_title).toggle( "clip" );
				    $(h3_desc).html($(div_rail + " ." + div_image).first().attr("data-desc"));
			   	    $(h3_desc).toggle( "clip" );
	    			$("." + div_vignette + '[id="'+ $("." + div_image).first().attr("id") +'"]').attr('class', div_vignette + ' active');
				});
			}else{
				for(i=0; i>(selectedImg-imgShowed); i--){
	    			$(div_rail).css('margin-left', widthToChange + "px");
					$(div_rail + " ."+ div_image).first().before($(div_rail + " ." + div_image).last());
				}
				$(div_rail).animate({"margin-left":"0px"}, 2000, function(){
					$(html_title).html($("." + div_image).first().attr("data-title"));
			   	    $(h1_title).html($(div_rail + " ." + div_image).first().attr("data-title"));
			   	    $(h1_title).toggle( "clip" );
				    $(h3_desc).html($(div_rail + " ." + div_image).first().attr("data-desc"));
			   	    $(h3_desc).toggle( "clip" );
	    			$("." + div_vignette + '[id="'+ $("."+div_image).first().attr("id") +'"]').attr('class', div_vignette + ' active');
				});
				
			}
		}
	});
	$(div_slideshow).on({
		mouseenter: function(){
			pauseCarousel = true;
			$(back).fadeTo( "slow", 1 );
			$(pause).fadeTo( "slow", 1 );
			$(next).fadeTo( "slow", 1 );
			if($(pause).attr("class") == "fa fa-pause"){
				$(pause).attr("class", "fa fa-play");
			}else{
				$(pause).attr("class", "fa fa-play fa-2x");
			}
			$(pause).attr("data-value", "reprendre");
			$(div_rail).pause();
  			$(div_timeline).pause();
		},
		mouseleave: function(){	
			pauseCarousel = false;
			$(back).fadeTo( "slow", 0 );
			$(pause).fadeTo( "slow", 0 );
			$(next).fadeTo( "slow", 0 );
			$(pause).attr("data-value", "pause");
			if($(pause).attr("class") == "fa fa-play"){
				$(pause).attr("class", "fa fa-pause");
			}else{
				$(pause).attr("class", "fa fa-pause fa-2x");
			}
			$(div_rail).resume();
			$(div_timeline).resume();	
		}
	});

	$(back).click(function(){
		if($(back).attr("disabled") == undefined){
			$(this).attr('disabled', 'disabled');
			$(next).attr('disabled', 'disabled');
		    reverseFirstImg();
			previousImage();
			pauseCarousel = true;
			$(pause).attr("data-value", "reprendre");	
			$(pause).attr("class", "fa fa-play");
		}
	});
	$(next).click(function(){
		if($(next).attr("disabled") == undefined){
		    $(this).attr('disabled', 'disabled');
			$(back).attr('disabled', 'disabled');
			nextImage();
			pauseCarousel = true;			
			$(pause).attr("data-value", "reprendre");	
			$(pause).attr("class", "fa fa-play");
		}
	});
	$(pause).click(function(){
		if($(this).attr("data-value") == "pause"){
			pauseCarousel = true;
			$(this).attr("class", "fa fa-play");
			$(this).attr("data-value", "reprendre");
  			$(div_timeline).pause();
		}else{
			pauseCarousel = false;
			$(this).attr("data-value", "pause");
			$(this).attr("class", "fa fa-pause");
  			$(div_timeline).resume();
		}
	});

	$( function() {
	    $( "#slideshow" ).resizable({
	      alsoResize: div_rail,
	      alsoResize: "." + div_image,
	      aspectRatio: 16 / 9,
	      start: function(){
	      	pauseSlide();
	      },
	      stop: function(){
	      	$(div_rail).css('width', $('.' + div_image).width() * $('. ' + div_image).length);
	      	if($(div_rail).height() > 400){
	      		$(back).attr("class", "fa fa-chevron-left fa-2x");
	      		$(pause).attr("class", "fa fa-pause fa-2x");
	      		$(next).attr("class", "fa fa-chevron-right fa-2x");
	      	}
	      }
	    });
  } );


	function pauseSlide(){
		pauseCarousel = true;
		$(pause).attr("class", "fa fa-play");
		$(pause).attr("data-value", "reprendre");
	};

	function previousImage(){
		$(div_rail).animate({"margin-left":"0px"}, 2000, function(){
			$(back).removeAttr("disabled");
			$(next).removeAttr('disabled');
   	    	$(h1_title).html($(div_rail +  " ." + div_image).first().attr("data-title"));
   	    	$(h3_desc).html($(div_rail + " ." + div_image).first().attr("data-desc"));
	    	$(h1_title).toggle( "clip" );
	    	$(h3_desc).toggle( "clip" );
		});
	};

	function nextImage() {
		$(back).attr('disabled', 'disabled');
		$(next).attr('disabled', 'disabled');
	    $(div_rail).animate({"margin-left":"-" + $('.' + div_image).css('width')}, 2000, changeFirstImg);
	    $(div_timeline).css("background-color", "red");
	    $(div_timeline).animate({
	    	"width":"0px"
	    }, 2000,function(){
	    	$(div_timeline).css("background-color","green");
	    	$(div_timeline).animate({"width":"100%"}, 4000);
	    });
	    $(h1_title).toggle( "clip" );
	    $(h3_desc).toggle( "clip" );
	};

	function changeFirstImg() {
	    $(div_listeVignette).find('div[class="' + div_vignette + ' active"]').attr('class',div_vignette);
	    $(div_rail + " ." + div_image).last().after($(div_rail + " ." + div_image).first());
	    $("." + div_vignette + '[id="'+ $('.' + div_image).first().attr("id") +'"]').attr('class', div_vignette + ' active');
	    $(html_title).html($(div_image).first().attr("data-title"));
   	    $(h1_title).html($(div_rail + " ." + div_image).first().attr("data-title"));
   	    $(h1_title).toggle( "clip" );
	    $(h3_desc).html($(div_rail + " ." + div_image).first().attr("data-desc"));
   	    $(h3_desc).toggle( "clip" );
	    $(div_rail).css('margin-left', '0px');
	    $(next).removeAttr('disabled');
	    $(back).removeAttr('disabled');
	};

	function reverseFirstImg(){
	    $(div_rail).css('margin-left', '-' + $('.' + div_image).css('width'));
	    $(div_timeline).stop();
	    $(div_timeline).css("width", "100%");
	    $(div_timeline).css("background-color","red");
	    $(div_timeline).animate({
	    	"width":"0px"
	    }, 2000,function(){
	    	$(div_timeline).css("background-color","green");
	    });
   	    $(h3_desc).toggle("clip");
   	    $(h1_title).toggle("clip");
	    $(div_listeVignette).find('div[class="' + div_vignette + ' active"]').attr('class', div_vignette);
		$(div_rail + " ." + div_image).first().before($(div_rail + " ." + div_image).last());
	    $("." + div_vignette + '[id="'+ $('.' + div_image).first().attr("id") +'"]').attr('class', div_vignette + ' active');
	};

	setInterval(function(){
		if(pauseCarousel == false){
			nextImage();
		}
	}, 6000);
	

	$(back).fadeTo( 2000, 0 );
	$(pause).fadeTo( 2000, 0 );
	$(next).fadeTo( 2000, 0 );

};

