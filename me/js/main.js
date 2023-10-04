(function($) {
	"use strict";

	console.log('Please don\'t judge my techincal skills by what you see here :)')

    // Contact form validator
    $(function() {
		var $form = $('#contact-form');

		$form.validator();

		$form.on('submit', function (e) {
            if (!e.isDefaultPrevented()) {
                $.ajax({
                    type: 'POST',
                    url: 'https://formsubmit.co/philip.ganchev.eu@gmail.com',
                    data: $(this).serialize(),
                    success: function (data) {
                        var messageAlert = 'alert-success';
                        var messageText = 'Contact form successfully submitted. Thank you, I will get back to you soon!';

                        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                        if (messageAlert && messageText) {
							$form.find('.messages').html(alertBox);
                            if (messageAlert === 'alert-success') {
								$form[0].reset();
                            }
                        }
                    },
					error: function (data) {
                        var messageAlert = 'alert-danger';
                        var messageText = 'There was an error while submitting the form. Please try again later.';

                        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                        if (messageAlert && messageText) {
							$form.find('.messages').html(alertBox);
                            if (messageAlert === 'alert-success') {
								$form[0].reset();
                            }
                        }
                    }
                });
                return false;
            }
        });
    });

    // Text Rotator
    $.fn.extend({
		rotaterator: function(options) {
			var defaults = {
				fadeSpeed: 500,
				pauseSpeed: 300,
				child: null
			};

			var options = $.extend(defaults, options);

			return this.each(function() {
				var o = options;
				var obj = $(this);
				var items = $(obj.children(), obj);

				items.each(function() {
					$(this).hide();
				});

				if (!o.child) {
					var next = $(obj).children(':first');
				} else{
					var next = o.child;
				}

				$(next).fadeIn(o.fadeSpeed, function() {
					$(next).delay(o.pauseSpeed).fadeOut(o.fadeSpeed, function() {
						var next = $(this).next();
						if (next.length === 0){
							next = $(obj).children(':first');
						}

						$(obj).rotaterator({ 
							child: next, 
							fadeSpeed: o.fadeSpeed,
							pauseSpeed: o.pauseSpeed
						});
					});
				});
			});
		}
	});

    // Hide Mobile menu
    function mobileMenuHide() {
        var windowWidth = $(window).width();

        if (windowWidth < 1024) {
            $('#site_header').addClass('mobile-menu-hide');
        }
    }

    $(document).ready(function() {
    	// Navigation
        var $sections = $('section'),
			$navs = $('#nav li');

		$('a', $navs).on('click', function(event) {
		    var $that = $(this);
		    event.preventDefault();

			$('.pt-wrapper').animate({
				scrollTop: $('section[data-id="' + $(this).attr('href') + '"]')[0].offsetTop
			}, 700, function() {
				$navs.removeClass('active');
				$that.parent().addClass('active');
			});
		});

		$navs.find('a[href="' + window.location.hash + '"]').click();

		$('.pt-wrapper').on('scroll.nav', function() {
		    var $that = $(this);

			$sections.each(function() {
				if (
				    $(this).offset().top < window.pageYOffset + 100 &&
                    $(this).offset().top + $(this).height() > window.pageYOffset + 100
				) {
					window.location.hash = $(this).data('id');
					$navs.removeClass('active');
					$navs.find('a[href="' + window.location.hash +  '"]').parent().addClass('active');
				} else if ($that.scrollTop() + $that.innerHeight() >= $that[0].scrollHeight) {
					window.location.hash = $sections.last().data('id');
					$navs.removeClass('active');
					$navs.find('a[href="' + window.location.hash +  '"]').parent().addClass('active');
                }
			});
		});

		// Print mode
		$('.s-links .tip.print').on('click', function() {
			$('<link>')
				.appendTo('head')
				.attr({
					id: 'print-styles',
					type: 'text/css', 
					rel: 'stylesheet',
					href: 'css/print.css'
				});

			$('#mail-address').html('philip.ganchev.eu@gmail.com');
			$('#rotate').html('<p class="home-page-description">Software engineer</p>');

			window.location.hash = '';
			$('.pt-wrapper').off('scroll.nav');

			setTimeout(function() {
				window.print();
			}, 1500);
		});

		// Text rotator init
		setTimeout(function() {
			$('#rotate').rotaterator({ 
				fadeSpeed: 1000, 
				pauseSpeed: 5000 
			});
		}, 6000);

		// Demo lines
		initLines();

		// Recent projects
		var minLoadingTime = 2; // seconds
		var ajaxLoadTimeout = null;
		var $loadingWrapper = $('#loading');
		var $ajaxLoadedContent = $('#page-ajax-loaded');
		var closeProject = function() {
			$ajaxLoadedContent.addClass('fadeOutLeft');
			$('> div', $ajaxLoadedContent).detach();
			$(document).off('keydown.closeProject');
		};

		$('.subpages .ajax-page-load').on('click', function(event) {
			var time = new Date().getMilliseconds();
			event.preventDefault();

			$loadingWrapper.show();
			clearTimeout(ajaxLoadTimeout);

			$ajaxLoadedContent.load('projects/' + $(this).attr('href'), function() {
				time = new Date().getMilliseconds() - time;
				ajaxLoadTimeout = setTimeout(function() {
					$loadingWrapper.hide();
					$ajaxLoadedContent.removeClass('fadeOutLeft');
					$ajaxLoadedContent.show();
					$ajaxLoadedContent.addClass('fadeInLeft');

					$(document).on('keydown.closeProject', function(event) {
						event.preventDefault();

						if (event.keyCode === 27 || event.keyCode === 8) { // Escape or backspace
							closeProject();
						}
					});
				}, Math.max(0, (minLoadingTime * 1000) - time));
			});
		});

		$(document).on('click', '#portfolio-close-button', function() {
			closeProject();
		});

        $('#portfolio_grid > figure > a').each(function() {
        	$(this).hoverdir();
        });

        // Mobile menu
        $('.menu-toggle').click(function() {
            $('#site_header').toggleClass('mobile-menu-hide');
        });

		var $back_to_top = $('#to-top-button');

		$('.pt-wrapper').on('scroll',function() {
			($(this).scrollTop() > 300) ? $back_to_top.css({ 'opacity': 1, 'right': 30 }) : $back_to_top.css({ 'opacity': 0, 'right': -60 });
		});

		$back_to_top.on('click', function(event) {
			event.preventDefault();

			$('.pt-wrapper').animate({ scrollTop: 0 }, 700);
		});

		// Play/Pause on video click
		$(document).on('click', 'video', function() {
			this.paused ? this.play() : this.pause();
		});

		var age = Math.abs(new Date() - new Date('1993/03/11 00:00:01'));
		age = Math.floor(age / 31556926000);
		$('#info-age').html(age);
    });

    // Mobile menu hide
    $(window).on('resize', function() {
         mobileMenuHide();
    });

    // Mobile menu hide on main menu item click
    $('.site-main-menu').on('click', 'a', function() {
        mobileMenuHide();
    });
})(jQuery);

window.mobilecheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function initLines() {
	if (window.mobilecheck()) {
		return false;
	}

	// Configure
	var MAX_DISTANCE  = 200,
		PARTICLES     = 50,
		PARTICLE_SIZE = 7,
		LINE_WIDTH = 3;

	// No configure! :p
	Math.Tau = Math.PI * 2;
	Math.rand = function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	Math.map = function map(value, imin, imax, omin, omax) {
		return ((value - imin) * (omax - omin) / (imax - imin) + omin);
	};

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame    ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	var canvas  = document.getElementById('lines-demo');
	var context = canvas.getContext('2d');
	var width, height;
	var particleCounter = 0,
		hover = false,
		mmon = { x: 0, y: 0 },
		is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
		$section = $('section[data-id="#heading"]');

	context.lineWidth = LINE_WIDTH;

	var resize = function(event) {
		width  = canvas.width  = $section.width();
		height = canvas.height = $section.height();
	};

	resize();

	window.addEventListener('resize', resize);

	$section.on('mousemove', function(event) {
		var offset = $(this).offset();

		hover = true;
		mmon.x = Math.ceil(event.pageX - offset.left);
		mmon.y = Math.ceil(event.pageY - offset.top);
	});

	$section.on('mouseenter', function() {
		hover = true;
	});

	$section.on('mouseleave', function() {
		hover = false;
	});

	var Color = function Color(r, g, b, a) {
		this.r = Math.floor(r);
		this.g = Math.floor(g);
		this.b = Math.floor(b);
		this.a = Math.floor(a || 255);
	};

	Color.prototype.clone = function() {
		return new Color(this.r, this.g, this.b, this.a);
	};

	Color.prototype.toString = function() {
		if (this.a === 255) {
			return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
		} else {
			return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + (this.a / 255) + ')';
		}
	};

	var Particle = function Particle(x, y, size, color) {
		this.x  = x;
		this.y  = y;
		this.s  = size;
		this.r  = size / 2;
		this.vx = (Math.random() < 0.5 ? -1 : 1) * Math.rand(0.3, 1);
		this.vy = (Math.random() < 0.5 ? -1 : 1) * Math.rand(0.3, 1);
		this.id = particleCounter++;

		if (color instanceof Color) {
			this.c = color;
		} else {
			this.c = new Color(255, 255, 255, 255);
		}
	};

	Particle.prototype.distance = function(that) {
		if (that instanceof Particle) {
			return Math.sqrt((this.x-that.x) * (this.x - that.x) + (this.y - that.y) * (this.y - that.y));
		}
	};

	Particle.prototype.step = function() {
		this.x = (this.x + this.vx);
		if (this.x < this.r) {
			this.x = this.r;
			this.vx *= -1;
		} else if(this.x > width - this.r) {
			this.x = width - this.r;
			this.vx *= -1;
		}

		this.y = (this.y + this.vy);
		if (this.y < this.r) {
			this.y = this.r;
			this.vy *= -1;
		} else if (this.y > height - this.r) {
			this.y = height - this.r;
			this.vy *= -1;
		}
	};

	function convertToRGB (min, max, val) {
		var colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]; // RED, GREEN, BLUE
		var fi = parseFloat(val - min) / parseFloat(max - min) * (colors.length - 1);
    	var i = parseInt(fi);
    	var f = fi - i;

    	var r1 = colors[i][0],
    		g1 = colors[i][1],
    		b1 = colors[i][2],
    		r2 = colors[i + 1][0],
    		g2 = colors[i + 1][1],
    		b2 = colors[i + 1][2];

		return [
			parseInt(r1 + f * (r2 - r1)),
			parseInt(g1 + f * (g2 - g1)),
			parseInt(b1 + f * (b2 - b1))
		];
	}

	Particle.prototype.render = function() {
		if (this.imp) {
			var newColor = convertToRGB(0, canvas.width, this.x);
			
			this.c.r = newColor[0];
			this.c.g = newColor[1];
			this.c.b = newColor[2];
		}

		context.fillStyle = this.c.toString();
		context.beginPath();
		context.arc(this.x, this.y, Math.floor(this.s / 2), 0, Math.Tau, false);
		context.closePath();
		context.fill();
	};

	var particles = [];
	for (var i = 0; i < PARTICLES - 1; i++) {
		particles.push(
			new Particle(
				Math.random() * width,
				Math.random() * height,
				PARTICLE_SIZE,
				new Color(
					Math.random() * 255,
					Math.random() * 255,
					Math.random() * 255,
					255)
			)
		);
	}

	// This one is controllable by mouse movement.
	var mouseParticle = new Particle(
		Math.random() * width,
		Math.random() * height,
		PARTICLE_SIZE * 2,
		new Color(0, 200, 100, 255)
	);

	mouseParticle.imp = true;

	particles.push(mouseParticle);

	var render = function() {
		context.clearRect(0, 0, width, height);
		context.fillStyle = 'rgba(0, 0, 0, 0)';
		context.fillRect(0, 0, width, height);

		// Render all the particles and check distances
		var paired = {};
		var ipart  = PARTICLES;
		while (ipart--) {
			var p1    = particles[ipart];
			var jpart = ipart;

			p1.step();
			if (p1.imp && hover) {
				var pos = mmon;
				p1.x = pos.x;
				p1.y = pos.y;
			}
			p1.render();

			while (jpart--) {
				var p2 = particles[jpart];

				if (p1 !== p2 && !paired[p1.id + '-' + p2.id] && !paired[p2.id + '-' + p1.id]) {
					var distance = p1.distance(p2);
					if (distance < MAX_DISTANCE) {
						if (!is_firefox) {
							var grd = context.createLinearGradient(p1.x, p1.y, p2.x, p2.y),
								c1 = p1.c.clone(), c2 = p2.c.clone();

							c1.a = c2.a = Math.floor(Math.map(distance, MAX_DISTANCE, 0, 0, 255));

							grd.addColorStop(0, c1), grd.addColorStop(1, c2);

							context.strokeStyle = grd;
						} else {
							var c = p1.c.clone();
							c.a = Math.floor(Math.map(distance, MAX_DISTANCE, 0, 0, 255));
							context.strokeStyle = c.toString();
						}

						context.beginPath();
						context.moveTo(p1.x, p1.y);
						context.lineTo(p2.x, p2.y);
						context.closePath();
						context.stroke();

						paired[p1.id + '-' + p2.id] = paired[p2.id + '-' + p1.id] = true;
					}
				}
			}
		}
	};

	var loop = function() {
		requestAnimFrame(loop);
		render();
	};

	loop();
}
