const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const newProduct = function(req) {
	console.log(products[-1])
	let newProduct = {
		id: (products.length + 1),
		name: req.body.name,
		price: req.body.price,
		discount: req.body.discount,
		category: req.body.category,
		description: req.body.description,
		image: req.files[0].filename,
	};
	products.push(newProduct);
	let productsJSON = JSON.stringify(products);
	return productsJSON
}
const deleteProduct = function(req) {
	const product = products.find(item =>  item.id == req.params.id);
	let index = products.indexOf(product);
	let productsModify = products.splice(index, 1);
	let productsJSON = JSON.stringify(productsModify);
	return productsJSON
}



const controller = {
	// Root - Show all products
	index: (req, res, next) => {
			res.render ('products', {products, toThousand})
	},

	// Detail - Detail from one product
	detail: (req, res, next) => {
		const product = products.find(item =>  item.id == req.params.id);
		if(product.discount) {
			product.finalPrice = toThousand(product.price * (1 - product.discount/100))
		} else {
			product.price = toThousand (product.price)
		}

		res.render('detail', {product, title: product.name})
	},

	// Create - Form to create
	create: (req, res, next) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res, next) => {
		fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), newProduct(req));
		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res, next) => {
		const productToEdit = products.find(item =>  item.id == req.params.id);
		res.render('product-edit-form', {productToEdit, title: 'Editando ' + productToEdit.name})
	},
	// Update - Method to update
	update: (req, res, next) => {
		// fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), deleteProduct(req));
		// fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), newProduct(req));
		res.render('detail', {product, title: product.name})
	},

	// Delete - Delete one product from DB
	destroy : (req, res, next) => {
		fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), deleteProduct(req));
		res.redirect('/products')
	}
};

module.exports = controller;
