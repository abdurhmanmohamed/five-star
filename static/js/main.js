
(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="loader05"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if($('.top-bar').length > 0) {
        var posWrapHeader = $('.top-bar').height();
    }
    else {
        var posWrapHeader = 0;
    }
    

    if($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top',0); 
    }  
    else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
    }

    $(window).on('scroll',function(){
        if($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top',0); 
        }  
        else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
        } 
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function(){
                if($(this).css('display') == 'block') { console.log('hello');
                    $(this).css('display','none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });
                
        }
    });


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
    });

    $('.js-hide-modal-search').on('click', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
    });

    $('.container-search-header').on('click', function(e){
        e.stopPropagation();
    });


    /*==================================================================
    [ Isotope ]*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');

    // filter items on click
    $filter.each(function () {
        $filter.on('click', 'button, .category-card', function () {
            var filterValue = $(this).attr('data-filter');
            $topeContainer.isotope({filter: filterValue});
        });
    });

    // init Isotope
    $(window).on('load', function () {
        var $grid = $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true,
                animationEngine : 'best-available',
                masonry: {
                    columnWidth: '.isotope-item'
                }
            });
        });

        // Auto-filter based on URL parameter
        var urlParams = new URLSearchParams(window.location.search);
        var filter = urlParams.get('filter');

        // Also support ?category=lip/body/nail links (footer & side menu)
        var categoryParam = urlParams.get('category');
        if (categoryParam) {
            var catMap = { lip: '.Lip', body: '.Body', nail: '.Nail' };
            filter = catMap[categoryParam.toLowerCase()] || filter;
        }

        if (filter) {
            $topeContainer.isotope({ filter: filter });
            // Update active state
            $('.filter-tope-group button, .filter-tope-group .category-card').removeClass('how-active1');
            $('[data-filter="' + filter + '"]').addClass('how-active1');
            
            // If it's a card, scroll to it if needed
            var $activeCard = $('.category-card[data-filter="' + filter + '"]');
            if ($activeCard.length) {
                $('.category-nav-wrapper').animate({
                    scrollLeft: $activeCard.position().left - 20
                }, 500);
            }
        }
    });

    var isotopeButton = $('.filter-tope-group button, .filter-tope-group .category-card');

    $(isotopeButton).each(function(){
        $(this).on('click', function(){
            for(var i=0; i<isotopeButton.length; i++) {
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    
    /*==================================================================
    [ Filter / Search product ]*/
    $('.js-show-filter').on('click',function(){
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }    
    });

    $('.js-show-search').on('click',function(){
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }    
    });




    /*==================================================================
    [ Cart ]*/
    $('.js-show-cart').on('click',function(){
        $.ajax({
        url: "/get-cart-items",
        method: "POST",
        success: function(response){
                const variants = response.variants || [];
                let images = response.images || [];
                if ((!images || !images.length) && variants.length) {
                    images = variants.map(v => v.image).filter(Boolean);
                }

                // update text
                document.getElementById("total-price").innerText = response.total_price + " EGP";
                $('#cart-items').html('');
                response.items.forEach(function(item){
                let cartElement = `
                <li class="cart-item d-flex align-items-center p-2 mb-2 rounded">
                    <!-- Product image -->
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="IMG" />
                    </div>

                    <!-- Name + Price -->
                    <div class="cart-item-info flex-grow-1 ms-2">
                        <div class="cart-item-name" style="font-family:  'Cairo', 'sans-serif';">${item.name}</div>
                        <div class="cart-item-price"><h6 style="font-family:  'Cairo', 'sans-serif'; text-align: right;"> ${item.price}EGP x ${item.amount}</h6></div>
                    </div>

                    <!-- Trash button -->
                    <button class="cart-delete-btn ms-2" data-id="${item.id}">
                        <i class="fa fa-trash"></i>
                    </button>
                </li>
                `;
                    $('#cart-items').append(cartElement);
                    $(document).on('click', '.cart-delete-btn', function(){
                    let item_id = $(this).data('id');

                    // Example: remove item from DOM
                    $(this).closest('li').remove();

                    // Optional: send request to server
                    
                    $.ajax({
                        url: "/remove-cart-item",
                        method: "POST",
                        data: {id: item_id},
                        success: function(response){
                const variants = response.variants || [];
                let images = response.images || [];
                if ((!images || !images.length) && variants.length) {
                    images = variants.map(v => v.image).filter(Boolean);
                }

                            $('#total-price').html('');
                            $('#total-price').text(response.total_price + " EGP");
                            console.log("Item removed from server");
                        }
                    });
                });
                });

                // update colors
                // $('#color').html('');
                // response.colors.forEach(function(color){
                //     $('#color').append(`<option>${color}</option>`);
                // });


                // show modal
            }

        })
        $('.js-panel-cart').addClass('show-header-cart');
    });

    $('.js-hide-cart').on('click',function(){
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/

 /*==================================================================
[ +/- num product ]*/
$('.btn-num-product-down').on('click', function(){
    let item_id = $(this).data('id');
    let $input = $(`.num-product[data-id='${item_id}']`);
    let $totalCell = $(`.total_item_price[data-id='${item_id}']`);

    var numProduct = Number($input.val());
    if(numProduct > 0) numProduct -= 1;
    $input.val(numProduct);

    $.ajax({
        url: "/change-amount",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({id: item_id, amount: numProduct}),
        success: function(response){
                const variants = response.variants || [];
                let images = response.images || [];
                if ((!images || !images.length) && variants.length) {
                    images = variants.map(v => v.image).filter(Boolean);
                }

            if(response.removed){
                $(`tr[data-id='${item_id}']`).remove();
            } else {
                $totalCell.text(response.price * numProduct + " EGP");
            }
            $('.total_price').text(response.total_price + " EGP");  // if you have a cart total element
        }
    });
});

$('.btn-num-product-up').on('click', function(){
    let item_id = $(this).data('id');
    let $input = $(`.num-product[data-id='${item_id}']`);
    let $totalCell = $(`.total_item_price[data-id='${item_id}']`);

    var numProduct = Number($input.val());
    numProduct += 1;
    $input.val(numProduct);

    $.ajax({
        url: "/change-amount",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({id: item_id, amount: numProduct}),
        success: function(response){
                const variants = response.variants || [];
                let images = response.images || [];
                if ((!images || !images.length) && variants.length) {
                    images = variants.map(v => v.image).filter(Boolean);
                }

            $totalCell.text(response.price * numProduct + " EGP");
            $('.total_price').text(response.total_price + " EGP");  // update cart total
        }
    });
});

    /*==================================================================
    [ Rating ]*/
    $('.wrap-rating').each(function(){
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function(){
            var index = item.index(this);
            var i = 0;
            for(i=0; i<=index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function(){
            var index = item.index(this);
            rated = index;
            $(input).val(index+1);
        });

        $(this).on('mouseleave', function(){
            var i = 0;
            for(i=0; i<=rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });
    
    /*==================================================================
    [ Show modal1 ]*/
    
    // Render all variant colors as visible, clickable chips inside the quick-view modal.
    function colorLabelToCss(label) {
        const raw = (label || '').trim();
        const s = raw.toLowerCase();

        const map = {
            red: '#ef4444',
            blue: '#3b82f6',
            black: '#111827',
            white: '#f9fafb',
            gray: '#9ca3af',
            grey: '#9ca3af',
            green: '#22c55e',
            yellow: '#eab308',
            pink: '#ec4899',
            brown: '#8b5e3c',
            purple: '#a855f7',
            orange: '#f97316',
            gold: '#d4af37',
            silver: '#c0c0c0'
        };
        if (map[s]) return map[s];

        // Common Arabic color names.
        const amap = {
            'احمر': '#ef4444',
            'أحمر': '#ef4444',
            'ازرق': '#3b82f6',
            'أزرق': '#3b82f6',
            'اسود': '#111827',
            'أسود': '#111827',
            'ابيض': '#f9fafb',
            'أبيض': '#f9fafb',
            'رمادي': '#9ca3af',
            'اخضر': '#22c55e',
            'أخضر': '#22c55e',
            'اصفر': '#eab308',
            'أصفر': '#eab308',
            'وردي': '#ec4899',
            'بني': '#8b5e3c',
            'بنفسجي': '#a855f7',
            'برتقالي': '#f97316'
        };
        if (amap[raw]) return amap[raw];

        return null;
    }

    function setActiveColorChip(color) {
        const $wrap = $('#colorOptions');
        if (!$wrap.length) return;

        const target = (color || '').trim();
        $wrap.find('.js-color-chip').each(function(){
            const $btn = $(this);
            const btnColor = String($btn.data('color') || '').trim();
            const isActive = btnColor === target;
            $btn.toggleClass('is-active', isActive);
            $btn.attr('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function renderColorChips(variants, colorsFallback) {
        const $wrap = $('#colorOptions');
        if (!$wrap.length) return;

        $wrap.empty();

        const chips = [];
        if (Array.isArray(variants) && variants.length) {
            variants.forEach(function(v){
                chips.push({
                    color: v.color || 'Default',
                    variant_id: v.id || '',
                    image: v.image || ''
                });
            });
        } else if (Array.isArray(colorsFallback) && colorsFallback.length) {
            colorsFallback.forEach(function(c){
                chips.push({ color: c, variant_id: '', image: '' });
            });
        }

        // Render unique items (avoid duplicates).
        const seen = new Set();
        chips.forEach(function(c){
            const key = [c.color, c.variant_id, c.image].join('|');
            if (seen.has(key)) return;
            seen.add(key);

            const $btn = $('<button type="button" class="color-chip js-color-chip" aria-pressed="false"></button>');
            $btn.attr('data-color', c.color);
            if (c.variant_id) $btn.attr('data-variant-id', c.variant_id);
            if (c.image) $btn.attr('data-image', c.image);

            const $dot = $('<span class="color-dot" aria-hidden="true"></span>');
            const cssColor = colorLabelToCss(c.color);
            if (cssColor) $dot.css('background', cssColor);

            const $label = $('<span class="color-chip-label"></span>').text(c.color);
            $btn.append($dot, $label);
            $wrap.append($btn);
        });

        setActiveColorChip($('#color').val());
    }
    
    // Render all variant colors as visible, clickable chips inside the quick-view modal.
    function colorLabelToCss(label) {
        const raw = (label || '').trim();
        const s = raw.toLowerCase();

        const map = {
            red: '#ef4444',
            blue: '#3b82f6',
            black: '#111827',
            white: '#f9fafb',
            gray: '#9ca3af',
            grey: '#9ca3af',
            green: '#22c55e',
            yellow: '#eab308',
            pink: '#ec4899',
            brown: '#8b5e3c',
            purple: '#a855f7',
            orange: '#f97316',
            gold: '#d4af37',
            silver: '#c0c0c0'
        };
        if (map[s]) return map[s];

        // Common Arabic color names.
        const amap = {
            'احمر': '#ef4444',
            'أحمر': '#ef4444',
            'ازرق': '#3b82f6',
            'أزرق': '#3b82f6',
            'اسود': '#111827',
            'أسود': '#111827',
            'ابيض': '#f9fafb',
            'أبيض': '#f9fafb',
            'رمادي': '#9ca3af',
            'اخضر': '#22c55e',
            'أخضر': '#22c55e',
            'اصفر': '#eab308',
            'أصفر': '#eab308',
            'وردي': '#ec4899',
            'بني': '#8b5e3c',
            'بنفسجي': '#a855f7',
            'برتقالي': '#f97316'
        };
        if (amap[raw]) return amap[raw];

        return null;
    }

    function setActiveColorChip(color) {
        const $wrap = $('#colorOptions');
        if (!$wrap.length) return;

        const target = (color || '').trim();
        $wrap.find('.js-color-chip').each(function(){
            const $btn = $(this);
            const btnColor = String($btn.data('color') || '').trim();
            const isActive = btnColor === target;
            $btn.toggleClass('is-active', isActive);
            $btn.attr('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function renderColorChips(variants, colorsFallback) {
        const $wrap = $('#colorOptions');
        if (!$wrap.length) return;

        $wrap.empty();

        const chips = [];
        if (Array.isArray(variants) && variants.length) {
            variants.forEach(function(v){
                chips.push({
                    color: v.color || 'Default',
                    variant_id: v.id || '',
                    image: v.image || ''
                });
            });
        } else if (Array.isArray(colorsFallback) && colorsFallback.length) {
            colorsFallback.forEach(function(c){
                chips.push({ color: c, variant_id: '', image: '' });
            });
        }

        // Render unique items (avoid duplicates).
        const seen = new Set();
        chips.forEach(function(c){
            const key = [c.color, c.variant_id, c.image].join('|');
            if (seen.has(key)) return;
            seen.add(key);

            const $btn = $('<button type="button" class="color-chip js-color-chip" aria-pressed="false"></button>');
            $btn.attr('data-color', c.color);
            if (c.variant_id) $btn.attr('data-variant-id', c.variant_id);
            if (c.image) $btn.attr('data-image', c.image);

            const $dot = $('<span class="color-dot" aria-hidden="true"></span>');
            const cssColor = colorLabelToCss(c.color);
            if (cssColor) $dot.css('background', cssColor);

            const $label = $('<span class="color-chip-label"></span>').text(c.color);
            $btn.append($dot, $label);
            $wrap.append($btn);
        });

        setActiveColorChip($('#color').val());

        // Auto-select if only one option
        if (chips.length === 1) {
            const first = chips[0];
            setActiveColorChip(first.color);
            if (first.variant_id) $('#add-cart, #checkout-now').attr('data-variant-id', first.variant_id);
        }
    }
$(document).on('click', '.js-show-modal1', function(e){
        e.preventDefault();

        let item_id = $(this).data('id');

        $.ajax({
            url: "/get-item",
            method: "POST",
            data: {id: item_id},

            success: function(response){
                const variants = response.variants || [];
                let images = response.images || [];
                if ((!images || !images.length) && variants.length) {
                    images = variants.map(v => v.image).filter(Boolean);
                }

                // update text

                if ($('.slick3').hasClass('slick-initialized')) {
                    $('.slick3').slick('unslick');
                }
                $('#name').text(response.name);
                if (response.old_price) {
                    $('#price').html(`<span class="modal-price-old">${response.old_price} ج.م</span> <span class="modal-price-new">${response.price} ج.م</span>`);
                } else {
                    $('#price').html(`<span class="modal-price-new">${response.price} ج.م</span>`);
                }
                $('#description').text(response.description);

                // update images with custom gallery logic
                const $mainImg = $('#custom-main-img');
                const $thumbsContainer = $('#custom-thumbs-container');
                $thumbsContainer.empty();

                if (images && images.length > 0) {
                    $mainImg.attr('src', images[0]);

                    images.forEach(function(img) {
                        const $thumb = $(`<img class="img-thumbnail" style="width: 70px; height: 70px; object-fit: cover; cursor: pointer; margin: 0 4px; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';" src="${img}">`);
                        $thumb.on('click', function() {
                            $mainImg.css('opacity', '0');
                            setTimeout(() => {
                                $mainImg.attr('src', img);
                                $mainImg.css('opacity', '1');
                            }, 150);
                        });
                        $thumbsContainer.append($thumb);
                    });
                } else {
                    $mainImg.attr('src', '/static/images/product-detail-01.jpg'); // fallback
                }
                // update colors + visible chips
                $('#color').html('');
                if (variants.length) {
                    variants.forEach(function(variant){
                        const colorName = variant.color || 'Default';
                        const opt = $('<option></option>').val(colorName).text(colorName);
                        if (variant.id) opt.attr('data-variant-id', variant.id);
                        if (variant.image) opt.attr('data-image', variant.image);
                        $('#color').append(opt);
                    });
                } else if (response.colors && response.colors.length) {
                    response.colors.forEach(function(color){
                        $('#color').append(`<option class='color-item' style="font-family:  'Cairo', 'sans-serif';">${color}</option>`);
                    });
                }

                renderColorChips(variants, response.colors || []);
                renderSizeChips(response.sizes || []);
                $('#add-cart, #checkout-now').attr('data-item-id', item_id);
                $('#color').trigger('change');
                // show modal
                $('.js-modal1').addClass('show-modal1');

                // Recalc layout after modal opens
                setTimeout(() => {
                    $('.slick3').slick('setPosition');
                    
                    // Refresh Lightbox
                    $('.gallery-lb').each(function() {
                        $(this).magnificPopup({
                            delegate: 'a',
                            type: 'image',
                            gallery: { enabled:true },
                            mainClass: 'mfp-fade'
                        });
                    });
                }, 300);
            }
        });
    });

    $(document).on('click', '.js-size-chip', function() {
        setActiveSizeChip($(this).data('size'));
    });

    
    $(document).on('change', '#color', function(){
        const opt = $(this).find('option:selected');
        const variantId = opt.attr('data-variant-id') || '';
        $('#add-cart, #checkout-now').attr('data-variant-id', variantId);
        setActiveColorChip($(this).val());
    });

    $(document).on('click', '.js-color-chip', function(){
        const $btn = $(this);
        const color = String($btn.data('color') || '').trim();
        const variantId = $btn.data('variant-id') || '';

        if (color) {
            const $select = $('#color');
            if ($select.length) {
                let $opt = $select.find('option').filter(function(){
                    return $(this).val() === color;
                }).first();

                if (!$opt.length) {
                    $select.append($('<option></option>').val(color).text(color));
                }

                $select.val(color).trigger('change');
            }
        }

        if (variantId) {
            $('#add-cart, #checkout-now').attr('data-variant-id', variantId);
        }

        setActiveColorChip(color);
    });
$('.js-hide-modal1').on('click', function(){
        $('.js-modal1').removeClass('show-modal1');
    });


    $('.js-hide-modal1').on('click', function(){

        $('.js-modal1').removeClass('show-modal1');
    });



    function setActiveSizeChip(size) {
        const $wrap = $('#sizeOptions');
        if (!$wrap.length) return;

        const target = (size || '').trim();
        $wrap.find('.js-size-chip').each(function(){
            const isActive = String($(this).data('size')).trim() === target;
            $(this).toggleClass('is-active', isActive);
        });
    }

    function renderSizeChips(sizes) {
        const $wrap = $('#sizeOptions');
        if (!$wrap.length) return;
        $wrap.empty();

        if (Array.isArray(sizes) && sizes.length) {
            sizes.forEach(size => {
                const $btn = $('<button type="button" class="size-chip js-size-chip"></button>')
                    .text(size)
                    .attr('data-size', size);
                $wrap.append($btn);
            });

            // Auto-select if only one option
            if (sizes.length === 1) {
                setActiveSizeChip(sizes[0]);
            }
        }
    }

})(jQuery);


