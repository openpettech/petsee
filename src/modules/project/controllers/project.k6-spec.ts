import http from 'k6/http';
import { check } from 'k6';

export const options = {
  thresholds: {
    ttp_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }], // http errors should be less than 1%
    http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
  },
  scenarios: {
    // arbitrary name of scenario
    average_load: {
      executor: 'ramping-vus',
      stages: [
        // ramp up to average load of 20 virtual users
        { duration: '10s', target: 20 },
        // maintain load
        { duration: '50s', target: 20 },
        // ramp down to zero
        { duration: '5s', target: 0 },
      ],
    },
  },
};

export default function () {
  const url = 'https://localhost:4000/projects';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer r7sPOOdIayGX14JKTTBoLL0IX0zG4sUzqov3mC8cxlWpsi6j6LNfy4lPQ5utI4h1kQIFLm4z03d471vQdSBVWcwUr3ly6lDke4AQ`,
    },
  };

  const res = http.get(url, params);
  check(res, { 'status was 200': (r) => r.status == 200 });
}
