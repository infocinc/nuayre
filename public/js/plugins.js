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
//////////////////////////////////////////////////////////////////////
// Service, Method Slider 
//////////////////////////////////////////////////////////////////////

var carousels = {};
var buttonSelected = {};

var CAROUSEL_WAIT = minToMillis(1);
var CAROUSEL_TIMEOUT = secToMillis(30);
// accordeon collapse handler 

function secToMillis(s) {
    return s * 1000
};

function minToMillis(m) {
    return m * secToMillis(60)
};


var Carousel = function Carousel() {
    this.active = true;
    this.currIndex = 0;
    this.prevIndex = -1;
    this.items;
    this.timeout;
    this.timerId;
    this.id;
};

Carousel.prototype.pause = function() {
    var that = this;
    this.stop();
    this.timerId = setTimeout(function() {
        that.start();
    }, CAROUSEL_WAIT);
}

Carousel.prototype.stop = function() {
    this.active = false;
    var id = this.id;
    //    var currButton = this.items.eq(this.prevIndex);
    if (typeof buttonSelected[id] !== "undefined") {
        $(buttonSelected[this.id]).removeClass('selected-button');
    }
    //    $(currButton).removeClass('selected-button');
    clearTimeout(this.timerId);
}

Carousel.prototype.start = function() {
    var id = this.id;
    var currIndex = 0;
    this.active = true;
    $.each(this.items, function(key, value) {
        if (value === buttonSelected[id]) {
            currIndex = key + 1;
            return false;
        }
    });
    this.prevIndex = currIndex - 1;
    if (currIndex == this.items.length) {
        currIndex = 0;
    }
    this.currIndex = currIndex;

    if (typeof buttonSelected[id] !== "undefined") {
        $(buttonSelected[id]).removeClass('selected-button');
    }

    nextItem(this.id);
}

function initCarousel(id, timeout) {
    var c = new Carousel();
    timeout = typeof timeout !== 'undefined' ? timeout : CAROUSEL_TIMEOUT;
    c.timeout = timeout;
    c.items = $('#' + id + ' ' + 'button');
    c.id = id;
    carousels[id] = c;
    c.start();
}

function nextItem(id) {
    var c = carousels[id];
    var currButton;

    if (c.prevIndex > -1) {
        currButton = c.items.eq(c.prevIndex);
        $(currButton).removeClass('selected-button');
    }

    currButton = c.items.eq(c.currIndex);
    $(currButton).addClass('selected-button');
    buttonSelected[id] = currButton;
    showPanel(id, currButton.prop('id'));

    c.prevIndex = c.currIndex;
    c.currIndex++;

    if (c.currIndex == c.items.length) {
        c.currIndex = 0;
    }

    c.timerId = setTimeout(function() {
        nextItem(id)
    }, c.timeout);
}

////////////////////////////////////////////////////////////////////////////
// img slider
////////////////////////////////////////////////////////////////////////////

var rollodex_curr = 1;
var rollodex_length;

function initSlider() {
    rollodex_length = $('.slider .slide').length;
    setTimeout(nextSlide, 5000);
}

function getSlideSelector(n) {
    var selector = '.slider  .slide:nth-child(' + n + ')';
    return selector;
}

function hideSlide(n) {
    var selector = getSlideSelector(n);

    if ((n + 1) > rollodex_length) {
        rollodex_curr = n = 0;
    }

    showSlide(n + 1);
    setTimeout(function() {
        $(selector).animate({
            'opacity': '0'
        }, 1000, function() {
            $(selector).addClass('hide');
        });
    }, 20);
}

function showSlide(n) {

    var selector = getSlideSelector(n);
    $(selector).css('opacity', '0');
    $(selector).removeClass('hide');
    $(selector).animate({
        'opacity': '1'
    }, 1000);
    //    $(selector).fadeIn();
}

function nextSlide() {
    hideSlide(rollodex_curr);
    rollodex_curr = rollodex_curr + 1;
    setTimeout(nextSlide, 5000);
}


////////////////////////////////////////////////////////////////////////
// Drops
////////////////////////////////////////////////////////////////////////

/*!
 * bubbles.js
 * Orignally Written by Tara Mathers, 2010
 * ---------------------------------------------------------------------
 * Modifications by CINC, 2014
 */

function Bubble() {
    this.x = Math.floor(Math.random() * CANVAS_WIDTH);
    this.y = Math.floor(Math.random() * (CANVAS_HEIGHT));
    this.radius = 5 + Math.floor(Math.random() * 5);

    this.direction;
    if (Math.random() * 2 >= 1)
        this.direction = 0;
    else this.direction = 1;

    //this.amplitude = Math.round(this.radius / 9 * 5 + 2 * Math.random());
    this.velocity = (4 / (this.radius + 0.1));
    this.amplitude = 20 + Math.round(this.velocity * 20);

}

/******************************************************
 * draw()
 * draws each bubble at every frame
 ******************************************************/

function drawDrops() {
    var paint = $('#bubbles-wrapper').isOnScreen();
    if (!paint) {
        return;
    }

    for (var i = 0; i < bubbles.length; i++) {
        // Create a new bubble if one has gone off the screen
        if (bubbles[i].y - bubbles[i].radius > CANVAS_HEIGHT) {
            bubbles[i].x = Math.floor(Math.random() * CANVAS_WIDTH);
            bubbles[i].y = -Math.floor(Math.random() * CANVAS_HEIGHT * 0.1);
            bubbles[i].radius = 5 + Math.floor(Math.random() * 5);
            bubbles[i].velocity = (4 / (bubbles[i].radius + 0.1));
            bubbles[i].amplitude = 20 + Math.round(bubbles[i].velocity * 10);
        }
        if (t % bubbles[i].amplitude == 0) {

            if (bubbles[i].direction == 0)
                bubbles[i].direction = 1;
            else
                bubbles[i].direction = 0;
        }
        if (bubbles[i].direction == 0)
            bubbles[i].x -= 0.01;
        else
            bubbles[i].x += 0.01;
        bubbles[i].y += bubbles[i].velocity;
    }

    // Clear the previous canvas state
    context.drawImage(background, 0, 0);
    // Draw bubbles
    for (var i = 0; i < bubbles.length; i++) {

        context.lineWidth = 1;

        gradObj = context.createRadialGradient(bubbles[i].x,
            bubbles[i].y + bubbles[i].radius / 2.5, bubbles[i].radius / 1.8,
            bubbles[i].x, bubbles[i].y,
            bubbles[i].radius);

        gradObj.addColorStop(0, "rgba(255, 255, 255, .7)");
        gradObj.addColorStop(1, "rgba(220, 225, 223, .7)");

        context.fillStyle = gradObj;
        context.beginPath();
        context.arc(bubbles[i].x, bubbles[i].y, bubbles[i].radius, 0, Math.PI * 2, true);
        context.fill();
        context.strokeStyle = "rgba(200,205,203,.2)";
        context.stroke();
    }
    t++;
}

/*! Copyright 2011 William Malone (www.williammalone.com)
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
// Modifications by CINC , 2014 
*/

function BarGraph(ctx) {

    // Private properties and methods
    var that = this;
    var startArr;
    var endArr;
    var looping = false;
    var barMax = 0;

    // Loop method adjusts the height of bar and redraws if neccessary
    var loop = function() {

        var delta;
        var animationComplete = true;
        var paintFlag;
        // Boolean to prevent update function from looping if already looping
        looping = true;

        if ($('#excel-photo').css('display') === 'none') {
            paintFlag = $('#screen-services').isOnScreen();
        } else {
            paintFlag = $('#excel-photo').isOnScreen();
        }

        if (!paintFlag) {
            setTimeout(loop, that.animationInterval / that.animationSteps);
            return;
        }

        // For each bar
        for (var i = 0; i < endArr.length; i += 1) {
            // Change the current bar height toward its target height
            delta = (endArr[i] - startArr[i]) / that.animationSteps;
            that.curArr[i] += delta;
            // If any change is made then flip a switch
            if (delta > 0.01) {
                animationComplete = false;
            }
        }

        // If no change was made to any bars then we are done
        if (animationComplete) {
            looping = false;
        } else {
            // Draw and call loop again
            draw(that.curArr);
            this.timerId = setTimeout(loop, that.animationInterval / that.animationSteps);
        }
    };

    // Draw method updates the canvas with the current display

    var draw = function(arr) {

        var numOfBars = arr.length,
            barWidth,
            barHeight,
            border = 2,
            ratio,
            maxBarHeight,
            largestValue,
            graphAreaX = 0,
            graphAreaY = 0,
            graphAreaWidth = that.width,
            graphAreaHeight = that.height,
            i;


        // Draw the background color
        ctx.fillStyle = that.backgroundColor;
        ctx.fillRect(0, 0, that.width, that.height);

        // If x axis labels exist then make room    
        if (that.xAxisLabelArr.length) {
            graphAreaHeight -= 40;
        }

        // Calculate dimensions of the bar
        if (that.orientation === 'horizontal') {
            barWidth = graphAreaWidth / numOfBars - that.margin * 2;
            maxBarHeight = graphAreaHeight - 25;
        } else {
            barWidth = graphAreaHeight / numOfBars - that.margin * 2;
            maxBarHeight = graphAreaWidth - 40;
        }

        // Determine the largest value in the bar array
        var largestValue = barMax = Math.max.apply(Math, arr);
        // For each bar
        for (i = 0; i < arr.length; i += 1) {

            // Set the ratio of current bar compared to the maximum
            if (that.maxValue) {
                ratio = arr[i] / that.maxValue;
            } else {
                ratio = arr[i] / largestValue;
            }

            barHeight = ratio * maxBarHeight;

            if (barHeight > border * 2) {
                ctx.fillStyle = that.colors[i % that.colors.length];


                if (that.orientation === 'horizontal') {
                    ctx.fillRect(that.margin + i * that.width / numOfBars + border,
                        graphAreaHeight - barHeight + border,
                        barWidth - border * 2,
                        barHeight - border * 2);
                } else {
                    ctx.fillRect(15,
                        that.margin + i * that.height / numOfBars,
                        barHeight,
                        barWidth);
                }
            }

            // Write bar value
            ctx.fillStyle = "#333";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "center";
            // Use try / catch to stop IE 8 from going to error town
            try {
                if (that.orientation === 'horizontal') {
                    ctx.fillText(parseInt(arr[i], 10),
                        i * that.width / numOfBars + (that.width / numOfBars) / 2,
                        graphAreaHeight - barHeight - 10);
                } else {
                    ctx.fillText(parseInt(arr[i], 10),
                        barHeight + 25,
                        i * that.height / numOfBars + (that.height / numOfBars) / 2,
                        graphAreaWidth - barHeight - 10);
                }
            } catch (ex) {}

            // Draw bar label if it exists
            if (that.xAxisLabelArr[i]) {

                // Use try / catch to stop IE 8 from going to error town

                ctx.fillStyle = "#333";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                try {
                    if (that.orientation === 'horizontal') {
                        ctx.fillText(that.xAxisLabelArr[i],
                            i * that.width / numOfBars + (that.width / numOfBars) / 2,
                            that.height - 10);
                    } else {
                        ctx.fillText(that.xAxisLabelArr[i], 5,
                            i * that.height / numOfBars + (that.height / numOfBars) / 2,
                            that.width - 10);
                    }
                } catch (ex) {}
            }
        }
    };

    // Public properties and methods
    this.width;
    this.height;
    this.timerId;
    this.maxValue;
    this.margin = 5;
    this.colors = ["#354774", "#C0392B", "#27AE60", "#E5C454"];
    this.curArr = [];
    this.backgroundColor = "#fff";
    this.xAxisLabelArr = [];
    this.yAxisLabelArr = [];
    this.animationInterval = 400;
    this.animationSteps = 20;
    this.orientation;
    this.interrupt = 'false';

    // Update method sets the end bar array and starts the animation
    this.update = function(newArr) {
        // If length of target and current array is different 
        if (that.curArr.length !== newArr.length) {
            that.curArr = newArr;
            draw(newArr);
        } else {
            if (!looping) {
                startArr = that.curArr;
                endArr = newArr;
                loop();
            }
        }
    };
}
