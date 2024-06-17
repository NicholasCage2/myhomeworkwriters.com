jQuery(document).ready(function(){
    if(!jQuery.cookie('go_back_modal_shown')){
        jQuery(document).mouseleave(function(e){
            if ((e.pageY - jQuery(window).scrollTop() <= 1)) {
                if( $(e.target).is('select')===false){
                    if(!jQuery.cookie('go_back_modal_shown')){
                        jQuery.cookie('go_back_modal_shown', 1, {
                            expires: 1000, 
                            path: '/'
                        });
                        jQuery('#goBackModalWithTimer').modal('show');                                        
                        if(jQuery('#goBackModalWithTimer ._timer').length > 0){
                            var text_timer = window.setInterval(function(){
                                var minutesEl = jQuery('._timer ._minutes');
                                var secondsEl = jQuery('._timer ._seconds');

                                var minutes = minutesEl.html();
                                var seconds = secondsEl.html();

                                gSeconds = seconds*1+minutes*60;
                                ;

                                gSeconds--;

                                if(gSeconds < 0){
                                    clearInterval(text_timer);
                                }

                                var cMinutes = Math.floor(gSeconds/60);
                                var cSeconds = gSeconds%60;

                                if(gSeconds >= 0){ 
                                    minutesEl.html( cMinutes<10?'0'+cMinutes:cMinutes );
                                    secondsEl.html( cSeconds<10?'0'+cSeconds:cSeconds );
                                }

                            },1000);
                        }				
                    }
                }
            }
        });
    }

    jQuery('.goBackForm').submit(function(e){
        e.preventDefault();
        var form = jQuery(this);

        couponCode = form.data('coupon');
        couponDiscount = form.data('discount') || 0;
		
        var is_new_bounce_form = form.hasClass('new-bounce');
        var is_new_form = form.hasClass('new-goback-form');
        if(form.hasClass('in-action')){
            return false;
        }
		
        form.addClass('in-action');
		
        var modal = form.closest('.go-back-modal');

        modal.find("._validation-error").hide();
        form.removeClass('form-error');

        var timezone = new Date().getTimezoneOffset() / 60 * -1;
        var nameEl = form.find("input[name='name']");
        var name = nameEl.val();
        var emailEl = form.find("input[name='email']");
        var email = emailEl.val();

        var email_pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);

        var valid = true;
	
        if (is_new_form) {
            if(email != '' && !email_pattern.test(email)){
                emailEl.closest('.form-group').addClass('form-error');
                valid = false;
            }else{
                emailEl.closest('.form-group').removeClass('form-error');
            }
        } else {
            if(email == '' || !email_pattern.test(email)){
                emailEl.closest('.form-group').addClass('form-error');
                valid = false;
            }else{
                emailEl.closest('.form-group').removeClass('form-error');
            }
        }

        if(name  == '' && !is_new_form){
            nameEl.closest('.form-group').addClass('form-error');
            valid = false;
        }else{
            nameEl.closest('.form-group').removeClass('form-error');
        }
		
        if (email == '' && is_new_form) {
        } else {
            if (!$(".go-back-modal input[name='gdpr-agree']").is(":checked")) {
                $('.go-back-modal .checkbox-gdbr-block .alert-danger-gdbr').show();
                $('.go-back-modal [name=gdpr-agree]').addClass('gdpr-agree-err');
                valid = false;                        
            }

            $(".go-back-modal  input[name='gdpr-agree']").on('change', function () {
                if (!$(this).is(":checked")) {
                    $('.go-back-modal .checkbox-gdbr-block .alert-danger-gdbr').show();
                    $('.go-back-modal [name=gdpr-agree]').addClass('gdpr-agree-err');                            
                } else {
                    $('.go-back-modal .checkbox-gdbr-block .alert-danger-gdbr').hide();
                    $('.go-back-modal [name=gdpr-agree]').removeClass('gdpr-agree-err');                            
                }
            });   
        }

        if (valid) {
            if(email == '' && is_new_form) {
                window.location.href = '/order?popup';
            } else {
                jQuery.ajax({
                    url: "/api/subscribe",
                    data: {
                        timezone: timezone,
                        name: is_new_form ? 'Customer' : name,
                        email: email,
                        coupon_code: couponCode,
                        coupon_discount: couponDiscount,
                        type: 'discount'
                    },
                    dataType: "json",
                    type: 'POST',
                    success: function(response) {
                        if(!is_new_bounce_form) {
                            $(".new-bounce__wrapper").hide();
                            $(".new-bounce__success").show();
                        } else {
                            if(!is_new_form) {
                                var text = 'Thank you, we have received your query!<br> Our manager will contact you within 10 minutes. ';
                                var blockFooter = '<div style="font-size: 12px;margin-top: 10px;display: block; line-height: 1; background: #ccc; padding: 15px;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;">By providing your contact information, you accept our <a href="/privacy-policy/">Privacy Policy</a>, <a href="/terms-of-use/">Terms of Use</a> and express your prior affirmative consent to receive sms and emails from us.</div>';
                                modal.find('.modal-body').html('<h4 class="text-center">'+text+'</h4>' + blockFooter);
                            } else {
                                window.location.href = '/order?couponCode='+couponCode;
                            }
                        }
                    }
                })
            }

        } else {
            form.removeClass('in-action');
            
            if(!is_new_bounce_form) {
                if (email === '') {
                    modal.find("input[name='email']").parent().find('.nb-empty').show();
                } else if (!email_pattern.test(email)) {
                    modal.find("input[name='email']").parent().find('.nb-valid').show();
                }

                if (name === '') {
                    modal.find("input[name='name']").parent().find('.nb-empty').show();
                }
            }
            else {
                if(!is_new_form) {
                    modal.find("._validation-error").show();
                } 
            }
        }
        return false;
    });

    jQuery('#goBackModal .input-group').click(function(){
        jQuery(this).parents('form').find('.input-group').removeClass('focused');
        jQuery(this).addClass('focused');
    });
});