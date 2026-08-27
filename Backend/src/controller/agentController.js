import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../config/uploadToCloudinary.js";
export async function agentRegister(req, res) {
  try {
    const { email, password } = req.body;
    const found = await User.findByEmail(email);
    console.log(found);
    if (found?.id || found?.length) {
      return res.status(401).json({
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const citizenshipFile = req.files?.ctznShipFile?.[0];
    const panFile = req.files?.panFile?.[0];

    if (!citizenshipFile || !panFile) {
      return res.status(400).json({
        message: "Citizenship and PAN files are required.",
      });
    }

    const citizenshipResult = await uploadToCloudinary(citizenshipFile.buffer, {
      folder: "agents/citizenship",
    });

    const panResult = await uploadToCloudinary(panFile.buffer, {
      folder: "agents/pan",
    });
    await User.create({
      ...req.body,
      password: hashedPassword,
      role: "none",
      citizenshipPhoto: citizenshipResult?.url,
      panPhoto: panResult?.url,
    });
    res.json({
      message: "Successfull",
    });
  } catch (e) {
    console.error(e);
    if (e == "Error: EMAIL_ALREADY_EXISTS") {
      res.status(401).json({
        message: "Email Already exists",
      });
    }
    res.status(500).json({
      message: e,
    });
  }
}

export async function agentLogin(req, res) {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findByEmail(email);
    if (!foundUser.length) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    if (foundUser?.role === "none") {
      return res.json({
        message: "Your request is being verified...",
      });
    }
    const compare = await bcrypt.compare(password, found[0]?.password);
    if (!compare)
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    const accessToken = jwt.sign(
      {
        id: foundUser[0]?.id,
        role: foundUser[0]?.role || "none",
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login Successful",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
}

export async function getAllAgent(req, res) {
  try {
    const found = await User.findAll();
    res.status(200).json({
      message: "All agents found",
      agents: found,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function deleteAgent(req, res) {
  try {
    await User.delete(req?.id);
    res.status(200).json({
      message: "Agent Deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateAgent(req, res) {
  try {
    const { id } = req.params.id;
    if (!id) {
      return res.json(404).json({ message: "Not found" });
    }
    await User.update(id, req.body);
    res.status(200).json({ message: "Agents Updated Succesfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json("Internal server error");
  }
}
