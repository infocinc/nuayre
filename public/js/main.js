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
        unmatch: function() {},
        match: function() {}
    });

    enquire.register("screen and (min-width:768px)", {

        unmatch: function() {
            mediaSwitch = true;
        },

        match: function() {}
    });
}

function queryMediaState() {
    var size = parseInt($('#media-state').css('font-size'), 10);
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



function carouselHandler(direction) {
    var waypoint = this.id;
    var panelDisplay = $('#' + waypoint + ' .content-block').css('display');

    if (panelDisplay == 'none' && direction == "down" && carousels[waypoint] === undefined) {
        initCarousel(waypoint);
    }
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


var bar_anchors = [
    '#home-bar-anchor', '#product-bar-anchor', '#apropos-bar-anchor', 
    '#store-bar-anchor', '#contact-bar-anchor'
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

    $(bar_anchors.join()).scrollTo({
        speed: 800,
        offset: -90,
        easing: 'easeInOutCubic'
    });

/*    $(main_nav_anchors.join()).scrollTo({
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
*/}

/////////////////////////////////////////////////////////////////////////////
// Mouser event registering
/////////////////////////////////////////////////////////////////////////////

function resize() {}


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


function transition(wrapper, alter, kind) {
    if (kind === 'fade') {
        $(wrapper).fadeOut(200,function() {
            alter();
        });
        $(wrapper).fadeIn(200);
    } else {
        alter();
    }
}

function registerClickHandlers() {
    $('.thumbnail-sm').on('mouseover', function() {
        var product = $(this).closest('.product-thumbnail');
        var thumbSelected = $(this).children('img').attr('src');
        var img = $(product).find('.product-img img');

        var replace = thumbSelected.split('_');

        $(product).find('.thumbnail-sm.active').removeClass('active');
        $(this).addClass('active');

        var alter = function() {
            $(img).attr('src', replace[0] + '_big.png');
        };

        transition($(product).children('.product-img'), alter);
        //      $(big_img).children().attr('src',$(this).children('img').attr('src'));
    });

}
/////////////////////////////////////////////////////////////////////
//  Initialization
//////////////////////////////////////////////////////////////////////


function initWayPoints() {}

function setPendulumPosition() {
  var contactBarPos = $('#contact-bar').offset();

  $('#zen-wrapper').css({
    'top': contactBarPos.top + $('#contact-bar').height() + 'px'
  });
  $('#zen-wrapper').removeClass('hide');
}

function init() {
    initWayPoints();
    registerScrollsTo();
    resizeHandlers();
    registerClickHandlers();
    registerMediaCallbacks();
    $('body').imagesLoaded(function() {
      //  setPendulumPosition();
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
    else if ($('html').is('.lt-ie10')) {
        $('#bells-wrapper').css('opacity','0');
    }
    if (oldIE) {
        // do nothing which will prevent content from being shown 
    } else {
        callback();
    }
}

function display() {
    var callback = function() {
        $('#main').removeClass('invisible')
    };
    detectIE(callback);
}

// on document ready... 
$(function() {
    var callback = function() {
        init();
    };
    detectIE(callback);
});
