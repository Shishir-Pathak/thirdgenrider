import { z } from "zod";

const agentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(255),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(255),
  email: z.string().email("Valid email address is required").max(100),
  panNumber: z.string().min(4, "PAN number is required").max(50),
  citizenshipNumber: z.string().min(3, "Citizenship number is required").max(50),
  businessName: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
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
      businessName,
      description,
    } = req.body;

    agentSchema.parse({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      password,
      panNumber: panNumber?.trim(),
      citizenshipNumber: citizenshipNumber?.trim(),
      businessName: businessName?.trim() || undefined,
      description: description?.trim() || undefined,
    });

    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      const firstError = e.errors[0]?.message || "Validation error";
      return res.status(400).json({ message: firstError, errors: e.errors });
    }
    console.error("Agent Validation Error:", e);
    res.status(400).json({ message: "Invalid registration data" });
  }
};
