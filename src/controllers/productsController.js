const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


const controller = {
	// Root - Show all products
	index: (req, res) => {
			res.render ('products', {products, toThousand})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = products.find(item =>  item.id == req.params.id);
		if(product.discount) {
			product.finalPrice = toThousand(product.price * (1 - product.discount/100))
		} else {
			product.price = toThousand (product.price)
		}

		res.render('detail', {product, title: product.name})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		res.send(req.body)
	},

	// Update - Form to edit
	edit: (req, res) => {
		const productToEdit = products.find(item =>  item.id == req.params.id);
		res.render('product-edit-form', {productToEdit, title: 'Editando ' + productToEdit.name})
	},
	// Update - Method to update
	update: (req, res) => {
		res.render('detail', {product, title: product.name})
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		res.redirect('/')
	}
};

module.exports = controller;
