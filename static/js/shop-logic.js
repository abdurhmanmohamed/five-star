/* static/js/shop-logic.js */
(function($) {
    "use strict";

    // Global toggle for admin modal
    window.showAdminModal = function() {
        $(".js-admin-modal").addClass("show-admin-modal");
    };

    window.hideAdminModal = function() {
        $(".js-admin-modal").removeClass("show-admin-modal");
    };

    // Delete item functionality
    $(document).ready(function() {
        let currentItemId = null;

        $(document).on("click", ".delete-btn", function() {
            currentItemId = $(this).data("id");
            openConfirmPopup();
        });

        $('#popupDeleteBtn').on("click", function() {
            if (!currentItemId) return;
            fetch(`/delete-item/${currentItemId}`, {
                method: "POST",
            })
            .then((res) => res.json())
            .then((data) => {
                closeConfirmPopup();
                location.reload();
            });
        });
        
        // Add to cart delegation
        $(document).on("click", "#add-cart, #checkout-now", function() {
            let isCheckout = $(this).attr('id') === 'checkout-now';
            let itemId = $(this).attr('data-item-id');
            let variantId = $(this).attr('data-variant-id') || "";
            if (!itemId) return;
            
            let amount = $("#amount").val() || 1;
            let color = $(".js-color-chip.is-active").data("color") || "";
            let size = $(".js-size-chip.is-active").data("size") || "";

            // Validation: Requirement for color/size if more than 1 option exists
            if ($("#colorOptions .js-color-chip").length > 1 && !color) {
                swal("تنبيه", "يرجى اختيار اللون أولاً", "warning");
                return;
            }
            if ($("#sizeOptions .js-size-chip").length > 1 && !size) {
                swal("تنبيه", "يرجى اختيار المقاس أولاً", "warning");
                return;
            }

            fetch("/add-to-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: itemId,
                    variant_id: variantId,
                    amount: amount,
                    color: color,
                    size: size
                }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    updateCartBadge();
                    if (isCheckout) {
                        window.location.href = "/shoping-cart";
                    } else {
                        openCartConfirm();
                    }
                } else {
                    swal("Error", data.message || "Failed to add item", "error");
                }
            })
            .catch(err => {
                console.error(err);
                swal("Error", "Could not connect to server", "error");
            });
        });


        function showRomaireToast(msg) {
            let toast = $('<div class="romaire-toast">').text(msg);
            $("body").append(toast);
            setTimeout(() => toast.addClass("show"), 10);
            setTimeout(() => {
                toast.removeClass("show");
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        }

        window.updateCartBadge = function() {
            fetch("/get-cart-items", { method: "POST" })
            .then(res => res.json())
            .then(data => {
                let badge = $("#cart-badge-count");
                if (data.items && data.items.length >= 0) {
                    let totalItems = 0;
                    data.items.forEach(item => totalItems += item.amount);
                    badge.text(totalItems);
                    if (totalItems > 0) badge.fadeIn();
                    else badge.fadeOut();
                }
            });
        };
        updateCartBadge();
    });

    window.openCartConfirm = function() {
        document.getElementById("cart-confirm-overlay").classList.add("active");
    };

    window.closeCartConfirm = function() {
        document.getElementById("cart-confirm-overlay").classList.remove("active");
    };

    window.openConfirmPopup = function() {
        document.getElementById("confirmOverlay").classList.add("active");
    };

    window.closeConfirmPopup = function() {
        document.getElementById("confirmOverlay").classList.remove("active");
    };
    
    // User added this in shop-body.html manually
    window.confirmAction = function() {
        // This is triggered by #popupDeleteBtn's onclick if set
        // But we already have a jQuery listener above.
        // Let's just make it do nothing to avoid double call if already handled.
    };

    // Admin add modal logic
    let images = [];
    $(document).ready(function() {
        const imageInput = document.getElementById("imageInput");
        if (imageInput) {
            imageInput.addEventListener("change", function() {
                [...this.files].forEach((file) => {
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        images.push(e.target.result);
                        renderImages();
                    };
                    reader.readAsDataURL(file);
                });
            });
        }

        const addBtn = document.getElementById("add-new-item");
        if (addBtn) {
            addBtn.addEventListener("click", showAdminModal);
        }

        $(document).on("click", ".js-hide-admin-modal", hideAdminModal);
    });

    function renderImages() {
        const thumbContainer = document.getElementById("thumbContainer");
        const mainPreview = document.getElementById("mainPreview");
        if (!thumbContainer) return;
        thumbContainer.innerHTML = "";
        images.forEach((img, index) => {
            let div = document.createElement("div");
            div.className = "position-relative cursor-pointer";
            div.style.cursor = "pointer";
            div.innerHTML = `
                <img src="${img}" style="width:80px;height:80px;object-fit:cover" class="rounded border" onclick="setMainPreview('${img}')">
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0" onclick="event.stopPropagation(); deleteImage(${index})">x</button>
            `;
            thumbContainer.appendChild(div);
        });
        if (images.length > 0 && mainPreview) {
            mainPreview.src = images[0];
        }
    }

    window.setMainPreview = function(src) {
        const mainPreview = document.getElementById("mainPreview");
        if (mainPreview) mainPreview.src = src;
    };

    window.deleteImage = function(i) {
        images.splice(i, 1);
        renderImages();
    };

    // Color management
    $(document).on("click", "#addColor", function() {
        let val = $("#newColor").val();
        if (!val) return;
        let div = document.createElement("span");
        div.className = "badge bg-primary m-1 p-2";
        div.innerHTML = `
            ${val}
            <span onclick="this.parentElement.remove()" style="cursor:pointer"> ✕</span>
        `;
        document.getElementById("colorContainer").appendChild(div);
        $("#newColor").val("");
    });

    $(document).on("click", "#addSize", function() {
        let val = $("#newSize").val();
        if (!val) return;
        let div = document.createElement("span");
        div.className = "badge bg-secondary m-1 p-2";
        div.innerHTML = `
            ${val}
            <span onclick="this.parentElement.remove()" style="cursor:pointer"> ✕</span>
        `;
        document.getElementById("sizeContainer").appendChild(div);
        $("#newSize").val("");
    });

    // Save product
    $(document).on("click", "#saveItem", function() {
        let name = $("#itemName").val();
        let price = $("#itemPrice").val();
        let oldPrice = $("#itemOldPrice").val();
        let discountLabel = $("#itemDiscountLabel").val();
        let desc = $("#itemDesc").val();
        let colors = [...document.getElementById("colorContainer").children].map((el) => el.textContent.replace("✕", "").trim());
        let sizes = [...document.getElementById("sizeContainer").children].map((el) => el.textContent.replace("✕", "").trim());

        let data = {
            name: name,
            price: price,
            old_price: oldPrice,
            discount_label: discountLabel,
            description: desc,
            category: $("#itemCategory").val() || "",
            images: images,
            colors: colors,
            sizes: sizes
        };

        fetch("/admin/add-item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(res => {
            if (res.ok) location.reload();
            else alert("Failed to save product.");
        }).catch(err => {
            console.error(err);
            alert("An error occurred.");
        });
    });

    // Quantity controls
    $(document).on("click", ".minus-btn", function() {
        let input = $(this).siblings(".quantity-input");
        let value = parseInt(input.val());
        if (value > 1) input.val(value - 1);
    });

    $(document).on("click", ".plus-btn", function() {
        let input = $(this).siblings(".quantity-input");
        let value = parseInt(input.val());
        input.val(value + 1);
    });

    window.goToEditPage = function(id) {
        window.location.href = `/admin/edit-item/${id}`;
    };

})(jQuery);
