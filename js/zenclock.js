;(function ($, window, document, undefined) {

    /*global jQuery, document, window, setInterval, clearInterval*/

    'use strict';

    var pluginName = 'zenclock';

    var _default = {};

    _default.settings = {
        injectStyle: true,

        secondColor: '#000',
        minuteColor: '#000',
        hourColor: '#000',
        dotColor: '#555',

        borderColor: '#000',
        borderStyle: 'double',
        borderWidth: '4px',
        borderRadius: '500px',

        showTicks: true,
        highlightTickColor: '#000',
        highlightTickWidth: 2,
        tickColor: '#000',
        tickWidth: 1,

        background: 'none',

        font: '12px Arial',

        smoothSeconds: false,
        smoothMinutes: true,
        smoothHours: true
    };

    var Clock = function (element, options) {

        this.element = element;
        this.$element = $(element);
        this.elementId = element.id;
        this.styleId = this.elementId + '-style';

        this.ctx = this.element.getContext('2d');
        this.radius = this.element.height > this.element.width ? this.element.width : this.element.height;

        this.init(options);

        return {

            // Options (public access)
            options: this.options,

            // Initialize / destroy methods
            init: $.proxy(this.init, this),
            remove: $.proxy(this.remove, this),

            // start/stop methods
            start: $.proxy(this.start, this),
            stop: $.proxy(this.stop, this),
            toggleRunning: $.proxy(this.toggleRunning, this)
        };
    };

    Clock.prototype.init = function(options) {
        this.options = $.extend({}, _default.settings, options);

        this.destroy();
        this.injectStyle();
        this.render();
        this.start();

        this.initialized = true;
    };

    Clock.prototype.toggleRunning = function() {
        if (this.running) this.stop(); else this.start();
    };

    Clock.prototype.stop = function() {
        if(this.running) {
            clearInterval(this.interval);
            this.running = false;
        }
    };

    Clock.prototype.start = function() {
        if(!this.running) {
            var clock = this;
            this.interval = setInterval(function() {
                clock.render();
            }, 100);
            this.running = true;
        }
    };

    Clock.prototype.render = function() {

        var d = new Date();

        var seconds = d.getSeconds();
        var minutes = d.getMinutes();
        var hours = d.getHours();

        if (this.options.smoothSeconds) seconds += d.getMilliseconds()/1000;
        if (this.options.smoothMinutes) minutes += seconds/60;
        if (this.options.smoothHours) hours += minutes/60;

        // calculate degrees
        seconds = seconds * 6;
        minutes = minutes * 6;
        hours = hours * 30;

        // set size to minimum of width/height
        var size = this.radius;

        var width = this.element.width;
        var height = this.element.height;

        this.ctx.clearRect(0,0,width,height);  // clears rectangle after each move

        // Draw the tick marks. Every 5th one is a big one
        if(this.options.showTicks) {
            for (var i = 0; i < 60; i++) {
                if(i % 5 === 0) {
                  this.radialLineAtAngle(i/60.0, true);
                } else {
                  this.radialLineAtAngle(i/60.0, false);
                }
            }
        }

        this.ctx.save();
        this.ctx.translate(width/2, height/2);
            this.ctx.scale(0.45,0.45);   // Changes Scale
            this.ctx.rotate(-Math.PI/2);

            // paint second indicator
            this.ctx.save();
                this.ctx.rotate((Math.PI/180) * seconds); // last number is degrees
                this.ctx.strokeStyle = this.options.secondColor;
                this.ctx.fillStyle = this.options.secondColor;
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.moveTo(-10,0);
                this.ctx.lineTo(size,0);
                this.ctx.stroke();
            this.ctx.restore();

            // paint minute indicator
            this.ctx.save();
                this.ctx.rotate((Math.PI/180) * minutes); // last number is degrees
                this.ctx.strokeStyle = this.options.minuteColor;
                this.ctx.fillStyle = this.options.minuteColor;
                this.ctx.lineWidth = 6;
                this.ctx.beginPath();
                this.ctx.moveTo(-10,0);
                this.ctx.lineTo(size - (0.3 * size),0);
                this.ctx.stroke();
            this.ctx.restore();

            // paint hour indicator
            this.ctx.save();
                this.ctx.rotate((Math.PI/180) * hours); // last number is degrees
                this.ctx.strokeStyle = this.options.hourColor;
                this.ctx.fillStyle = this.options.hourColor;
                this.ctx.lineWidth = 6;
                this.ctx.beginPath();
                this.ctx.moveTo(-10,0);
                this.ctx.lineTo(size - (0.5 * size),0);
                this.ctx.stroke();
            this.ctx.restore();

            // paint dot
            this.ctx.save();
                this.ctx.fillStyle = this.options.dotColor;
                this.ctx.arc(0,0,3,0,Math.PI*2,true);
                this.ctx.fill();
            this.ctx.restore();
        this.ctx.restore();


        // draw labels
        this.ctx.save();
            this.ctx.font = this.options.font;
            this.ctx.textAlign = 'center';

            // write 12
            this.ctx.save();
                this.ctx.translate(width/2, 0);
                this.ctx.fillText('12', 0, 15);
            this.ctx.restore();

            // write 3
            this.ctx.save();
                this.ctx.translate(width, height/2);
                this.ctx.fillText('3', -10, 0);
            this.ctx.restore();

            // write 6
            this.ctx.save();
                this.ctx.translate(width/2, height);
                this.ctx.fillText('6', 0, -5);
            this.ctx.restore();

            // write 9
            this.ctx.save();
                this.ctx.translate(0, height/2);
                this.ctx.fillText('9', 10, 0);
            this.ctx.restore();
        this.ctx.restore();

    };

    Clock.prototype.radialLineAtAngle = function(angleFraction, highlight) {
        this.ctx.save();
        this.ctx.translate(this.element.width/2, this.element.height/2);
        this.ctx.rotate(Math.PI * (2.0 * angleFraction - 0.5));

        if(highlight) {
            this.ctx.lineWidth = this.options.highlightTickWidth;
            this.ctx.strokeStyle = this.options.highlightTickColor;
        }
        else {
            this.ctx.lineWidth = this.options.tickWidth;
            this.ctx.strokeStyle = this.options.tickColor;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(0,this.radius-130);
        this.ctx.lineTo(0,this.radius-125);
        this.ctx.stroke();
        this.ctx.restore();
    };

    // Add inline style into head
    Clock.prototype.injectStyle = function () {
        if (this.options.injectStyle && !document.getElementById(this.styleId)) {
            $('<style type="text/css" id="' + this.styleId + '"> ' + this.buildStyle() + ' </style>').appendTo('head');
        }
    };

    // Construct clock style based on user options
    Clock.prototype.buildStyle = function () {

        var style = '#' + this.elementId + '{';

        if (this.options.background) {
            style += 'background:' + this.options.background + ';';
        }

        if (this.options.borderColor && this.options.borderStyle && this.options.borderWidth) {
            style += 'border: ' + this.options.borderWidth + ' ' + this.options.borderStyle + ' ' + this.options.borderColor + ';';
        }

        if (this.options.borderRadius) {
            style += 'border-radius: ' + this.options.borderRadius + ';';
        }

        style += '}';

        return style;
    };

    Clock.prototype.destroy = function() {
        if (!this.initialized) return;

        this.stop();

        // Reset this.initialized flag
        this.initialized = false;
    };

    Clock.prototype.remove = function() {
        this.destroy();
        $.removeData(this, pluginName);
        $('#' + this.styleId).remove();
    };

    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    // Prevent against multiple instantiations,
    // handle updates and method calls
    $.fn[pluginName] = function (options, args) {

        var result;

        this.each(function () {
            var _this = $.data(this, pluginName);
            if (typeof options === 'string') {
                if (!_this) {
                    logError('Not initialized, can not call method : ' + options);
                }
                else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
                    logError('No such method : ' + options);
                }
                else {
                    if (!(args instanceof Array)) {
                        args = [ args ];
                    }
                    result = _this[options].apply(_this, args);
                }
            }
            else if (typeof options === 'boolean') {
                result = _this;
            }
            else {
                $.data(this, pluginName, new Clock(this, $.extend(true, {}, options)));
            }
        });

        return result || this;
    };

})(jQuery, window, document);
