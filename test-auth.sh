#!/bin/bash

echo "🧪 Testing Nirvi Authentication System"
echo "======================================"

BASE_URL="http://localhost:3000"

echo ""
echo "1️⃣ Testing User Registration"
echo "-------------------------------"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"securepass123","name":"Test User"}')

echo "Response: $REGISTER_RESPONSE"

echo ""
echo "2️⃣ Testing User Login"
echo "---------------------"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"securepass123"}')

echo "Response: $LOGIN_RESPONSE"

# Extract session token from the response (this is a simplified approach)
SESSION_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"ok":true' > /dev/null && \
  curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"securepass123"}' \
  -c cookies.txt > /dev/null && \
  grep session_token cookies.txt | cut -f7)

echo "Session token: $SESSION_TOKEN"

echo ""
echo "3️⃣ Testing User Info Endpoint"
echo "------------------------------"
if [ ! -z "$SESSION_TOKEN" ]; then
  ME_RESPONSE=$(curl -s -X GET $BASE_URL/api/auth/me \
    -H "Cookie: session_token=$SESSION_TOKEN")
  echo "Response: $ME_RESPONSE"
else
  echo "❌ No session token available"
fi

echo ""
echo "4️⃣ Testing Protected Route Access"
echo "-----------------------------------"
DASHBOARD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/dashboard)
echo "Dashboard access (no auth): HTTP $DASHBOARD_RESPONSE"

if [ ! -z "$SESSION_TOKEN" ]; then
  DASHBOARD_AUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/dashboard \
    -H "Cookie: session_token=$SESSION_TOKEN")
  echo "Dashboard access (with auth): HTTP $DASHBOARD_AUTH_RESPONSE"
fi

echo ""
echo "5️⃣ Testing Logout"
echo "------------------"
if [ ! -z "$SESSION_TOKEN" ]; then
  LOGOUT_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/logout \
    -H "Cookie: session_token=$SESSION_TOKEN")
  echo "Response: $LOGOUT_RESPONSE"
else
  echo "❌ No session token available"
fi

echo ""
echo "6️⃣ Testing Session Invalidation"
echo "--------------------------------"
if [ ! -z "$SESSION_TOKEN" ]; then
  ME_AFTER_LOGOUT=$(curl -s -X GET $BASE_URL/api/auth/me \
    -H "Cookie: session_token=$SESSION_TOKEN")
  echo "Response after logout: $ME_AFTER_LOGOUT"
fi

echo ""
echo "7️⃣ Testing Invalid Credentials"
echo "-------------------------------"
INVALID_LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"wrongpassword"}')
echo "Response: $INVALID_LOGIN"

echo ""
echo "8️⃣ Testing Duplicate Registration"
echo "------------------------------------"
DUPLICATE_REGISTER=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"anotherpass","name":"Another User"}')
echo "Response: $DUPLICATE_REGISTER"

echo ""
echo "✅ Authentication system test completed!"
echo "======================================"

# Cleanup
rm -f cookies.txt
