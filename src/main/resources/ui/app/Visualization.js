/**
 * Base prototype for visualizations of DDS. Each visualization can use two parts of the DOM:
 *   1. Header to add navigation and configuration elements like buttons or sliders
 *   2. Content to add SVG and canvas elements for the visualization itself
 *
 * When implementing a new visualization, one needs to specify how to draw the visualization
 * given a data object (_draw). Each visualization also needs to be able to remove all elements
 * it has constructed (clear).
 *
 *
 * Methods:
 *
 *   - title(String): Set title of the visualization
 *   - title(): Get title of the visualization
 *
 *   - header(String): Set ID of DOM element to use as header; w/o '#'
 *   - header(): Get DOM element to use as header
 *
 *   - content(String): Set ID of DOM element to use for drawing; w/o '#'
 *   - content(): Get DOM element to use for drawing
 *
 *   - margin(Object): Set margins to add between content div borders and drawing;
 *                     Needs to have Integer values for margin.top, margin.bottom, margin.left and margin.right;
 *                     If no margin is specified, default values of 0 will be used for all four dimensions
 *   - margin(): Get margins
 *
 *   - height(Number): Set height of the visualization
 *   - height(): Get height of the visualization
 *
 *   - width(Number): Set width of the visualization
 *   - width(): Get width of the visualization
 *
 *   - data(Object): Set data object to be used when drawing
 *   - data(): Get data
 *
 *   - draw(): Draw the current visualization
 *   - _draw(): Subclass implementation of drawing method (NEEDS TO BE IMPLEMENTED BY SUBCLASS)
 *
 *   - _verify(): Checks whether the visualization has been initialized correctly
 *
 *   - clear(): Removes all header elements generated by the visualization
 *   - _clear() Subclass implementation of clear method (NEEDS TO BE IMPLEMENTED BY SUBCLASS)
 */
 define(function(require) {

  var Util = require("util")

  function Visualization() {
    this._defaultMargin = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
    this._margin = this._defaultMargin;
    this._title = "";
  }

  Visualization.prototype.title = function(newTitle) {
    if (newTitle != null) {
      this._title = newTitle;
      return this;
    } else {
      return this._title;
    }
  }

  Visualization.prototype.header = function(newHeaderId) {
    if (newHeaderId != null) {
      this._header = document.getElementById(newHeaderId);
      return this;
    } else {
      return this._header;
    }
  }

  Visualization.prototype.content = function(newContentId) {
    if (newContentId != null) {
      this._content = document.getElementById(newContentId);
      if (!this._width) {
        this._width = $(this._content)
          .width();
      }
      if (!this._height) {
        this._height = $(this._content)
          .height();
      }
      return this;
    } else {
      return this._content;
    }
  }

  Visualization.prototype.margin = function(newMargin) {
    if (newMargin != null) {
      for (marginType in this._defaultMargin) {
        if (!newMargin[marginType]) {
          newMargin[marginType] = this._defaultMargin[marginType];
        }
      }
      this._margin = newMargin;
      return this;
    } else {
      return this._margin;
    }
  }

  Visualization.prototype.width = function(newWidth) {
    if (newWidth != null) {
      this._width = newWidth;
      return this;
    } else {
      return this._width;
    }
  }

  Visualization.prototype.height = function(newHeight) {
    if (newHeight != null) {
      this._height = newHeight;
      return this;
    } else {
      return this._height;
    }
  }

  Visualization.prototype.data = function(newData) {
    if (newData != null) {
      this._data = newData;
      return this;
    } else {
      return this._data;
    }
  }

  Visualization.prototype._verify = function() {
    if (this._header == null) {
      console.error("Header element not specified.");
    }
    if (this._content == null) {
      console.error("Content element not specified.");
    }
    if (this._margin == null) {
      console.error("Margin not specified.");
    }
    if (this._width == null) {
      console.error("Width not specified.");
    }
    if (this._height == null) {
      console.error("Height not specified.");
    }
    if (this._data == null) {
      console.error("Data not specified.");
    }
  }

  Visualization.prototype._draw = function() {
    console.error("Protected _draw method needs to be implemented when using the Visualization prototype.");
  }

  Visualization.prototype.draw = function() {
    this._verify();
    var titleSpan = Util.generateSpan(this._header, this._content.id + "-title")
    titleSpan.innerHTML = this._title;
    titleSpan.className = "servable-title";
    this._titleSpan = titleSpan;
    this._draw(this._data);
    return this;
  }

  Visualization.prototype.clear = function() {
    Util.removeElementIfExists(this._titleSpan);
    this._clear();
  }

  Visualization.prototype._clear = function() {
    console.error("_clear method needs to be implemented when using the Visualization prototype.");
  }

  return Visualization;

});
