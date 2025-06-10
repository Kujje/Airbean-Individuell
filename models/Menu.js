import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  prodId: { type: String, required: true, unique: true },
  title: String,
  desc: String,
  price: Number
}, { collection: 'products' }); // 👈 pekar på rätt collection

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;