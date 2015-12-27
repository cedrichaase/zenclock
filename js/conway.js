/**
 * The Cell class
 *
 * @param x
 * @param y
 * @param value
 * @returns {{value: *, x: *, y: *}}
 * @constructor
 */
var Cell = function (x, y, value) {

    this.init(x, y, value);

    return {
        value: this.value,

        toggleValue: this.toggleValue,

        x: this.x,
        y: this.y
    };
};

/**
 * Initialize cell
 *
 * @param x
 * @param y
 * @param value
 */
Cell.prototype.init = function(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
};

/**
 * Toggles the cell value
 */
Cell.prototype.toggleValue = function() {
    this.value = !this.value;
};;/**
 * The Grid class
 *
 * @param width
 * @param height
 * @returns {{width: *, height: *, matrix: *, neighbors: (Grid.getNeighbors|*), getCell: *, toggleCell: *}}
 * @constructor
 */
var Grid = function (width, height) {

    this.init(width, height);

    return {
        width: this.width,
        height: this.height,
        matrix: this.matrix,

        getNeighbors: this.getNeighbors,
        countNeighbors: this.countNeighbors,
        cellIsBorn: this.cellIsBorn,
        cellDies: this.cellDies,
        executeConway: this.executeConway,
        getCell: this.getCell,

        toggleCell: this.toggleCell
    };
};

/**
 * Initialize grid
 *
 * @param width
 * @param height
 */
Grid.prototype.init = function (width, height) {
    this.width = width;
    this.height = height;

    this.matrix = [];
    for(var column = 0; column < width; column++) {
        this.matrix[column] = [];
        for(var line = 0; line < height; line++) {
            this.matrix[column][line] = new Cell(column, line, false);
        }
    }
};

/**
 * Toggles Cell value
 *
 * @param x
 * @param y
 */
Grid.prototype.toggleCell = function(x, y) {
    this.getCell(x, y).toggleValue();
};

/**
 * Returns a Cell by grid coordinates
 *
 * @param x
 * @param y
 * @returns Cell
 */
Grid.prototype.getCell = function(x, y) {
    var cell = new Cell(0, 0, false);

    if (!(x < 0 || y < 0 || x >= this.width || y >= this.height))
        cell = this.matrix[x][y];

    return cell;
};

/**
 * Returns neighboring cells by given grid coordinates
 *
 * @param x
 * @param y
 * @returns {{topLeft: Cell, top: Cell, topRight: Cell, right: Cell, bottomRight: Cell, bottom: Cell, bottomLeft: Cell, left: Cell}}
 */
Grid.prototype.getNeighbors = function(x, y) {
    return {
        topLeft         : this.getCell(x-1,   y-1),
        top             : this.getCell(x,     y-1),
        topRight        : this.getCell(x+1,   y-1),
        right           : this.getCell(x+1,   y),
        bottomRight     : this.getCell(x+1,   y+1),
        bottom          : this.getCell(x,     y+1),
        bottomLeft      : this.getCell(x-1,   y+1),
        left            : this.getCell(x-1,   y)
    };
};

/**
 *
 * @param cell
 */
Grid.prototype.countNeighbors = function(cell) {
    var neighbors = this.getNeighbors(cell.x, cell.y);

    var count = 0;

    if(neighbors.top.value)
        count++;
    if(neighbors.bottom.value)
        count++;
    if(neighbors.left.value)
        count++;
    if(neighbors.right.value)
        count++;
    if(neighbors.topLeft.value)
        count++;
    if(neighbors.topRight.value)
        count++;
    if(neighbors.bottomLeft.value)
        count++;
    if(neighbors.bottomRight.value)
        count++;

    return count;
};

/**
 *
 * CONWAY FUNCTIONS
 *
 */

/**
 * Checks if a cell will die in the next generation
 *
 * @param cell
 * @returns {*|boolean}
 */
Grid.prototype.cellDies = function(cell) {
    var neighborCount = this.countNeighbors(cell);
    return cell.value && (neighborCount > 3 || neighborCount < 2);
};

/**
 * Check if cell will come alive in the next generation
 *
 * @param cell
 * @returns {boolean}
 */
Grid.prototype.cellIsBorn = function(cell) {
    var neighborCount = this.countNeighbors(cell);
    return (!cell.value) && neighborCount == 3;
};

/**
 *
 * @returns {Grid}
 */
Grid.prototype.executeConway = function() {
    var nextGen = $.extend(true, {}, this);

    var width = this.width;
    var height = this.height;

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
            var oldCell = this.getCell(x, y);
            var newCell = nextGen.getCell(x, y);

            if(!oldCell.value === true) {
                if(this.cellIsBorn(oldCell))
                    newCell.value = true;
            }
            else if(oldCell.value === true) {
                newCell.value = !this.cellDies(oldCell);
            }
        }
    }

    return nextGen;
};;;(function ($, window, document, undefined) {

    /*global jQuery, document, window, setInterval, clearInterval*/

    'use strict';

    var pluginName = 'conway';

    var _default = {};

    _default.settings = {
        injectStyle: true,

        gridColor: '#000',
        gridLineWidth: 1,

        hCells: 32,
        vCells: 24,

        borderColor: '#000',
        borderStyle: 'none',
        borderWidth: '4px',
        borderRadius: '0px',

        background: 'none',

        font: '12px Arial'
    };

    var Conway = function (element, options) {

        this.element = element;
        this.$element = $(element);
        this.elementId = element.id;
        this.styleId = this.elementId + '-style';

        this.ctx = this.element.getContext('2d');
        this.radius = this.element.height > this.element.width ? this.element.width : this.element.height;
        this.executing = false;

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
            toggleRunning: $.proxy(this.toggleRunning, this),
            execute: $.proxy(this.execute, this),
            toggleExecution: $.proxy(this.toggleExecution, this)
        };
    };

    Conway.prototype.init = function(options) {
        this.options = $.extend({}, _default.settings, options);

        this.destroy();
        this.grid = new Grid(this.options.hCells, this.options.vCells);
        this.injectStyle();
        this.render();
        this.addListeners();
        this.start();

        this.initialized = true;
    };

    Conway.prototype.toggleExecution = function(){
        this.executing = !this.executing;
    };

    Conway.prototype.toggleRunning = function() {
        if (this.running) this.stop(); else this.start();
    };

    Conway.prototype.stop = function() {
        if(this.running) {
            clearInterval(this.interval);
            this.running = false;
        }
    };

    Conway.prototype.start = function() {
        if(!this.running) {
            var conway = this;
            this.interval = setInterval(function() {
                conway.render();
            }, 100);
            this.running = true;
        }
    };

    Conway.prototype.render = function() {

        // set size to minimum of width/height
        var size = this.radius;

        var width = this.element.width;
        var height = this.element.height;

        this.ctx.clearRect(0, 0, width, height);  // clears rectangle after each move

        if(this.executing)
            this.execute();

        this.drawGrid(this.options.hCells, this.options.vCells, this.options.gridLineWidth, this.options.gridColor);

        this.drawBoolMatrix(this.grid.matrix);
    };

    /**
     *
     * @param e
     * @returns {{x: (number|*), y: (number|*)}}
     */
    Conway.prototype.getMouse = function(e) {
        var offset = this.$element.offset();
        var mx = e.pageX - offset.left;
        var my = e.pageY - offset.top;

        // We return a simple javascript object (a hash) with x and y defined
        return {x: mx, y: my};
    };

    /**
     * Maps DOM coordinates to grid coordinates
     *
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     */
    Conway.prototype.getCellByCoords = function(x, y) {
        var cellX = Math.floor(x / this.element.width * this.options.hCells);
        var cellY = Math.floor(y / this.element.height * this.options.vCells);

        return {x: cellX, y: cellY};
    };

    /**
     * Executes the conway algorithm
     */
    Conway.prototype.execute = function() {
        this.grid = this.grid.executeConway();
    };

    Conway.prototype.addListeners = function() {
        var _this = this;
        this.element.addEventListener('mousedown', function(e) {
            var mouse = _this.getMouse(e);
            var cell = _this.getCellByCoords(mouse.x, mouse.y);
            _this.grid.toggleCell(cell.x, cell.y);
        });
    };

    Conway.prototype.drawBoolMatrix = function(matrix) {
        for(var x = 0; x < matrix.length; x++) {
            for(var y = 0; y < matrix[x].length; y++) {
                if(matrix[x][y].value)
                    this.fillCell(x, y);
            }
        }
    };

    Conway.prototype.getRandomBoolMatrix = function(width, height) {

        var matrix = [];
        for(var x = 0; x < width; x++) {
            matrix[x] = [];
            for(var y = 0; y < height; y++) {
                matrix[x][y] = this.getRandomBool();
            }
        }

        return matrix;
    };

    /**
     * Returns a random boolean
     *
     * @returns {boolean}
     */
    Conway.prototype.getRandomBool = function() {
        return Math.random() < 0.5;
    };

    /**
     * Draws a grid across the entire canvas
     *
     * @param hCells
     * @param vCells
     * @param lineWidth
     * @param color
     */
    Conway.prototype.drawGrid = function(hCells, vCells, lineWidth, color) {
        var width = this.element.width;
        var height = this.element.height;

        var hSpacing = width / hCells;
        var vSpacing = height / vCells;

        for(var hLine = 0; hLine <= hCells; hLine++) {
            var x = hLine * hSpacing;
            this.drawVerticalLine(x, lineWidth, color);
        }

        for(var vLine = 0; vLine <= vCells; vLine++) {
            var y = vLine * vSpacing;
            this.drawHorizontalLine(y, lineWidth, color);
        }
    };

    /**
     * Draws a horizontal line across the entire width of the canvas
     *
     * @param y
     * @param lineWidth
     * @param color
     */
    Conway.prototype.drawHorizontalLine = function(y, lineWidth, color) {
        var width = this.element.width;

        this.ctx.save();
            this.ctx.strokeStyle = color;
            this.ctx.fillStyle = color;
            this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        this.ctx.restore();
    };

    /**
     * Draws a vertical line across the entire height of the canvas
     *
     * @param x
     * @param lineWidth
     * @param color
     */
    Conway.prototype.drawVerticalLine = function(x, lineWidth, color) {

        var height = this.element.height;

        this.ctx.save();
            this.ctx.strokeStyle = color;
            this.ctx.fillStyle = color;
            this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        this.ctx.restore();
    };

    Conway.prototype.fillCell = function(x, y) {
        var cellWidth = this.element.width / this.options.hCells;
        var cellHeight = this.element.height / this.options.vCells;

        var xPos = x * cellWidth;
        var yPos = y * cellHeight;

        this.ctx.save();
            this.ctx.fillRect(xPos, yPos, cellWidth, cellHeight);
        this.ctx.restore();
    };

    Conway.prototype.radialLineAtAngle = function(angleFraction, highlight) {
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
    Conway.prototype.injectStyle = function () {
        if (this.options.injectStyle && !document.getElementById(this.styleId)) {
            $('<style type="text/css" id="' + this.styleId + '"> ' + this.buildStyle() + ' </style>').appendTo('head');
        }
    };

    // Construct conway style based on user options
    Conway.prototype.buildStyle = function () {

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

    Conway.prototype.destroy = function() {
        if (!this.initialized) return;

        this.stop();

        // Reset this.initialized flag
        this.initialized = false;
    };

    Conway.prototype.remove = function() {
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
                $.data(this, pluginName, new Conway(this, $.extend(true, {}, options)));
            }
        });

        return result || this;
    };

})(jQuery, window, document);
