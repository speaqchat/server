"use strict";
exports.__esModule = true;
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var cors_1 = require("cors");
var express_1 = require("express");
var helmet_1 = require("helmet");
var morgan_1 = require("morgan");
var routes_1 = require("./routes");
var app = (0, express_1["default"])();
exports.prisma = new client_1.PrismaClient();
app.use((0, cors_1["default"])({ origin: "*" }));
app.use((0, helmet_1["default"])());
app.use((0, morgan_1["default"])("dev"));
app.use(express_1["default"].json());
(0, routes_1.routes)(app);
app.listen(process.env.PORT, function () {
    console.log("\uD83D\uDCAB server running on port ".concat(process.env.PORT));
});
