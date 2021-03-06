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
var GridRowActive;



//////////////////////////////////////////////////////////////////////////////////
// Enquire registering
//////////////////////////////////////////////////////////////////////////////////
// The telephone icon has two different meanings depending on device type:
//   desktop (992px and larger) : bring up a modal box with contact info
//   tablet and mobile : launches a phone call

function registerMediaCallbacks() {
    mediaSwitch = false;


    enquire.register("screen and (max-width:767px)", {
        match: function() {
            $.getScript('js/vendor/bootstrap-touch-carousel.min.js', function(data, textStatus, jqxhr) {
                console.log(jqxhr.status);
                console.log(textStatus);
            });
        },
        unmatch: function() {}
    });

    enquire.register("screen and (min-width:768px)", {

        unmatch: function() {
            mediaSwitch = true;
            $('.expand-box').addClass('hide');
        },

        match: function() {
            $('.collapse').collapse('hide');
        }
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


///////////////////////////////////////////////////////////////////////////
// Scroll Tos registering
///////////////////////////////////////////////////////////////////////////


var bar_anchors = [
    '#home-bar-anchor', '#product-bar-anchor', '#apropos-bar-anchor',
    '#store-bar-anchor', '#contact-bar-anchor'
];


var main_nav_anchors = [
    '#apropos-nav-anchor', '#product-nav-anchor', '#store-nav-anchor'
];


function registerScrollsTo() {
    $(bar_anchors.join()).scrollTo({
        speed: 800,
        offset: 0,
        easing: 'easeInOutCubic'
    });

    $(main_nav_anchors.join()).scrollTo({
        speed: 800,
        offset: 0,
        easing: 'easeInOutCubic'
    });

}

/////////////////////////////////////////////////////////////////////////////
// Mouser event registering
/////////////////////////////////////////////////////////////////////////////


function transition(wrapper, alter, kind) {
    if (kind === 'fade') {
        $(wrapper).fadeOut(200, function() {
            alter();
        });
        $(wrapper).fadeIn(200);
    } else {
        alter();
    }
}

function thumbnailHandler(that) {
    var product = $(that).closest('.product-visual');
    var thumbSelected = $(that).children('img').attr('src');
    var img = $(product).find('.product-photo img');

    var replace = thumbSelected.split('_');

    $(product).find('.thumbnail-sm.active').removeClass('active');
    $(that).addClass('active');

    var alter = function() {
        $(img).attr('src', replace[0] + '_big.jpg');
    };

    transition($(product).children('.product-photo'), alter);
}


function collapseHandlers() {

    $('#navbar-collapse').on('show.bs.collapse', function() {
        $('#apropos-nav-anchor').addClass('hide');
    });
    $('#navbar-collapse').on('hidden.bs.collapse', function() {
        $('#apropos-nav-anchor').removeClass('hide');
    });
}


function registerClickHandlers() {

    $('.thumbnail-sm').on('mouseover', function() {
        thumbnailHandler(this)
    });


    $('#product-grid  .row').on('click', function(e) {

        if (!e) e = window.event;
        var mediaState = queryMediaState();

        if ($(this).hasClass('expand-box')) {
            return;
        };
        var ge = $(e.target).closest('.grid-element');
        if ($(ge).hasClass('mobile-hide')) {
            return;
        }

        var productImg = $(ge).find('.product-photo').html();
        var thumbnails = $(ge).find('.thumbnail-sm-wrapper').html();
        var productBody = $(ge).find('.product-body').html();
        var boxWidth = parseInt($(ge).css('width'), 10);
        if (mediaState === "MOBILE") {

            var o = $(ge).find('.product-panel .product-body');

            if ($(e.target).parent().hasClass("thumbnail-sm")) {
                return;
            };
            $(ge).addClass('active');
            setTimeout(function() {
                $(ge).removeClass('active')
            }, 100);

            $(o).collapse('toggle');

            // toggle arrow 
            var arrow = $(ge).find('.arrow-down span');
            if ($(arrow).hasClass('glyphicon-chevron-down')) {
                $(arrow).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            } else {
                $(arrow).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }


        } else {
            var expandBox = $(this).next();
            var offset = -36 + boxWidth / 2 + boxWidth * ($(ge).index());
            var retracted = 'none' === $(expandBox).css('display') ? true : false;

            $(expandBox).find('.product-photo').html(productImg);
            $(expandBox).find('.thumbnail-sm-wrapper').html(thumbnails);
            $(expandBox).find('.product-body').html(productBody);
            var height = parseInt($(expandBox).css("height"), 10);

            if (retracted) {
                $('.expand-box').addClass('hide'); // retract all other ones if it applies
                $(expandBox).removeClass('hide');
                height = parseInt($(expandBox).css("height"), 10);
            }
            $('.arrow-indicator').css('left', offset + 'px');
            $('html,body').stop().animate({
                scrollTop: $(expandBox).offset().top - ($(window).height() - height) / 2
            }, 500, "easeOutCubic");

        }

        $('.thumbnail-sm').on('mouseover', function() {
            thumbnailHandler(this)
        });
    });

    $('.product-panel .product-body').on('shown.bs.collapse', function() {
        var height = parseInt($(this).css("height"), 10);

        $('html,body').stop().animate({
            scrollTop: $(this).offset().top - 0.75 * $(window).height()
        }, 500, "easeOutCubic");
    })


    $('#product-grid .close').on('click', function() {
        var row = $(this).closest('.row');
        var prev = $(row).prev();
        $(row).addClass('hide');

        var height = parseInt($(prev).css('height'), 10);

        $('html,body').stop().animate({
            scrollTop: $(row).prev().offset().top - ($(window).height() - height) / 2
        }, 500, "easeOutCubic");
    });


}
/////////////////////////////////////////////////////////////////////
//  Initialization
//////////////////////////////////////////////////////////////////////

function setPendulumPosition() {
    var contactBarPos = $('#contact-bar').offset();

    $('#zen-wrapper').css({
        'top': contactBarPos.top + $('#contact-bar').height() + 'px'
    });
    $('#zen-wrapper').removeClass('hide');
}



function setFaceBookPageLink() {
    var site_state = queryMediaState();

    if (site_state === 'MOBILE') {
        $('#footer-fbook-anchor').attr('href', "https://m.facebook.com/pages/NuAyre");
    }
}



var carousel_paused = true;

function initWayPoints() {
    $('#apropos').waypoint(function(direction) {
        if ((direction === "down") && (carousel_paused)) {
            $('#carousel-nuayre').carousel();
            carousel_paused = false;
        }
    });

    $('#products').waypoint(function(direction) {
        if (direction === "down") {
            $('#fixed-icons > div').removeClass('invisible');
        } else {
            $('#fixed-icons > div').addClass('invisible');
        }
    });
}


function arrowUpNoHashTag() {
    $('#arrow-up-anchor').on('click', function(e) {
        e.preventDefault();
        var loc = window.location;
        window.location.href = '#';
        if (history.pushState) {
            history.pushState("", document.title, loc.pathname);
        }
    });
}

function resize() {
    var screenType = queryMediaState();
    if (screenType !== "MOBILE") {
        var minh = $(window).height();
        $('#apropos').css('height', minh + 'px');
        var ch = parseInt($('#carousel-nuayre').css('height'),10);
        var padding = minh - ch;
        $('#apropos').css('padding-top',Math.round(padding/2) + 'px');
    }
}

function resizeHandlers() {
    window.addEventListener('resize', resize, false);
}


function init() {
    registerScrollsTo();
    registerClickHandlers();
    collapseHandlers();
    resizeHandlers();
    $('.collapse').collapse({
        toggle: false
    }); // hack to get collapse working properly
    arrowUpNoHashTag();
    registerMediaCallbacks();
    initWayPoints();
    setFaceBookPageLink();
    document.addEventListener("touchstart", function() {}, false); // allow css active to work in safari
}

function detectIE(callback) {
    'use strict';
    // Detecting IE
    var oldIE;
    if ($('html').is('.lt-ie9')) {
        oldIE = true;
    } else if ($('html').is('.lt-ie10')) {
        $('#bells-wrapper').css('opacity', '0');
    }
    callback();
}

// on document ready... 
$(function() {
    detectIE(init);
});
