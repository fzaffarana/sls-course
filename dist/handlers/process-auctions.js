"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const get_ended_auctions_1 = require("../lib/get-ended-auctions");
const close_auction_1 = require("../lib/close-auction");
const processAutions = async () => {
    try {
        const auctionsToClose = await get_ended_auctions_1.getEndedAuctions();
        if (!auctionsToClose)
            return { closed: 0 };
        const promises = auctionsToClose.map(({ id }) => close_auction_1.closeAuction(id));
        await Promise.all(promises);
        return { closed: promises.length };
    }
    catch (error) {
        throw new http_errors_1.default.InternalServerError(error);
    }
};
exports.handler = processAutions;
