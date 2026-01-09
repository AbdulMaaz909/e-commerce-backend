import { getAllProducts } from "../model/productModel.js";

export const getProducts = async (req,res) => {
    try{
        const products = await getAllProducts();
        res.status(200).json(products);
    }catch(error){
        console.error("error fetching products",error);
        res.status(500).json({message:"Server Error: Could not fetch products"})
    }
}