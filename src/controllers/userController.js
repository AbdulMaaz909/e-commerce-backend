import { createUser, getAllUsers } from "../model/userModel.js";

const addUser = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    await createUser(req.body);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Create user error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const fetchUser = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Fetch user error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export { addUser, fetchUser };