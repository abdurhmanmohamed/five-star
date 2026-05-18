from datetime import datetime
# server.py

import base64
import uuid
import imghdr
import requests
from flask import Flask, flash,session
from flask import render_template, url_for, redirect, request,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, Mapped,DeclarativeBase,relationship
from sqlalchemy import DateTime, String, Integer,ForeignKey
from werkzeug.security import check_password_hash, generate_password_hash

from flask_login import LoginManager,UserMixin,login_user, login_required,current_user,logout_user
# from analytics_blueprint import analytics_bp
from flask_compress import Compress
from flask_caching import Cache
from sqlalchemy.orm import joinedload
import os
app= Flask(__name__)
Compress(app)
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 300})

# app.register_blueprint(analytics_bp)
login_manager = LoginManager(app)
app.secret_key='abdomohamed'
# app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL") 
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres.yhjnathafjhaqbuzzcql:abdo_mohamd@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
SUPABASE_URL = 'https://yhjnathafjhaqbuzzcql.supabase.co'
SUPABASE_KEY = 'sb_publishable_Mce89B-UqmCCIbGzXIBcoA_L6xoQyTQ'
BUCKET = 'data'
login_manager.login_view = 'login'
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
db.init_app(app)

class Admin(db.Model, UserMixin):
    __tablename__ = "admin"
    id:Mapped[int] = mapped_column(Integer,primary_key=True)
    name:Mapped[str] = mapped_column(String(150), nullable=False)
    number:Mapped[int] = mapped_column(Integer, nullable=False)
    password:Mapped[int] = mapped_column(String(255), nullable=False)

class ItemDetails(db.Model):
    __tablename__='itemdetails'
    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    name:Mapped[str] = mapped_column(String(150), nullable=False)
    description:Mapped[str] = mapped_column(String(500), nullable=False)
    price:Mapped[int] = mapped_column(Integer, nullable=False)
    old_price:Mapped[int] = mapped_column(Integer, nullable=True)
    discount_label:Mapped[str] = mapped_column(String(50), nullable=True)
    visability:Mapped[int] = mapped_column(Integer, nullable=False,default=1)
    category:Mapped[str] = mapped_column(String(50), nullable=True, default='')
    item_colors = relationship('ItemColor',backref='details')
    item_sizes = relationship('ItemSize',backref='details')
    item_imgs = relationship('ItemImg',backref='details')


class ItemColor(db.Model):
    __tablename__='itemcolor'
    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    color:Mapped[str] = mapped_column(String(150),)
    item_id:Mapped[int] = mapped_column(Integer, ForeignKey('itemdetails.id'))
    
class ItemSize(db.Model):
    __tablename__='itemsize'
    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    size:Mapped[str] = mapped_column(String(150),)
    item_id:Mapped[int] = mapped_column(Integer, ForeignKey('itemdetails.id'))
    
class ItemImg(db.Model):
    __tablename__='itemimg'
    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    img:Mapped[str] = mapped_column(String(255),)
    item_id:Mapped[int] = mapped_column(Integer, ForeignKey('itemdetails.id'))
    

class Order(db.Model):
    __tablename__='order'
    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    name:Mapped[str] = mapped_column(String(155),nullable=False)
    phone:Mapped[str] = mapped_column(String(155),nullable=False)
    second_phone:Mapped[str] = mapped_column(String(155))
    city:Mapped[str] = mapped_column(String(155),nullable=False)
    adress:Mapped[str] = mapped_column(String(250),nullable=False)
    message:Mapped[str] = mapped_column(String(500))
    created_at = db.Column(DateTime, default=datetime.utcnow)
    state:Mapped[str] = mapped_column(String(155),default='order')
    total_price:Mapped[int] = mapped_column(Integer, nullable=True)
    ordered_items = relationship('Cart',backref='order')
    

class Cart(db.Model):
    __tablename__='cart'
    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    img:Mapped[str] = mapped_column(String(255))
    color:Mapped[str] = mapped_column(String(150))
    name:Mapped[str] = mapped_column(String(150), nullable=False)
    price:Mapped[int] = mapped_column(Integer, nullable=False)
    amount:Mapped[int] = mapped_column(Integer, nullable=False)
    size:Mapped[str] = mapped_column(String(150), nullable=False, default="")
    session_id:Mapped[str] = mapped_column(String(100), nullable=True)  # Guest session tracking
    order_id:Mapped[str] = mapped_column(Integer, ForeignKey('order.id'), nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "img": self.img,
            "amount": self.amount,
            "color": self.color,
            "size": self.size,
            "price": self.price,
        }
    
class ShippingPrice(db.Model):
    __tablename__='shipping_prices'
    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    city:Mapped[str] = mapped_column(String(155), nullable=False)
    price:Mapped[int] = mapped_column(Integer, nullable=False)



with app.app_context():
    db.create_all()
    from sqlalchemy import text, inspect
    inspector = inspect(db.engine)

    # Migrate 'order' table for total_price
    if 'order' in inspector.get_table_names():
        order_columns = [col["name"] for col in inspector.get_columns("order")]
        if "total_price" not in order_columns:
            try:
                db.session.execute(text('ALTER TABLE "order" ADD COLUMN total_price INTEGER'))
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"Migration error (order table): {e}")

    # Migrate 'itemdetails' table for category
    if 'itemdetails' in inspector.get_table_names():
        item_columns = [col["name"] for col in inspector.get_columns("itemdetails")]
        if "category" not in item_columns:
            try:
                db.session.execute(text("ALTER TABLE itemdetails ADD COLUMN category VARCHAR(50) DEFAULT ''"))
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"Migration error (itemdetails table): {e}")


@login_manager.user_loader
def userloader(user_id):
    return db.get_or_404(Admin, user_id)


@app.route('/')
@cache.cached(timeout=60, query_string=True)
def home():
    keyword = request.args.get('search')
    if keyword:
        items_list = ItemDetails.query.options(joinedload(ItemDetails.item_imgs)).filter(ItemDetails.visability==1,ItemDetails.name.ilike(f"%{keyword}%")).all()
    else:
        items_list = db.session.query(ItemDetails).options(joinedload(ItemDetails.item_imgs)).filter(ItemDetails.visability==1).all()

    # Calculate Top Selling (Items with most total amount in orders)
    from sqlalchemy import func, text
    top_selling_names = db.session.query(
        Cart.name,
        func.sum(Cart.amount).label('total_sold')
    ).filter(Cart.order_id.isnot(None))\
     .group_by(Cart.name)\
     .order_by(text('total_sold DESC'))\
     .limit(10).all()
    
    top_selling_list = [item[0] for item in top_selling_names]
    
    return render_template('index.html', items = items_list, top_selling = top_selling_list)


@app.route('/shoping')
@cache.cached(timeout=60)
def shop():
    items = db.session.query(ItemDetails).options(joinedload(ItemDetails.item_imgs)).filter(ItemDetails.visability==1).all()
    
    # Calculate Top Selling
    from sqlalchemy import func, text
    top_selling_names = db.session.query(
        Cart.name,
        func.sum(Cart.amount).label('total_sold')
    ).filter(Cart.order_id.isnot(None))\
     .group_by(Cart.name)\
     .order_by(text('total_sold DESC'))\
     .limit(10).all()
    
    top_selling_list = [item[0] for item in top_selling_names]

    return render_template('shop.html', items = items, top_selling = top_selling_list)

@app.route('/shoping-cart')
def shoping_cart():
    cart_items = Cart.query.filter_by(session_id=session['session_id']).all()
    total_price = sum(item.price*item.amount for item in cart_items)
    
    return render_template('shoping-cart.html', items = cart_items , total_price = total_price)


@app.route('/login',methods=['POST', 'GET'])
def login():
    if request.method =='POST':
        entered_name = request.form['name']
        admin = db.session.query(Admin).filter_by(name=entered_name).first()
        if not admin:
             flash(f"اسم المستخدم '{entered_name}' غير موجود")
             return render_template('login.html')
        elif admin.number !=request.form.get('number',type=int):
            flash('رقم الهاتف المدخل غير صحيح')
            return render_template('login.html', name = entered_name,password= request.form['password'])
        elif not check_password_hash(admin.password,request.form['password']):
            flash('كلمة المرور المدخلة غير صحيحة')
            return render_template('login.html', name = entered_name, number =request.form.get('number',type=int))
             
        else:
           login_user(admin)
           return redirect(url_for('dashboard'))

    else:
        return render_template('login.html')

    

@app.route('/register',methods=['POST', 'GET'])
# @login_required
def register():
    if request.method=='POST':
        ent_name = request.form['name']
        ent_pass = request.form['password']
        ent_confirmed_pass = request.form['c_password']
        if db.session.query(Admin).filter_by(name =ent_name).first():
            flash(f"اسم المدير '{ent_name}' مسجل بالفعل. يرجى تسجيل الدخول")
            return redirect(url_for('login'))

        elif ent_pass != ent_confirmed_pass:
            flash('تأكيد كلمة المرور غير متطابق')
            return render_template('register.html', name = ent_name, password = ent_pass, c_password=ent_confirmed_pass, number =request.form.get('number',type=int))
        else:
            hashed_password = generate_password_hash(ent_pass,'scrypt',8)
            new_admin = Admin(
                name=ent_name, 
                password = hashed_password, 
                number=request.form.get('number',type=int),
                )
            db.session.add(new_admin)
            db.session.commit()
            return redirect(url_for('dashboard'))

    else:
        return render_template('register.html')

@app.route('/checkout', methods = ['POST', 'GET'])
def check_out():
    
    cart_items = Cart.query.filter_by(session_id=session['session_id'], order_id=None).all()
    total_amount = sum(item.amount for item in cart_items)
    total_price = sum(item.price*item.amount for item in cart_items)
    shipping_prices = ShippingPrice.query.all()
    if request.method =='POST':
        selected_city_price = ShippingPrice.query.filter_by(city=request.form['city']).first()
        shipping_cost = selected_city_price.price if selected_city_price else 0

        final_total = total_price + shipping_cost

        order = Order(
            name = request.form['fullname'],
            phone = request.form['phone'],
            second_phone = request.form['second-phone'],
            city = request.form['city'],
            adress = request.form['adress'],
            message = request.form['msg'],
            total_price = final_total
        )
        db.session.add(order)
        db.session.commit()

        # 2️⃣ Assign cart items of this session to the order
        for item in cart_items:
            item.order_id = order.id

        db.session.commit()

        # 3️⃣ Start fresh session for next order (don't delete — regenerate)
        session['session_id'] = str(uuid.uuid4())
        return render_template('after-order.html')

    elif not cart_items:
        return redirect(url_for('home'))
    else:
        return render_template('checkout.html', items_num = total_amount,total_price=total_price, shipping_prices=shipping_prices)

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/admin/returns')
@login_required
def return_dashboard():
    return render_template('return_dashboard.html')

@app.route('/admin/shipping')
@login_required
def shipping_dashboard():
    prices = ShippingPrice.query.all()
    return render_template('shipping_dashboard.html', prices=prices)

@app.route('/admin/shipping/add', methods=['POST'])
@login_required
def add_shipping_price():
    city = request.form.get('city')
    price = request.form.get('price', type=int)
    if city and price is not None:
        new_price = ShippingPrice(city=city, price=price)
        db.session.add(new_price)
        db.session.commit()
    return redirect(url_for('shipping_dashboard'))

@app.route('/admin/shipping/delete/<int:id>', methods=['POST'])
@login_required
def delete_shipping_price(id):
    price_to_delete = db.session.query(ShippingPrice).get(id)
    if price_to_delete:
        db.session.delete(price_to_delete)
        db.session.commit()
    return redirect(url_for('shipping_dashboard'))

# give data to js
@app.route("/get-item", methods=["POST"])
def get_item():

    item_id = request.form.get("id",type = int)

    item = db.get_or_404(ItemDetails, item_id)
    imgs_list = [img.img for img in item.item_imgs]
    colors_list = [color.color for color in item.item_colors]
    sizes_list = [size.size for size in item.item_sizes]
    return jsonify({
        "name": item.name,
        "price": item.price,
        "old_price": item.old_price,
        "discount_label": item.discount_label,
        "description": item.description,
        "images": imgs_list,
        "colors": colors_list,
        "sizes": sizes_list
    })
    

@app.route('/add-to-cart',methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'بيانات الطلب غير صالحة'}), 400
        item_id = int(data['id'])
        print(data)
        item_with_id = db.get_or_404(ItemDetails, item_id)
        item_img = item_with_id.item_imgs[0].img if item_with_id.item_imgs else "default.png"

        # Ensure session_id exists (safe fallback)
        if 'session_id' not in session:
            session['session_id'] = str(uuid.uuid4())

        cart_prduct = Cart(name = item_with_id.name, 
                           img = item_img,
                           color = data.get('color', ''),
                           size = data.get('size', ''),
                           price= item_with_id.price,
                           amount = int(data.get('amount', 1)),
                           session_id=session['session_id'],
                           order_id=None  # Not assigned yet
                           )
        db.session.add(cart_prduct)
        db.session.commit()

        return jsonify({'status': 'success', 'name': item_with_id.name, 'message': 'تمت إضافة المنتج للسلة!'})
    except Exception as e:
        print(f"Add to cart error: {e}")
        return jsonify({'status': 'error', 'message': 'حدث خطأ أثناء إضافة المنتج للسلة'}), 500

@app.route('/get-cart-items', methods=['POST'])
def get_cart_items():

    cart_items =  Cart.query.filter_by(session_id=session['session_id']).all()
    total_price = sum(item.price*item.amount for item in cart_items)
    items = [item.to_dict() for item in cart_items]
    
    return jsonify({
        'items': items,
        'total_price':total_price
        })

@app.route('/change-amount', methods=['POST'])
def change_item_amount():
    data = request.get_json(force=True)
    item_id = int(data['id'])
    new_amount = int(data['amount'])

    item_to_change = Cart.query.filter_by(session_id=session['session_id'],id=item_id).first()

    if new_amount == 0:
        db.session.delete(item_to_change)
        db.session.commit()
        cart_items = Cart.query.filter_by(session_id=session['session_id']).all()
        total_price = sum(item.price*item.amount for item in cart_items)
        return jsonify({
            'total_price': total_price,
            'price': 0,           # item removed
            'removed': True       # flag for JS
        })
    else:
        item_to_change.amount = new_amount
        db.session.commit()

        cart_items = Cart.query.filter_by(session_id=session['session_id']).all()
        total_price = sum(item.price*item.amount for item in cart_items)
        return jsonify({
            'total_price': total_price,
            'price': item_to_change.price,
            'removed': False
        })

@app.route('/remove-cart-item', methods=['POST'])
def remove_item_amount():

    item_id = request.form['id']
    item_to_change = Cart.query.filter_by(session_id=session['session_id'],id=item_id).first()
    db.session.delete(item_to_change)
    db.session.commit()
    cart_items = Cart.query.filter_by(session_id=session['session_id']).all()
    total_price = sum(item.price*item.amount for item in cart_items)
    print(total_price)
    return jsonify({
            'total_price': total_price,
        })

@app.route('/get-orders', methods=['POST'])
def get_orders():

    state = request.form['state']
    orders_list = Order.query.filter_by(state=state).all()[::-1]

    orders = []

    for order in orders_list:
        if order.total_price is None:
            items_tot = sum(i.price * i.amount for i in order.ordered_items)
            items_count = sum(i.amount for i in order.ordered_items)
            if items_count >= 2:
                items_tot -= 50
            final_p = items_tot
        else:
            final_p = order.total_price

        ordered_items = [item.to_dict() for item in order.ordered_items]
        data = {
            'id': order.id,
            'username': order.name,
            'first_number': order.phone,
            'second_number': order.second_phone,
            'city': order.city,
            'adress': order.adress,
            'message': order.message,
            'created_at': order.created_at.strftime("%Y-%m-%d %H:%M"),
            'state': order.state,
            'total_price': final_p,
            'ordered_items': ordered_items
        }

        orders.append(data)
    print(orders)

    return jsonify({'orders': orders})

@app.route('/update-order-state', methods=['POST'])
def update_order_state():

    order_id = request.form.get("id")
    new_state = request.form.get("state")

    order = Order.query.get(order_id)

    if order:
        order.state = new_state
        db.session.commit()
        return jsonify({"success": True})

    return jsonify({"success": False})

@app.before_request
def ensure_session():
    if 'session_id' not in session:
        import uuid
        session['session_id'] = str(uuid.uuid4())

@app.route('/get-order-data', methods = ['POST'])
def get_order_data():
    item_id = int(request.form['id'])
    order = db.session.query(Order).filter_by(id = item_id).first()
    
    if order.total_price is None:
        items_tot = sum(i.price * i.amount for i in order.ordered_items)
        items_count = sum(i.amount for i in order.ordered_items)
        if items_count >= 2:
            items_tot -= 50
        final_p = items_tot
    else:
        final_p = order.total_price

    ordered_items = [item.to_dict() for item in order.ordered_items]
    order_data = {
            'id': order.id,
            'username': order.name,
            'first_number': order.phone,
            'second_number': order.second_phone,
            'city': order.city,
            'adress': order.adress,
            'message': order.message,
            'created_at': order.created_at.strftime("%Y-%m-%d %H:%M"),
            'state': order.state,
            'total_price': final_p,
            'ordered_items': ordered_items
        }
    print(order_data)
    return jsonify(order_data)

# add new item
@app.route("/admin/add-item", methods=["POST"])
def add_item():

    data = request.json

    name = data["name"]
    price = data["price"]
    description = data["description"]
    colors = data["colors"]
    old_price = data.get("old_price") or None
    discount_label = data.get("discount_label") or None

    # transform the imgs from the bata64 in to images with name and then post it into superbase storage and then same the public url
    image_links = []
    images_data = data.get("images", [])
    for img in images_data:
        header, encoded = img.split(",", 1)
        binary = base64.b64decode(encoded)
        ext = imghdr.what(None, binary) or "png"
        filename = f"{uuid.uuid4()}.{ext}"

        url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{filename}"
        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "apikey": SUPABASE_KEY,
            "Content-Type": f"image/{ext}"
        }

        r = requests.put(url, headers=headers, data=binary)
        if r.status_code not in [200, 201]:
            raise Exception(f"Upload failed: {r.text}")

        # Public URL
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
        image_links.append(public_url)

   
    new_item = ItemDetails(name=name, price=price, description=description,
                           old_price=int(old_price) if old_price else None,
                           discount_label=discount_label,
                           category=data.get("category", "") or "")
    db.session.add(new_item)
    db.session.commit()  # commit once to get new_item.id

    # Add colors
    for color in colors:
        new_item_color = ItemColor(color=color, item_id=new_item.id)
        db.session.add(new_item_color)

    # Add sizes
    sizes = data.get("sizes", [])
    for size in sizes:
        new_item_size = ItemSize(size=size, item_id=new_item.id)
        db.session.add(new_item_size)

    # Add images
    for link in image_links:
        new_item_img = ItemImg(img=link, item_id=new_item.id)
        db.session.add(new_item_img)

    db.session.commit()  # final commit after adding all
    cache.clear()  # Invalidate home/shop cache immediately
    print(name, price, description,colors,image_links)
    return jsonify({"status":"ok"})

@app.route('/delete-item/<int:id>',methods=['POST'])
def delete(id):
    print(id)
    targeted_item=db.get_or_404(ItemDetails,id)
    targeted_item.visability =0
    print(id)
    db.session.commit()
    cache.clear()  # Invalidate home/shop cache immediately
    return jsonify({'status': 'success'})

@app.route('/return-policy')
def return_policy():
    return render_template('return-policy.html')

@app.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy-policy.html')

@app.route('/shipping-policy')
def shipping_policy():
    return render_template('shipping-policy.html')

@app.route("/admin/edit-item/<int:id>")
def edit_item_page(id):
    item = ItemDetails.query.get_or_404(id)
    return render_template("edit-item.html", item=item)

@app.route("/admin/delete-image/<int:id>", methods=["POST"])
def delete_image(id):
    img = ItemImg.query.get_or_404(id)

    if not img:
        return jsonify({"error": "not found"}), 404

    db.session.delete(img)
    db.session.commit()

    return jsonify({"success": True})

@app.route("/admin/update-item/<int:id>", methods=["POST"])
def update_item(id):
    data = request.get_json()
    name = data.get('n')
    price = data.get("price")
    description = data.get("description")
    old_price = data.get("old_price") or None
    discount_label = data.get("discount_label") or None
    item = ItemDetails.query.get_or_404(id)
    item.name = name
    item.price = price
    item.description = description
    item.old_price = int(old_price) if old_price else None
    item.discount_label = discount_label
    item.category = data.get("category", "") or ""

    # handle colors
    colors = data.get("colors", [])
    # Always clear then re-add if the field is present (to allow emptying)
    if isinstance(colors, list):
        ItemColor.query.filter_by(item_id=id).delete()
        for color_name in colors:
            clean_name = color_name.strip()
            if clean_name:
                new_c = ItemColor(color=clean_name, item_id=id)
                db.session.add(new_c)

    # handle sizes
    sizes = data.get("sizes", [])
    if isinstance(sizes, list):
        ItemSize.query.filter_by(item_id=id).delete()
        for size_name in sizes:
            clean_name = size_name.strip()
            if clean_name:
                new_s = ItemSize(size=clean_name, item_id=id)
                db.session.add(new_s)

    # handle images here if needed
    image_links = []
    images_data = data.get("images", [])
    for img in images_data:
        header, encoded = img.split(",", 1)
        binary = base64.b64decode(encoded)
        ext = imghdr.what(None, binary) or "png"
        filename = f"{uuid.uuid4()}.{ext}"

        url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{filename}"
        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "apikey": SUPABASE_KEY,
            "Content-Type": f"image/{ext}"
        }

        r = requests.put(url, headers=headers, data=binary)
        if r.status_code not in [200, 201]:
            raise Exception(f"Upload failed: {r.text}")

        # Public URL
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
        image_links.append(public_url)

    for image in image_links:
        new_image = ItemImg(img=image, item_id = id)
        db.session.add(new_image)
    db.session.commit()
    cache.clear()  # Invalidate home/shop cache immediately

    return jsonify({"status": "success"})

@app.route("/admin/analysis")
@login_required
def admin_analysis():
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
#     # 1. Total Stats
#     total_orders = Order.query.count()
#     total_revenue = db.session.query(func.sum(Order.total_price)).scalar() or 0
    
#     # 2. State Breakdown (Pie/Doughnut)
#     states = db.session.query(Order.state, func.count(Order.id)).group_by(Order.state).all()
#     state_labels = [s[0].capitalize() for s in states]
#     state_data = [s[1] for s in states]
    
#     # 3. City Revenue (Doughnut)
#     cities = db.session.query(Order.city, func.sum(Order.total_price)).group_by(Order.city).order_by(func.sum(Order.total_price).desc()).limit(7).all()
#     city_labels = [c[0] for c in cities]
#     city_data = [int(c[1] or 0) for c in cities]
    
#     # 4. Weekly Revenue & Orders (Line/Bar)
#     # Get last 8 weeks of data
#     eight_weeks_ago = datetime.utcnow() - timedelta(weeks=8)
#     weekly_data = db.session.query(
#         Order.created_at, 
#         Order.total_price
#     ).filter(Order.created_at >= eight_weeks_ago).all()
    
#     # Group in Python for cross-DB compatibility (SQLite vs Postgres date functions)
#     weeks = {}
#     for i in range(8):
#         start_of_week = (datetime.utcnow() - timedelta(weeks=i)).isocalendar()[1]
#         weeks[start_of_week] = {"rev": 0, "ord": 0}
        
#     for o_date, o_price in weekly_data:
#         w_num = o_date.isocalendar()[1]
#         if w_num in weeks:
#             weeks[w_num]["rev"] += (o_price or 0)
#             weeks[w_num]["ord"] += 1
            
#     # Sort weeks chronologically
#     sorted_weeks = sorted(weeks.items())
#     weekly_labels = [f"Week {w[0]}" for w in sorted_weeks]
#     weekly_rev_data = [w[1]["rev"] for w in sorted_weeks]
#     weekly_ord_data = [w[1]["ord"] for w in sorted_weeks]
    
#     charts_data = {
#         "state_breakdown": {"labels": state_labels, "data": state_data},
#         "city_revenue": {"labels": city_labels, "data": city_data},
#         "weekly_revenue": {"labels": weekly_labels, "data": weekly_rev_data},
#         "weekly_orders": {"labels": weekly_labels, "data": weekly_ord_data}
#     }
    
#     import json
#     return render_template("analysis.html", 
#                            total_orders=total_orders, 
#                            total_revenue=int(total_revenue),
#                            charts_data=json.dumps(charts_data))
if __name__ == '__main__':
    app.run(debug=True)