!function(a) {
    a.widget("ui.tagit", {
        options: {
            allowDuplicates: !1,
            caseSensitive: !0,
            fieldName: "tags",
            placeholderText: null,
            readOnly: !1,
            removeConfirmation: !1,
            tagLimit: null,
            availableTags: [],
            autocomplete: {},
            showAutocompleteOnFocus: !1,
            allowSpaces: !1,
            singleField: !1,
            singleFieldDelimiter: ",",
            singleFieldNode: null,
            animate: !0,
            tabIndex: null,
            beforeTagAdded: null,
            afterTagAdded: null,
            beforeTagRemoved: null,
            afterTagRemoved: null,
            onTagClicked: null,
            onTagLimitExceeded: null,
            onTagAdded: null,
            onTagRemoved: null,
            tagSource: null,
        },
        _create: function() {
            var b = this;
        
            // Determine if the element is an input field or a list
            if (this.element.is("input")) {
                this.tagList = $("<ul></ul>").insertAfter(this.element);
                this.options.singleField = true;
                this.options.singleFieldNode = this.element;
                this.element.addClass("tagit-hidden-field");
            } else {
                this.tagList = this.element.find("ul, ol").last();
            }
        
            // Create the tag input field
            this.tagInput = $('<input type="text" />').addClass("ui-widget-content");
            if (this.options.readOnly) {
                this.tagInput.attr("disabled", "disabled");
            }
            if (this.options.tabIndex) {
                this.tagInput.attr("tabindex", this.options.tabIndex);
            }
            if (this.options.placeholderText) {
                this.tagInput.attr("placeholder", this.options.placeholderText);
            }
        
            // Set up autocomplete source function if not provided
            if (!this.options.autocomplete.source) {
                this.options.autocomplete.source = function(term, callback) {
                    var lowercaseTerm = term.term.toLowerCase();
                    var filteredTags = $.grep(this.options.availableTags, function(tag) {
                        return tag.toLowerCase().indexOf(lowercaseTerm) === 0;
                    });
        
                    if (!this.options.allowDuplicates) {
                        filteredTags = this._subtractArray(filteredTags, this.assignedTags());
                    }
        
                    callback(filteredTags);
                };
            }
        
            // Show autocomplete on focus if configured
            if (this.options.showAutocompleteOnFocus) {
                this.tagInput.focus(function() {
                    b._showAutocomplete();
                });
        
                if (this.options.autocomplete.minLength === undefined) {
                    this.options.autocomplete.minLength = 0;
                }
            }
        
            // Proxy autocomplete source and tagSource functions
            if ($.isFunction(this.options.autocomplete.source)) {
                this.options.autocomplete.source = $.proxy(this.options.autocomplete.source, this);
            }
        
            if ($.isFunction(this.options.tagSource)) {
                this.options.tagSource = $.proxy(this.options.tagSource, this);
            }
        
            // Initialize the tag list container and input field
            this.tagList.addClass("tagit ui-widget ui-widget-content ui-corner-all")
                .append($('<li class="tagit-new"></li>').append(this.tagInput))
                .on("click", function(event) {
                    var target = $(event.target);
                    if (target.hasClass("tagit-label")) {
                        var tag = target.closest(".tagit-choice");
                        if (!tag.hasClass("removed")) {
                            b._trigger("onTagClicked", event, {
                                tag: tag,
                                tagLabel: b.tagLabel(tag)
                            });
                        }
                    } else {
                        b.tagInput.focus();
                    }
                });
        
            // Initialize existing tags if in single field mode
            var initialTagsExist = false;
            if (this.options.singleField) {
                if (this.options.singleFieldNode) {
                    var singleFieldNode = $(this.options.singleFieldNode);
                    var tags = singleFieldNode.val().split(this.options.singleFieldDelimiter);
                    singleFieldNode.val("");
                    $.each(tags, function(index, tag) {
                        b.createTag(tag, null, true);
                        initialTagsExist = true;
                    });
                } else {
                    this.options.singleFieldNode = $('<input type="hidden" style="display:none;" value="" name="' + this.options.fieldName + '" />');
                    this.tagList.after(this.options.singleFieldNode);
                }
            }
        
            // Initialize tags from existing list items if not already initialized
            if (!initialTagsExist) {
                this.tagList.children("li").each(function() {
                    if (!$(this).hasClass("tagit-new")) {
                        b.createTag($(this).text(), $(this).attr("class"), true);
                        $(this).remove();
                    }
                });
            }
        
            // Keypress event handler for tag input
            this.tagInput.on("keypress", function(event) {
                // Prevent input of specific characters
                var char = String.fromCharCode(event.which);
                if (['@', '#', '$','%','^','&','*','(',')','!','-','/','+',':',';','_','-','=','.'].indexOf(char) !== -1) {
                    event.preventDefault();
                }
            });
        
            // Keydown event handler for tag input
            this.tagInput.on("keydown", function(event) {
                // Check if the input length exceeds 50 characters
                if (b.tagInput.val().length >= 50 && event.which !== $.ui.keyCode.BACKSPACE) {
                    event.preventDefault(); // Prevent further input
                }
        
                // Handle backspace for tag removal
                if (event.which === $.ui.keyCode.BACKSPACE && b.tagInput.val() === "") {
                    var lastTag = b._lastTag();
                    if (!b.options.removeConfirmation || lastTag.hasClass("remove")) {
                        b.removeTag(lastTag);
                    } else if (b.options.removeConfirmation && lastTag.hasClass("tagit-choice")) {
                        lastTag.addClass("remove ui-state-highlight");
                    }
                } else if (b.options.removeConfirmation && b._lastTag().hasClass("tagit-choice")) {
                    b._lastTag().removeClass("remove ui-state-highlight");
                }
        
                // Clean input to allow only alphanumeric characters
                var cleanedValue = b._cleanedInput();
        
                // Create tag if enter, comma, tab, or space is pressed
                if ((event.which === $.ui.keyCode.COMMA && !event.shiftKey === false) ||
                    event.which === $.ui.keyCode.ENTER ||
                    (event.which === $.ui.keyCode.TAB && b.tagInput.val() !== "") ||
                    (event.which === $.ui.keyCode.SPACE && !b.options.allowSpaces &&
                        ('"' !== $.trim(b.tagInput.val()).replace(/^\s*/, "").charAt(0) ||
                            ('"' === $.trim(b.tagInput.val()).charAt(0) &&
                                '"' === $.trim(b.tagInput.val()).charAt($.trim(b.tagInput.val()).length - 1) &&
                                $.trim(b.tagInput.val()).length - 1 !== 0)))) {
        
                    if (!b.options.autocomplete.autoFocus || !b.tagInput.data("autocomplete-open")) {
                        b.tagInput.autocomplete("close");
                        // Create tag before handling default behavior
                        b.createTag(cleanedValue);
        
                        // Prevent default behavior if Enter key was pressed
                        if (event.which === $.ui.keyCode.ENTER) {
                            event.preventDefault();
                        }
                    }
                }
        
                // Prevent input of other special symbols based on key codes
                var isSpecialKey = event.which === 192 || // `
                    event.which === 189 || // -
                    event.which === 187 || // =
                    event.which === 219 || // [
                    event.which === 221 || // ]
                    event.which === 220 || // \
                    event.which === 186 || // ;
                    event.which === 222 || // '
                    event.which === 188 || // ,
                    event.which === 190 || // .
                    event.which === 191 || // /
                    event.which === 144 || // Num lock
                    event.which === 145 || // Scroll lock
                    event.which === 19 || // Pause break
                    event.which === 9 || // Tab
                    event.which === 20 || // Caps lock
                    event.which === 27 || // Escape
                    event.which === 17 || // Control
                    event.which === 18 || // Alt
                    event.which === 45 || // Insert
                    event.which === 46 || // Delete
                    event.which === 36 || // Home
                    event.which === 35 || // End
                    event.which === 33 || // Page up
                    event.which === 34 || // Page down
                    event.which === 37 || // Left arrow
                    event.which === 38 || // Up arrow
                    event.which === 39 || // Right arrow
                    event.which === 40; // Down arrow
        
                if (isSpecialKey) {
                    event.preventDefault(); // Prevent input of special symbols
                }
            }).on("blur", function(event) {
                // If autocomplete is not open, create tag on blur
                if (!b.tagInput.data("autocomplete-open")) {
                    b.createTag(b._cleanedInput());
                }
            });
        
            // Initialize autocomplete if available tags or source are provided
            if (this.options.availableTags || this.options.tagSource || this.options.autocomplete.source) {
                var autocompleteOptions = {
                    select: function(event, ui) {
                        b.createTag(ui.item.value);
                        return false;
                    }
                };
        
                $.extend(autocompleteOptions, this.options.autocomplete);
                autocompleteOptions.source = this.options.tagSource || autocompleteOptions.source;
                this.tagInput.autocomplete(autocompleteOptions)
                    .on("autocompleteopen.tagit", function(event, ui) {
                        b.tagInput.data("autocomplete-open", true);
                    })
                    .on("autocompleteclose.tagit", function(event, ui) {
                        b.tagInput.data("autocomplete-open", false);
                    });
        
                this.tagInput.autocomplete("widget").addClass("tagit-autocomplete");
            }
        },                                                 
        destroy: function() {
            return a.Widget.prototype.destroy.call(this), this.element.unbind(".tagit"), this.tagList.unbind(".tagit"), 
            this.tagInput.removeData("autocomplete-open"), this.tagList.removeClass("tagit ui-widget ui-widget-content ui-corner-all tagit-hidden-field"), 
            this.element.is("input") ? (this.element.removeClass("tagit-hidden-field"), this.tagList.remove()) : (this.element.children("li").each(function() {
                a(this).hasClass("tagit-new") ? a(this).remove() : (a(this).removeClass("tagit-choice ui-widget-content ui-state-default ui-state-highlight ui-corner-all remove tagit-choice-editable tagit-choice-read-only"), 
                a(this).text(a(this).children(".tagit-label").text()));
            }), this.singleFieldNode && this.singleFieldNode.remove()), this;
        },
        _cleanedInput: function() {
            if(this.tagInput.val().trim().length <= 50){
                return a.trim(this.tagInput.val().replace(/[^a-z\u0600-\u06FF \u00D1\u00F10-9]/ig, '')); 
            } else {
                return '';
            }
        },        
        _lastTag: function() {
            return this.tagList.find(".tagit-choice:last:not(.removed)");
        },
        _tags: function() {
            return this.tagList.find(".tagit-choice:not(.removed)");
        },
        assignedTags: function() {
            var b = this, c = [];
            return this.options.singleField ? (c = a(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter), 
            "" === c[0] && (c = [])) : this._tags().each(function() {
                c.push(b.tagLabel(this));
            }), c;
        },
        _updateSingleTagsField: function(b) {
            a(this.options.singleFieldNode).val(b.join(this.options.singleFieldDelimiter)).trigger("change");
        },
        _subtractArray: function(b, c) {
            for (var d = [], e = 0; e < b.length; e++) -1 == a.inArray(b[e], c) && d.push(b[e]);
            return d;
        },
        tagLabel: function(b) {
            return this.options.singleField ? a(b).find(".tagit-label:first").text() : a(b).find("input:first").val();
        },
        _showAutocomplete: function() {
            this.tagInput.autocomplete("search", "");
        },
        _findTagByLabel: function(b) {
            var c = this, d = null;
            return this._tags().each(function(e) {
                if (c._formatStr(b) == c._formatStr(c.tagLabel(this))) return d = a(this), !1;
            }), d;
        },
        _isNew: function(a) {
            return !this._findTagByLabel(a);
        },
        _formatStr: function(b) {
            return this.options.caseSensitive ? b : a.trim(b.toLowerCase());
        },
        _effectExists: function(b) {
            return Boolean(a.effects && (a.effects[b] || a.effects.effect && a.effects.effect[b]));
        },
        createTag: function(b, c, d) {
            var e = this;
            if (b = a.trim(b), this.options.preprocessTag && (b = this.options.preprocessTag(b)), 
            "" === b) return !1;
            if (!this.options.allowDuplicates && !this._isNew(b)) return b = this._findTagByLabel(b), 
            !1 !== this._trigger("onTagExists", null, {
                existingTag: b,
                duringInitialization: d
            }) && this._effectExists("highlight") && b.effect("highlight"), !1;
            if (this.options.tagLimit && this._tags().length >= this.options.tagLimit) return this._trigger("onTagLimitExceeded", null, {
                duringInitialization: d
            }), !1;
            var f = a(this.options.onTagClicked ? '<a class="tagit-label"></a>' : '<span class="tagit-label"></span>').text(b), g = a("<li></li>").addClass("tagit-choice ui-widget-content ui-state-default ui-corner-all").addClass(c).append(f);
            this.options.readOnly ? g.addClass("tagit-choice-read-only") : (g.addClass("tagit-choice-editable"), 
            c = a("<span></span>").addClass("ui-icon ui-icon-close"), c = a('<a><span class="text-icon">×</span></a>').addClass("tagit-close").append(c).click(function(a) {
                e.removeTag(g);
            }), g.append(c)), this.options.singleField || (f = f.html(), g.append('<input type="hidden" value="' + f + '" name="' + this.options.fieldName + '" class="tagit-hidden-field" />')), 
            !1 !== this._trigger("beforeTagAdded", null, {
                tag: g,
                tagLabel: this.tagLabel(g),
                duringInitialization: d
            }) && (this.options.singleField && (f = this.assignedTags(), f.push(b), this._updateSingleTagsField(f)), 
            this._trigger("onTagAdded", null, g), this.tagInput.val(""), this.tagInput.parent().before(g), 
            this._trigger("afterTagAdded", null, {
                tag: g,
                tagLabel: this.tagLabel(g),
                duringInitialization: d
            }));
        },
        removeTag: function(b, c) {
            if (c = void 0 === c ? this.options.animate : c, b = a(b), this._trigger("onTagRemoved", null, b), 
            !1 !== this._trigger("beforeTagRemoved", null, {
                tag: b,
                tagLabel: this.tagLabel(b)
            })) {
                if (this.options.singleField) {
                    var d = this.assignedTags(), e = this.tagLabel(b), d = a.grep(d, function(a) {
                        return a != e;
                    });
                    this._updateSingleTagsField(d);
                }
                if (c) {
                    b.addClass("removed");
                    var d = this._effectExists("blind") ? [ "blind", {
                        direction: "horizontal"
                    }, "fast" ] : [ "fast" ], f = this;
                    d.push(function() {
                        b.remove(), f._trigger("afterTagRemoved", null, {
                            tag: b,
                            tagLabel: f.tagLabel(b)
                        });
                    }), b.fadeOut("fast").hide.apply(b, d).dequeue();
                } else b.remove(), this._trigger("afterTagRemoved", null, {
                    tag: b,
                    tagLabel: this.tagLabel(b)
                });
            }
        },
        removeTagByLabel: function(a, b) {
            var c = this._findTagByLabel(a);
            if (!c) throw "No such tag exists with the name '" + a + "'";
            this.removeTag(c, b);
        },
        removeAll: function() {
            var a = this;
            this._tags().each(function(b, c) {
                a.removeTag(c, !1);
            });
        },
        readOnly: function(a) {
            this.options.readOnly = a, this.options.readOnly ? (this.tagInput.attr("disabled", "disabled"), 
            this.tagList.find("li.tagit-choice").removeClass("tagit-choice-editable").addClass("tagit-choice-read-only")) : (this.tagInput.removeAttr("disabled"), 
            this.tagList.find("li.tagit-choice").removeClass("tagit-choice-read-only").addClass("tagit-choice-editable"));
        }
    }); 
}(jQuery);

