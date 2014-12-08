/*
 * jQuery appear plugin
 *
 * Copyright (c) 2012 Andrey Sidorov
 * licensed under MIT license.
 *
 * https://github.com/morr/jquery.appear/
 *
 * Version: 0.3.7
 */
(function($) {
  
  var selectors = [],
      check_binded = false,
      check_lock   = false,
      defaults     = {
        interval: 250,
        force_process: false
      },
      $window      = $(window),
      $prior_appeared;

  function process() {
    check_lock = false;
    for (var index = 0, selectorsLength = selectors.length; index < selectorsLength; index++) {
      var $appeared = $(selectors[index]).filter(function() {
        return $(this).is(':appeared');
      });

      $appeared.trigger('appear', [$appeared]);

      if ($prior_appeared) {
        var $disappeared = $prior_appeared.not($appeared);
        $disappeared.trigger('disappear', [$disappeared]);
      }
      $prior_appeared = $appeared;
    }
  }

  // "appeared" custom filter
  $.expr[':']['appeared'] = function(element) {
    var $element = $(element);

    if ((element.style && element.style.display) || $.css( element, "display" ) === "none") {
     return false;
    }

    var window_left = $window.scrollLeft(),
        window_top  = $window.scrollTop(),
        offset      = $element.offset(),
        left        = offset.left,
        top         = offset.top;

    var bottomOffset = $element.data('appear-bottom-offset') || 0,
        topOffset    = $element.data('appear-top-offset') || 0,
        leftOffset   = $element.data('appear-left-offset') || 0,
        rightOffset  = $element.data('appear-right-offset') || 0;

   if (top + $element.height() + bottomOffset >= window_top &&
        top - topOffset <= window_top + $window.height() &&
        left + $element.width() + rightOffset >= window_left &&
        left - leftOffset <= window_left + $window.width()) {
      return true;
    } else {
      return false;
    }
  }

  $.fn.extend({
    // watching for element's appearance in browser viewport
    appear: function(options) {
      var opts = $.extend({}, defaults, options || {});
      var selector = this.selector || this;
      if (!check_binded) {
        var on_check = function() {
          if (check_lock) {
            return;
          }
          check_lock = true;

          setTimeout(process, opts.interval);
        };

        $(window).scroll(on_check).resize(on_check);
        check_binded = true;
      }

      if (opts.force_process) {
        setTimeout(process, opts.interval);
      }
      selectors.push(selector);
      return $(selector);
    }
  });

  $.extend({
    // force elements's appearance check
    force_appear: function() {
      if (check_binded) {
        process();
        return true;
      };
      return false;
    }
  });
})(jQuery);
