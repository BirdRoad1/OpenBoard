import rateLimit from 'express-rate-limit';

export const ratelimit = rateLimit({
  windowMs: 1000,
  limit: 5,
  ipv6Subnet: 56
});
