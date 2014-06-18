/*! Copyright 2014 CINC (www.infocinc.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
*/

///////////////////////////////////////////////////////////////////////
// Globals
///////////////////////////////////////////////////////////////////////
var CANVAS_RATIO;

///////////////////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////////////////

$.fn.isOnScreen = function() {

    var win = $(window);

    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

//////////////////////////////////////////////////////////////////////////////////
// Enquire registering
//////////////////////////////////////////////////////////////////////////////////
// The telephone icon has two different meanings depending on device type:
//   desktop (992px and larger) : bring up a modal box with contact info
//   tablet and mobile : launches a phone call

function registerMediaCallbacks() {
    mediaSwitch = false;

    enquire.register("screen and (min-width:992px)", {
        unmatch: function() {
            graph.orientation = 'horizontal';
            graph.update([Math.random() * 10, Math.random() * 10,
                Math.random() * 10, Math.random() * 10,
                Math.random() * 10, Math.random() * 10,
                Math.random() * 10
            ]);
            CANVAS_RATIO = 0.5;
        },
        match: function() {
            graph.orientation = 'vertical';
            graph.update([Math.random() * 10, Math.random() * 10,
                Math.random() * 10, Math.random() * 10,
                Math.random() * 10, Math.random() * 10,
                Math.random() * 10
            ]);
            CANVAS_RATIO = 0.62;
        }
    });

    enquire.register("screen and (min-width:768px)", {

        unmatch: function() {
            mediaSwitch = true;
            $("#phone_anchor").prop('href', 'tel:+14384966886');
            $("#phone_anchor").removeAttr('data-target');
            $("#phone_anchor").removeAttr('data-toggle');

            // add no pointer to buttons. 
            $('#services button,#screen-method button').removeClass('selected-button');
            $('#services button,#screen-method button').css('cursor', 'default');
            // stop carousels 
            $.each(carousels, function(key, value) {
                value.stop();
            });

            $('#screen-method button').unbind('click');
            $('#services button').unbind('click');
            $('#team button').unbind('click');
            $('.services-click,.method-click,.team-click').unbind('click');
            clearInterval(refreshIntervalId);
            setBarGraph();
        },

        match: function() {
        	 CANVAS_RATIO = 0.5;
            $("#phone_anchor").prop('href', '#');
            $("#phone_anchor").attr({
                "data-target": '#telCinc',
                "data-toggle": 'modal'
            });

            if (mediaSwitch) {
                $.each(carousels, function(key, value) {
                    if (typeof value !== "undefined") {
                        value.start();
                    }
                });
                clearInterval(refreshIntervalId);
                setBarGraph();
            }

            $('#services button,#screen-method button').css('cursor', 'pointer');

            $('#screen-method button').on('click', function() {
                selectButton('screen-method', this);
            });

            $('#services button').on('click', function() {
                selectButton('services', this);
            });

            $('#team button').on('click', function() {
                selectButton('team', this);
            });

            $('.services-click,.method-click,.team-click').on('click', function(event) {
                var targetId = event.target.id;
                var sectionId = $(this).closest('.container-fluid').prop('id');
                //    changeBgColor(sectionId,targetId);
                showPanel(sectionId, targetId);
            });
        }
    });
}

function queryMediaState() {
  var size = parseInt($('#media-state').css('font-size'),10);
  var site_shape;
  if (size === 1) {
  	site_shape = "MOBILE";
  } else if (size === 2) {
  	site_shape = "TABLET-PORTRAIT";
  } else if (size === 3) {
  	site_shape = "TABLET-LANDSCAPE";
  } else if (size === 4) {
  	site_shape = "DESKTOP-LG";
  } else {
  	site_shape = "DESKTOP-WIDE";
  }
  return site_shape;
}
////////////////////////////////////////////////////////////////////////
// Bar Graph
////////////////////////////////////////////////////////////////////////

var graph, refreshIntervalId, graphCanvasId;

function setBarGraphCtx(canvasId) {
    var w, h;
    var canvas = document.getElementById(canvasId);
    graphCanvasId = canvasId;
    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    var selector = '#' + canvasId;

    if (canvasId === 'screen-canvas') {
        w = 0.4 * $('#screen-services').width();
        h = CANVAS_RATIO * $('#screen-services').height();
    } else {
        w = 0.8 * $('#services').width();
        h = 200;
    }

    $(selector).attr({
        width: w,
        height: h

    });
    barGraphCtx = canvas.getContext("2d");
}


function createBarGraph() {
    var lastOrientation = 'horizontal';

    if (typeof graph !== "undefined" && graphCanvasId !== 'excel-canvas') {
        lastOrientation = graph.orientation;
    }

    graph = new BarGraph(barGraphCtx);
    graph.margin = 5;
    graph.orientation = lastOrientation;
    graph.width = barGraphCtx.canvas.width;
    graph.height = barGraphCtx.canvas.height;

    graph.xAxisLabelArr = ["A", "B", "C", "D", "E", "F", "G"];
    graph.update([Math.random() * 10, Math.random() * 10,
        Math.random() * 10, Math.random() * 10,
        Math.random() * 10, Math.random() * 10,
        Math.random() * 10
    ]);

    refreshIntervalId = setInterval(function() {
        graph.update([Math.random() * 10, Math.random() * 10,
            Math.random() * 10, Math.random() * 10,
            Math.random() * 10, Math.random() * 10,
            Math.random() * 10
        ]);
    }, 4000);
}

/////////////////////////////////////////////////////////////////////////////
// Screen Panel Display 
/////////////////////////////////////////////////////////////////////////////

function prefix(id) {
    return id.split('-')[0].trim()
};

function fadeHtml(obj, direction, complete) {
    if (direction === 'in') {
        $(obj['selector']).fadeIn('linear', function() {
            if (complete) {
                complete();
            }
        });
    } else {
        $(obj.selector).fadeOut('linear', function() {
            complete(obj);
        });
    }
}

function parse(sectionId, buttonId, suffix) {
    var pre = prefix(buttonId);
    var o = {};

    o['id'] = '#' + pre + '-' + suffix;
    o['html'] = $(o['id']).html().trim();
    o['selector'] = '#' + sectionId + '-' + suffix;

    if (prefix(sectionId) === sectionId) {
        o['selector'] = '#screen-' + sectionId + '-' + suffix;
    }
    return o;
}

function showPanel(sectionId, buttonId) {
    var o = parse(sectionId, buttonId, 'text');
    var p = parse(sectionId, buttonId, 'photo');
    var buttonPrefix = prefix(buttonId);

    var htmlCallback = function(ob) {
        $(ob['selector']).html(ob['html']);
    }

    var excelCallBack = function(ob) {
        if (buttonPrefix === 'excel') {
            $(ob['selector']).html(ob['html']);
            $('#screen-canvas-wrapper').fadeIn();
        } else {
            $(ob['selector']).html(ob['html']);
        }
    }

    fadeHtml(o, 'out', htmlCallback);
    canvasHide = 'none' !== $('#screen-canvas-wrapper').css('display');

    if (canvasHide && sectionId === 'services') {
        $('#screen-canvas-wrapper').fadeOut(function() {
            fadeHtml(p, 'out', htmlCallback);
            fadeHtml(p, 'in');
        });
    } else {
        fadeHtml(p, 'out', excelCallBack);
        if (buttonPrefix !== 'excel') {
            fadeHtml(p, 'in');
        }
    }
    fadeHtml(o, 'in');
}
//////////////////////////////////////////////////////////////////////
// Waypoints handlers
//////////////////////////////////////////////////////////////////////

var bannerTriggers = [
    '#margin-top', '#services-banner',
    '#method-banner', '#project-banner',
    '#team-banner', '#social-ads'
];

var screenTriggers = [
    '#margin-top', '#screen-services',
    '#screen-method', '#screen-project',
    '#screen-team'
];


function carouselHandler(direction) {
    var waypoint = this.id;
    var panelDisplay = $('#' + waypoint + ' .content-block').css('display');

    if (panelDisplay == 'none' && direction == "down" && carousels[waypoint] === undefined) {
        initCarousel(waypoint);
    }
}

function sizeIcons(format) {
    var imgs = $('#social-icons img');
    var tkn;
    var modifier;

    if (format === 'mini') {
        tkn = '_';
        modifier = 'mini';
    } else {
        tkn = 'mini_';
        modifier = '';
    }

    $.each(imgs, function(k, v) {
        src = $('#' + v.id).attr('src').split(tkn);
        src = src[0] + modifier + '_150dpi.png';
        $('#' + v.id).attr('src', src);
    });
}

function navBarResizeHandler(direction) {
    var src;
    var fixedFlag = 'fixed' === $('#navbar').css('position');
    if (!fixedFlag)
        return;

    if (direction === "down") {
        $('#navbar').addClass('navbar-mini');
        $('#main-title h2').css('display', 'none');
        $('#navbar .container').css('border', 'none');
        sizeIcons('mini');
    } else {
        $('#navbar').removeClass('navbar-mini');
        sizeIcons('full');
        $('#main-title h2').css('display', 'block');
        $('#navbar .container').css({
            'border-top': '1px solid #ddd',
            'border-bottom': '1px solid #ddd'
        });
    }
}

///////////////////////////////////////////////////////////////////////////
// Scroll Tos registering
///////////////////////////////////////////////////////////////////////////


var hero_anchors = [
    '#top-hero-anchor', '#services-hero-anchor', '#method-hero-anchor', '#project-hero-anchor',
    '#team-hero-anchor', '#footer-hero-anchor'
];

var footer_anchors = [
    '#hero-footer-anchor', '#services-footer-anchor',
    '#team-footer-anchor', '#method-footer-anchor',
    '#top-footer-anchor', '#project-footer-anchor',
    '#contact-hero-anchor'
];

var main_nav_anchors = [
    '#service-nav-anchor', '#method-nav-anchor',
    '#team-nav-anchor', '#footer-nav-anchor'
];

var main_nav_slide_anchors = [
    '#service-nav-slide-anchor', '#method-nav-slide-anchor',
    '#team-nav-slide-anchor'
];

function registerScrollsTo() {

    $(main_nav_slide_anchors.join()).scrollTo({
        speed: 800,
        offset: 77,
        easing: 'easeInOutCubic'
    });

    $(main_nav_anchors.join()).scrollTo({
        speed: 800,
        offset: 0,
        easing: 'easeInOutCubic'
    });

    $(hero_anchors.join()).scrollTo({
        speed: 800,
        offset: 0,
        easing: 'easeInOutCubic'
    });

    $(footer_anchors.join()).scrollTo({
        speed: 800,
        offset: 0,
        easing: 'easeInOutCubic'
    });
}

/////////////////////////////////////////////////////////////////////////////
// Mouser event registering
/////////////////////////////////////////////////////////////////////////////

function resize() {
    // resize bubble canvas
    var w = CANVAS_WIDTH = $('#bubbles-wrapper').width();
    var h = CANVAS_HEIGHT = $('#bubbles-wrapper').height();

    if (context.canvas.width !== CANVAS_WIDTH || context.canvas.height !== CANVAS_HEIGHT) {
        context.canvas.width = CANVAS_WIDTH;
        context.canvas.height = CANVAS_HEIGHT;
        background.src = "../img/rainlong.jpg";
    }

    // resize bargraphcanvas 
    if ($('#excel-text').css('display') === 'none') {
        w = 0.4 * $('#screen-services').width();
        h = CANVAS_RATIO * $('#screen-services').height();
    } else {
        w = 0.8 * $('#services').width();
        h = 200;
    }

    if (barGraphCtx.canvas.width !== w || barGraphCtx.canvas.height !== h) {
        barGraphCtx.canvas.width = w;
        barGraphCtx.canvas.height = h;
        graph.width = barGraphCtx.canvas.width;
        graph.height = barGraphCtx.canvas.height;
    }
    setBannerHeight();
    setTeamTextOffset();
    centerScreenImg('#screen-services-visual', '#screen-services-text');
}


function centerScreenImg(visualId, refId) {
    var refHeight = parseInt($(refId).css('height'),10);
    var visualHeight = parseInt($(visualId).css('height'),10);
    var delta = refHeight - visualHeight;

    if (delta > 0) {
     $(visualId).css('margin-top', delta*0.5 + 'px');
   }
}

function selectButton(sectionId, buttonId) {
    var c = carousels[sectionId];
    var b = buttonSelected[sectionId];

    if (c !== undefined) {
        c.pause();
    }

    if (b !== undefined) {
        $(b).removeClass('selected-button');
    }

    buttonSelected[sectionId] = buttonId;
    $(buttonId).addClass('selected-button');
}

function resizeHandlers() {
    window.addEventListener('resize', resize, false);
}

/////////////////////////////////////////////////////////////////////
//  Initialization
//////////////////////////////////////////////////////////////////////

function setBarGraph() {
	var site_state = queryMediaState();
	if (site_state === 'TABLET-PORTRAIT') {
		CANVAS_RATIO = 0.5;
	} else {
		CANVAS_RATIO = 0.62;
	}
    if ($('#excel-photo').css('display') === 'none') {
        setBarGraphCtx('screen-canvas');
    } else {
        setBarGraphCtx('excel-canvas');
    }
    createBarGraph();
}

function initWayPoints() {

    $('#services,#screen-method').waypoint(carouselHandler, {
        offset: '50%'
    });

    $('#team').waypoint(function(direction) {
        var length = $('#screen-team-photo').html().trim().length;

        if (direction === "down" && length === 0) {
            showPanel('team', 'nic-button');
        }
    }, {
        offset: '50%'
    });

    $('#services-banner').waypoint(navBarResizeHandler, {
        offset: '50%'
    });
}

function initDrops() {
    // Global variables: 
    REFRESH_RATE = 40;
    t = 1; // current time step
    MAX_BUBBLES = 90;
    // Array storing all bubble objects 
    background = new Image();

    background.src = "../img/rainlong.jpg";

    // Create canvas and context objects
    canvas = document.getElementById('bubbles');

    var selector = '#bubbles';
    var w = $('#bubbles-wrapper').width();
    var h = $('#bubbles-wrapper').height();

    $(selector).attr({
        width: w,
        height: h
    });

    CANVAS_WIDTH = w;
    CANVAS_HEIGHT = h;
    context = canvas.getContext('2d');
    context.drawImage(background, 0, 0);
    // Call the draw() function at the specified refresh interval
    bubbles = new Array(MAX_BUBBLES);
    for (var i = 0; i < MAX_BUBBLES; i++) {
        bubbles[i] = new Bubble();
    }
    setInterval(drawDrops, REFRESH_RATE);
}


function setBannerHeight() {
    var banners = ['#services-banner', '#method-banner',
        '#team-banner', '#project-banner'
    ];
    var bannerHeight = parseInt($('.banner').css('height'), 10);
    var textHeight;
    var selector;

    for (var i = 0; i < banners.length; i++) {
        selector = banners[i] + ' ' + '.row:first-child';
        textHeight = parseInt($(selector).css('height'), 10);
        selector = banners[i] + ' ' + '.v-long-line';
        // subtract 30px from line height because of box preceding 
        $(selector).css({
            'height': (bannerHeight - textHeight - 30) + 'px'
        });
    }
}

function setTeamTextOffset() {

    /*    var photoHeight = parseInt($('#screen-team-photo').css('height'), 10);
    $('#screen-team-text p').css({
        'margin-top': ((photoHeight) * 0.1) + 'px'
    });
*/
}

function setResponsiveLine(id) {
    var offset = $(id).offset();
    var windowHeight = $(window).height();
    var boxHeight = parseInt($(id + ' a').css('height'), 10);

    var delta = windowHeight - (offset.top + boxHeight);
    if (delta > 0) {
        $(id + ' .responsive-line').css({
            'height': delta + 'px'
        });
    } else {
        $(id + ' .responsive-line').css({
            'height': '80px'
        });
    }
}

function init() {
    setResponsiveLine('#main-nav-1');
    setBannerHeight();
    initSlider();
    initWayPoints();
    registerScrollsTo();
    resizeHandlers();
    setBarGraph();
    registerMediaCallbacks();
    initDrops();
    $('body').imagesLoaded(function() {
        display();
    });
}

function detectIE(callback) {
    'use strict';
    // Detecting IE
    var oldIE;
    if ($('html').is('.lt-ie9')) {
        oldIE = true;
    }
    if (oldIE) {
        // do nothing which will prevent content from being shown 
    } else {
        callback();
    }
}

function display() {
    var callback = function() {
        $('#loader').css('display', 'none');
        $('#gif-spinner').css('display', 'none');
        $('#main').removeClass('invisible');
    };
    detectIE(callback);
}

// on document ready... 
$(function() {
    var callback = function() {
        $('#screen-canvas-wrapper').fadeOut(function() {
            init();
        });
    }
    detectIE(callback);
});
