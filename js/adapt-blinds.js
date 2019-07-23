define([
  "core/js/adapt",
  "core/js/views/componentView"
], function(Adapt, ComponentView) {

	var Blinds = ComponentView.extend({

    events: {
        'click .blinds-item': 'onClick'
    },

		preRender: function() {
			this.listenTo(Adapt, "device:resize", this.calculateWidths, this);
      this.listenTo(Adapt, "device:changed", this.setDeviceSize, this);
      this.listenTo(Adapt, "audio:changeText", this.replaceText);

			this.setDeviceSize();
		},

    setDeviceSize: function() {
			if (Adapt.device.screenSize === "large") {
				this.$el.addClass("desktop").removeClass("mobile");
				this.model.set("_isDesktop", true);
			} else {
				this.$el.addClass("mobile").removeClass("desktop");
				this.model.set("_isDesktop", false)
			}
		},

		postRender: function() {
      this.renderState();

			this.$(".blinds-inner").imageready(_.bind(function() {
				this.setReadyStatus();
			}, this));

      this.setupBlinds();

      if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
          this.replaceText(Adapt.audio.textSize);
      }
		},

		setupBlinds: function() {
			if(!this.model.has("_items") || !this.model.get("_items").length) return;

			this.model.set("_itemCount", this.model.get("_items").length);
			this.model.set("_active", true);

			this.calculateWidths();
			this.setupEventListeners();
		},

    calculateWidths: function() {
      if (Adapt.device.screenSize !== "small") {
        this.$(".blinds-item").height(this.model.get("_height"));
      } else {
        this.$(".blinds-item").height("auto");
      }
      var wTotal = this.$(".blinds-container").width();
      var $items = this.$(".blinds-item");
      var wItem = wTotal / $items.length;
      this.itemWidth = wItem;
      $items.outerWidth(wItem);
      this.model.set("_width", this.$(".blinds-container").width());
    },

    onClick: function(event) {
      event.preventDefault();

      this.resetItems();

      var $items = this.$(".blinds-item");
      var currentItem = $(event.currentTarget);
			var _items = this.model.get("_items");
			var wItem = this.itemWidth;

      var captionDelay = this.model.has("captionDelay") ? this.model.get("captionDelay") : 800;
      var wTotal = this.$(".blinds-container").width();

      var itemIndex = currentItem.index();
      var _item = _items[itemIndex];
      var $siblings = currentItem.siblings();
      var $p = currentItem.find(".blinds-text");
      var wItemNew = wItem;
      var wSiblingsNew = wItem - ((wItemNew - wItem) / $siblings.length);

      var widthNormal = wTotal / $items.length;
      var widthOpen = wTotal - (50 * $siblings.length);

      wItemNew = widthOpen;

      currentItem.outerWidth(widthOpen);

      this.setStage(itemIndex);

      currentItem.addClass("selected");

      var left = _item._left || 0;
      var top = _item._top;
      var width = _item._width || wItem + "px";

      $p.css({
        opacity: 1,
        top: top,
        left: left,
        maxWidth: width
      });

      $siblings.outerWidth(50);

      ///// Audio /////
      if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
        // Reset onscreen id
        Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
        // Trigger audio
        Adapt.trigger('audio:playAudio', _item._audio._src, this.model.get('_id'), this.model.get('_audio')._channel);
      }
      ///// End of Audio /////
    },

    resetItems: function() {
      this.$(".blinds-text").css("opacity", 0);
      this.$(".blinds-item").outerWidth(this.itemWidth);

      this.$(".blinds-item").removeClass("selected");

      ///// Audio /////
      if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled) {
          Adapt.trigger('audio:pauseAudio', this.model.get('_audio')._channel);
      }
      ///// End of Audio /////
    },

    setStage: function(stage) {
      // Reset accessibility
      for (var i = 0; i < this.model.get('_items').length; i++) {
        var $item = this.$('.blinds-item').eq(i);
        var $itemText = $item.find('.blinds-text');
        $itemText.a11y_on(false);
      }

			this.model.set("_stage", stage);

      var $item = this.$('.blinds-item').eq(stage);
      var $itemText = $item.find('.blinds-text');

      this.setVisited(stage);
      $item.addClass("visited");

      // Update accessibility
      var a11y = Adapt.config.get('_accessibility');
      if (!a11y || !a11y._isActive) return;
      _.delay(function() {
        $itemText.a11y_on(true);
        $itemText.a11y_focus();
      }, 500);
		},

    setVisited: function(index) {
        var item = this.model.get('_items')[index];
        item._isVisited = true;
        this.checkCompletionStatus();
    },

    getVisitedItems: function() {
			return _.filter(this.model.get("_items"), function(item) {
				return item._isVisited;
			});
		},

    checkCompletionStatus: function() {
        if (this.getVisitedItems().length == this.model.get('_items').length) {
            this.setCompletionStatus();
        }
    },

		getCurrentItem: function(index) {
			return this.model.get("_items")[index];
		},

		evaluateCompletion: function() {
			if (this.getVisitedItems().length === this.model.get("_items").length) {
				this.trigger("allItems");
			}
		},

		inview: function(event, visible, visiblePartX, visiblePartY) {
			if (visible) {
				if (visiblePartY === "top") {
					this._isVisibleTop = true;
				} else if (visiblePartY === "bottom") {
					this._isVisibleBottom = true;
				} else {
					this._isVisibleTop = true;
					this._isVisibleBottom = true;
				}

				if (this._isVisibleTop && this._isVisibleBottom) {
					this.$(".component-inner").off("inview");
					this.setCompletionStatus();
				}
			}
		},

		onCompletion: function() {
			this.setCompletionStatus();
			if (this.completionEvent && this.completionEvent != "inview") {
				this.off(this.completionEvent, this);
			}
		},

    setupEventListeners: function() {
      this.completionEvent = (!this.model.get('_setCompletionOn')) ? 'allItems' : this.model.get('_setCompletionOn');
      if (this.completionEvent !== 'inview' && this.model.get('_items').length > 1) {
        this.on(this.completionEvent, _.bind(this.onCompletion, this));
      } else {
        this.$('.component-widget').on('inview', _.bind(this.inview, this));
      }
		},

    // Reduced text
    replaceText: function(value) {
      // If enabled
      if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
        // Change each items body
        for (var i = 0; i < this.model.get('_items').length; i++) {
          if(value == 0) {
            this.$('.blinds-text').eq(i).html(this.model.get('_items')[i].body);
          } else {
            this.$('.blinds-text').eq(i).html(this.model.get('_items')[i].bodyReduced);
          }
        }
      }
    }

	});

	Adapt.register("blinds", Blinds);

	return Blinds;

});
