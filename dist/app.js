"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const index_1 = require("./routes/index");
exports.app = (0, express_1.default)();
// Middleware config
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
exports.app.use(express_1.default.json());
exports.app.use((0, morgan_1.default)('dev'));
// ENDPOINT INTEGRATION
exports.app.use('/api/v1', index_1.router);
// Root path response
exports.app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});
exports.default = exports.app;
