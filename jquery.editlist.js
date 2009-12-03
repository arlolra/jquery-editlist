(function($) {

    $.fn.editlist = function (options) {

        var defaults = {
            'tab' : 20
        },
        settings = $.extend({}, defaults, options);

            var el_blur = function () {

                var text = $(this).val();
                if(text) {
                    $(this)
                        .attr('readonly', 'readonly')
                        .unbind('blur.editlist')
                        .unbind('keydown.editlist')
                        .bind('click.editlist', el_click);
                 } else {
                    $(this).parent().remove();
                 }

            }

            var el_add_rem = function ($ta, text, cp) {

                text = text.replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/<br \/>/g,'\n');
                $ta
                    .unbind('click.editlist')
                    .bind('keypress', el_keypress)
                    .bind('blur.editlist', el_blur)
                    .bind('keydown.editlist', el_keydown)
                    .attr('readonly', false)
                    .val(text)
                    .TextAreaExpander()
                    .focus()
                    .caret(cp);

                return false;

            }

            var el_click = function () {

                var text = $(this).val();
                el_add_rem($(this), text, 0);

            }

            var el_keypress = function (e) {
            
                if( (e.which && e.which === 13) || (e.keyCode && e.keyCode === 13) ) {
                    return false;            
                }

            }

            var el_keydown = function (e) {
             
                // enter
                if( (e.which && e.which === 13) || (e.keyCode && e.keyCode === 13) ) {
                            
                    var cp = $(this).caret();
                    var movetext = $(this).val();
                    
                    if(movetext) {

                        var text = movetext.substr(0, cp);
                        var $parent = $(this).parent();
                        var $li = $('<li />');

                        $ta = $('<textarea />');
                        $ta.attr('readonly', true);
                        $li.html($ta);
                        $(this)
                            .bind('click.editlist', el_click)
                            .unbind('keydown.editlist')
                            .unbind('blur.editlist');
                                                   
                        if(text) {
                            $li.insertAfter($parent);
                            $(this).val(text).TextAreaExpander();
                            el_add_rem($ta, movetext.substr(cp), 0);
                        } else {
                            $li.insertBefore($parent);
                            $(this).val(movetext).TextAreaExpander();
                            el_add_rem($ta, '', 0);
                        }

                    }

                    return false;
                
                }

                // backspace
                if( (e.which && e.which === 8) || (e.keyCode && e.keyCode === 8) ) {

                    var cp = $(this).caret();

                    if(cp === 0) {
                       
                        if($(this).parent().prev("li").children()[0]) {

                            var movetext = $(this).val();
                            var $li = $(this).parent().prev("li");
                            $(this).parent().remove();

                            var $ta = $( $li.children()[0] );
                            var ncp = $ta.val().length;
                            var newtext = $ta.val() + movetext;

                            el_add_rem($ta, newtext, ncp);
            
                        }
                        return false;

                    }
                    return true;

                }

                // delete
                if( (e.which && e.which === 46) || (e.keyCode && e.keyCode === 46) ) {

                    var cp = $(this).caret();
                    var len = $(this).val().length;

                    if(cp === len) {

                        if($(this).parent().next("li").children()[0]) {

                            var movetext = $(this).val();
                            var $li = $(this).parent().next("li");
                            $(this).parent().remove();

                            var $ta = $( $li.children()[0] );
                            var newtext = movetext + $ta.val();
                            
                            el_add_rem($ta, newtext, len);

                        }
                        return false;

                    }
                    return true;

                }

                // down
                if( (e.which && e.which === 40) || (e.keyCode && e.keyCode === 40) ) {

                    var $parent = $(this).parent();
                    if($parent.next("li").children()[0]) {

                        var cp = $(this).caret();
                        var $ta = $( $parent.next("li").children()[0] );
                        var newtext = $ta.val();

                        var text = $(this).val();
                        if(text) {
                            $(this)
                                .bind('click.editlist', el_click)
                                .unbind('keydown.editlist')
                                .unbind('blur.editlist')
                                .attr('readonly', true);
                        } else {
                            $parent.remove();
                        }
                    
                        el_add_rem($ta, newtext, cp);
                        return false;

                    }
                    return true;

                }

                // up
                if( (e.which && e.which === 38) || (e.keyCode && e.keyCode === 38) ) { 

                    var $parent = $(this).parent();
                    if($parent.prev("li").children()[0]) {
        
                        var cp = $(this).caret();
                        var $ta = $( $parent.prev("li").children()[0] );
                        var newtext = $ta.val();

                        var text = $(this).val();
                        if(text) {
                            $(this)
                                .bind('click.editlist', el_click)
                                .unbind('keydown.editlist')
                                .unbind('blur.editlist')
                                .attr('readonly', true);
                        } else {
                            $parent.remove();
                        }

                        el_add_rem($ta, newtext, cp);
                        return false;

                    }
                    return true;

                } 

                // tab
                if( (e.which && e.which === 9) || (e.keyCode && e.keyCode === 9) ) {

                    if(e.shiftKey) {
                    
                        var indent = $(this).parent().css('margin-left');
                        indent = parseFloat(indent, 10) - settings.tab;
                        $(this).parent().css('margin-left', indent + 'px');

                    } else {
                    
                        var indent = $(this).parent().css('margin-left');
        
                        // for ie default margin
                        if(indent === 'auto') { indent = 0; }

                        indent = parseFloat(indent) + settings.tab;
                        $(this).parent().css('margin-left', indent + 'px');

                    }
                    return false;

                }

            }   

        this.each(function () {

            var $ta = $('<textarea />');
            var text = $(this).html().replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/<br \/>/g,'\n');
            $ta.attr('readonly', true).val(text);
            $(this).html($ta);
            $ta.bind('click.editlist', el_click);
            $ta.TextAreaExpander();

        });

        return this;

    }

})(jQuery);
