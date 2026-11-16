import React, { useState, useEffect } from 'react';

// Sample clothing items you sell
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Classic Oversized Hoodie', price: 25000, category: 'Hoodies', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Slim Fit Denim Jacket', price: 35000, category: 'Jackets', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Urban Cargo Pants', price: 20000, category: 'Pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Minimalist Cotton Tee', price: 12000, category: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('store'); // 'store' or 'admin'
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('clothing_store_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('clothing_store_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleString(),
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress
      },
      items: cart,
      total: calculateTotal(),
      status: 'Pending'
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation Header */}
      <header className="bg-black text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">THREAD & CO.</h1>
          <nav className="flex gap-4">
            <button 
              onClick={() => setActiveTab('store')} 
              className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'store' ? 'bg-white text-black' : 'hover:bg-gray-800'}`}
            >
              🛍️ Storefront
            </button>
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`px-4 py-2 rounded-lg font-medium transition relative ${activeTab === 'admin' ? 'bg-white text-black' : 'hover:bg-gray-800'}`}
            >
              🔒 Admin Dashboard
              {orders.filter(o => o.status === 'Pending').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {orders.filter(o => o.status === 'Pending').length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* SUCCESS NOTIFICATION */}
        {orderSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow">
            <strong className="font-bold">Success! </strong>
            <span>Your order has been placed successfully. The store owner has received it.</span>
          </div>
        )}

        {activeTab === 'store' ? (
          /* ================= STOREFRONT VIEW ================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Products List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Featured Collection</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {INITIAL_PRODUCTS.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col justify-between">
                    <div>
                      <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                      <div className="p-4">
                        <span className="text-xs text-indigo-600 font-semibold uppercase">{product.category}</span>
                        <h3 className="font-bold text-lg mt-1">{product.name}</h3>
                        <p className="text-gray-600 font-semibold mt-2">₦{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart & Checkout Panel */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h3 className="text-xl font-bold mb-4">Your Shopping Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500 py-6 text-center">Your cart is empty.</p>
              ) : (
                <>
                  <div className="divide-y max-h-60 overflow-y-auto mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="py-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">₦{item.price.toLocaleString()} x {item.qty}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    <h4 className="font-semibold text-sm text-gray-700">Delivery Information</h4>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      required
                      value={customerPhone} 
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                    />
                    <textarea 
                      placeholder="Delivery Address" 
                      required
                      rows="2"
                      value={customerAddress} 
                      onChange={e => setCustomerAddress(e.target.value)}
                      className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                    ></textarea>
                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
                    >
                      Place Order Now
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        ) : (
          /* ================= ADMIN DASHBOARD VIEW ================= */
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Admin Order Management</h2>
                <p className="text-gray-500 text-sm">Review clothes orders placed by customers.</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border font-semibold text-sm">
                Total Orders: {orders.length}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                <p className="text-gray-500 text-lg">No customer orders received yet.</p>
                <p className="text-gray-400 text-sm mt-1">Switch to the storefront tab and place a test order!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{order.id}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-400">{order.date}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                        <p><strong>Customer:</strong> {order.customer.name} ({order.customer.phone})</p>
                        <p><strong>Address:</strong> {order.customer.address}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ordered Items:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {order.items.map((it, idx) => (
                            <li key={idx}>{it.name} (Qty: {it.qty}) - ₦{(it.price * it.qty).toLocaleString()}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                      <div className="text-right">
                        <span className="text-xs text-gray-500">Total Amount</span>
                        <div className="text-xl font-extrabold text-indigo-600">₦{order.total.toLocaleString()}</div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm border rounded-lg px-3 py-1.5 bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-black"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
