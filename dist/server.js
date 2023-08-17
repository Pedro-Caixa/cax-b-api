"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 12121;
const server = app_1.app.listen(port, () => console.log(`Listening on port ${port}\nhttp://localhost:${port}`));
process.on('SIGINT', () => {
    server.close();
    console.log(`Application was interrupted`);
});
