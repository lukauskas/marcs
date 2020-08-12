import rateLimit from "axios-rate-limit";
import axios from "axios";

export const rateLimitedAxios = rateLimit(axios.create(),
    // This barely limits anything. I'm just trying to avoid a situation where multiple requests
    // are fired simultaneously as this confuses the visualisations for some reason
    { maxRequests: 1, perMilliseconds: 50 },
);