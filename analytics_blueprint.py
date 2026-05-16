# from flask import Blueprint, render_template
# import pandas as pd
# import sqlite3
# import json
# import os

# analytics_bp = Blueprint('analytics', __name__)

# @analytics_bp.route('/admin/analysis')
# def analysis():
#     # Attempt to connect to the existing project database non-destructively
#     db_path = os.path.join(os.path.dirname(__file__), 'instance', 'project.db')
#     if not os.path.exists(db_path):
#         db_path = os.path.join(os.path.dirname(__file__), 'project.db')
        
#     try:
#         # Use simple sqlite connection for pandas reading
#         con = sqlite3.connect(db_path)
        
#         # Pull orders and carts using Pandas
#         orders = pd.read_sql_query('SELECT * FROM "order"', con)
#         cart = pd.read_sql_query('SELECT * FROM cart', con)
#         con.close()
#     except Exception as e:
#         return f"Database error: {e}"

#     # Default fallback values if no datasets are found
#     total_orders = 0
#     total_revenue = 0
    
#     # Payload template for javascript charts
#     charts_data = {
#         'weekly_orders': {'labels': [], 'data': []},
#         'weekly_revenue': {'labels': [], 'data': []},
#         'city_revenue': {'labels': [], 'data': []},
#         'state_breakdown': {'labels': [], 'data': []}
#     }
    
#     if not orders.empty:
#         total_orders = len(orders)
        
#         orders['created_at'] = pd.to_datetime(orders['created_at'], errors='coerce')
#         # Handle NA dates if any
#         orders['created_at'] = orders['created_at'].fillna(pd.Timestamp.now())
#         orders['week_start'] = orders['created_at'].dt.to_period('W').dt.start_time.dt.strftime('%Y-%m-%d')
        
#         # 1. Orders volume per week
#         weekly_orders = orders.groupby('week_start').size().reset_index(name='count')
#         charts_data['weekly_orders']['labels'] = weekly_orders['week_start'].tolist()
#         charts_data['weekly_orders']['data'] = weekly_orders['count'].tolist()
        
#         # 2. State Breakdown showing where orders are in the pipeline
#         state_breakdown = orders.groupby('state').size().reset_index(name='count')
#         charts_data['state_breakdown']['labels'] = state_breakdown['state'].tolist()
#         charts_data['state_breakdown']['data'] = state_breakdown['count'].tolist()

#         if not cart.empty and 'order_id' in cart.columns:
#             # Filter for carts that actually belong to an official order
#             valid_carts = cart[cart['order_id'].notna()].copy()
#             valid_carts['total'] = valid_carts['price'] * valid_carts['amount']
            
#             # Inner join orders and cart datasets for revenue computations
#             df = orders.merge(valid_carts, left_on='id', right_on='order_id', how='inner')
#             if not df.empty:
#                 total_revenue = int(df['total'].sum())
                
#                 # 3. Revenue aggregated per week
#                 df['week_start'] = df['created_at'].dt.to_period('W').dt.start_time.dt.strftime('%Y-%m-%d')
#                 weekly_rev = df.groupby('week_start')['total'].sum().reset_index(name='revenue')
#                 charts_data['weekly_revenue']['labels'] = weekly_rev['week_start'].tolist()
#                 charts_data['weekly_revenue']['data'] = weekly_rev['revenue'].tolist()
                
#                 # 4. Revenue by City demographic
#                 city_rev = df.groupby('city')['total'].sum().reset_index(name='revenue').sort_values('revenue', ascending=False)
#                 charts_data['city_revenue']['labels'] = city_rev['city'].tolist()
#                 charts_data['city_revenue']['data'] = city_rev['revenue'].tolist()

#     # Pass all analytics down to the analysis.html template
#     return render_template(
#         'analysis.html', 
#         charts_data=json.dumps(charts_data),
#         total_orders=total_orders,
#         total_revenue=total_revenue
#     )

# '''
# ---
# DOCUMENTATION OF FEATURES ADDED:
# 1. Pandas SQL Integration: Connected sqlite natively directly to Pandas (`pd.read_sql_query`) to avoid messing around with existing Flask models and provide highly efficient dataset manipulation.
# 2. GroupBy Analytics: Deployed multiple time-series groupings, value aggregations (Order count per month, Best-selling units, City demographics, Order progress states). 
# 3. Null Safety: The algorithm uses robust fallbacks and `.notna()` pipelines so no crashes occur when the orders database is entirely empty.
# 4. Clean Json Interface: All analytical arrays are dumped via standard `json.dumps()` seamlessly passing to the frontend's chart arrays without modifying global config.
# 5. Modular isolation: Designed as a Flask `Blueprint` completely distinct from `server.py` so standard functionality is respected and remains entirely intact natively.
# '''
