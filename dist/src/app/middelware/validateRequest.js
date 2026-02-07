import { catchAsync } from "./catchAsync";
const validateRequest = (schema) => {
    return catchAsync(async (req, res, next) => {
        await schema.parseAsync({
            ...req.body,
            cookies: req.cookies,
        });
        next();
    });
};
export default validateRequest;
