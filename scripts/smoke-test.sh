#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
LOG_FILE="/tmp/cultivation_server.log"
RESPONSE_FILE="/tmp/cultivation_response.html"

python -m http.server "${PORT}" >"${LOG_FILE}" 2>&1 &
SERVER_PID=$!
cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# give the server a brief moment to start
sleep 1

STATUS=$(curl -s -o "${RESPONSE_FILE}" -w "%{http_code}" "http://localhost:${PORT}/index.html")
if [[ "${STATUS}" != "200" ]]; then
  echo "Expected 200 from index.html, got ${STATUS}."
  exit 1
fi

grep -q "Celestial Cultivation" "${RESPONSE_FILE}"
echo "Smoke test passed: index.html served with expected content."
