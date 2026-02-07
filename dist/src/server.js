import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
const port = config.common.port;
async function main() {
    try {
        await prisma.$connect();
        console.log("connected to the databse successfully");
        app.listen(port, () => {
            console.log(`Skill Bridge server is running on ${port}`);
        });
    }
    catch (error) {
        console.log("An error occured");
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
