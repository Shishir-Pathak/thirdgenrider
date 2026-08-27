import { z } from "zod";

const agentSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  password: z.string().min(8).max(255),
  email: z.string().min(8).max(100).email(),
  panNumber: z.string().length(10),
  citizenshipNumber: z.string().min(5).max(20),
});

export const validateAgent = (req, res, next) => {
  try {
    const {
      firstName,
      password,
      lastName,
      email,
      panNumber,
      citizenshipNumber,
    } = req.body;
    console.log(firstName, lastName);
    agentSchema.parse({
      firstName,
      lastName,
      email,
      password,
      panNumber,
      citizenshipNumber,
    });
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: e,
    });
  }
};
