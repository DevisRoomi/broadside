<?php
/**
 * THE BROADSIDE — Laravel Herd / Valet Proxy & Dispatch Gateway
 * Serves http://broadside.test directly from Laravel Herd.
 * Proxies traffic to Express.js (http://127.0.0.1:5000) when running.
 */

$expressHost = 'http://127.0.0.1:5000';
$requestUri  = $_SERVER['REQUEST_URI'] ?? '/';
$method      = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Quick heartbeat probe to check if Express is active on port 5000
$ch = curl_init($expressHost . '/api');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT_MS     => 600,
    CURLOPT_CONNECTTIMEOUT_MS => 400,
    CURLOPT_NOBODY         => true,
]);
$probe = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$isExpressRunning = ($httpCode > 0 && $httpCode < 500);

if ($isExpressRunning) {
    // Reverse-proxy the request to Express server
    $targetUrl = $expressHost . $requestUri;
    $headers = [];
    foreach (getallheaders() as $name => $value) {
        if (strtolower($name) !== 'host') {
            $headers[] = "$name: $value";
        }
    }
    $headers[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? 'broadside.test');

    $proxy = curl_init($targetUrl);
    curl_setopt($proxy, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($proxy, CURLOPT_HEADER, true);
    curl_setopt($proxy, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($proxy, CURLOPT_HTTPHEADER, $headers);

    if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
        $input = file_get_contents('php://input');
        curl_setopt($proxy, CURLOPT_POSTFIELDS, $input);
    }

    $response = curl_exec($proxy);
    $headerSize = curl_getinfo($proxy, CURLINFO_HEADER_SIZE);
    $responseCode = curl_getinfo($proxy, CURLINFO_HTTP_CODE);
    curl_close($proxy);

    $rawHeaders = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);

    http_response_code($responseCode);
    foreach (explode("\r\n", $rawHeaders) as $hdr) {
        if ($hdr && !preg_match('/^(Transfer-Encoding|Connection):/i', $hdr)) {
            header($hdr, false);
        }
    }
    echo $body;
    exit;
}

// Fallback: If Express server is idle, render high-contrast broadside splash
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>THE BROADSIDE — Laravel Herd Gateway</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@800;900&family=JetBrains+Mono:wght@500;700&family=Newsreader:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f8f6f0;
      color: #000;
      font-family: 'Newsreader', Georgia, serif;
      padding: 30px 15px;
      line-height: 1.6;
    }
    .wrapper {
      max-width: 860px;
      margin: 0 auto;
      border: 3px solid #000;
      background: #fff;
      padding: 40px;
      box-shadow: 12px 12px 0 #000;
    }
    .top-wire {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 46px;
      text-transform: uppercase;
      line-height: 1;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .status-badge {
      display: inline-block;
      background: #000;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      padding: 4px 10px;
      font-weight: 700;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    .callout {
      border-left: 4px solid #000;
      padding-left: 20px;
      margin: 20px 0;
      font-size: 19px;
      font-style: italic;
    }
    .code-box {
      background: #f1ede4;
      border: 1px solid #000;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      margin: 16px 0;
      overflow-x: auto;
    }
    .spec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 24px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }
    .spec-item {
      border: 1px solid #000;
      padding: 12px;
      background: #faf8f5;
    }
    .spec-item strong { display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="top-wire">
      <span>LARAVEL HERD VALET GATEWAY</span>
      <span>SITE: broadside.test</span>
      <span>STATUS: EXPRESS PROXY STANDBY</span>
    </div>

    <span class="status-badge">HERD INTEGRATION ACTIVE</span>
    <h1>THE BROADSIDE</h1>
    <p class="callout">
      FullStack JavaScript Editorial Dispatch Desk. Express REST API • JWT Auth • Prisma ORM • React Context.
    </p>

    <p style="margin-bottom: 16px; font-size: 16px;">
      Laravel Herd successfully maps <strong>http://broadside.test</strong> to this installation directory.
      To activate the real-time Express & React dispatch desk, run:
    </p>

    <div class="code-box">
      cd C:\Users\Lenovo\Herd\broadside<br>
      npm start
    </div>

    <p style="font-size: 14px; color: #444;">
      Once started, refreshing <strong>http://broadside.test</strong> will instantly render the full high-contrast broadsheet interface through Herd's reverse-proxy gateway, or visit directly at <strong>http://localhost:5000</strong>.
    </p>

    <div class="spec-grid">
      <div class="spec-item">
        <strong>RESTful API & JWT:</strong>
        Express.js backend with stateless token auth and role-based permissions.
      </div>
      <div class="spec-item">
        <strong>Prisma ORM & DB:</strong>
        Relational models for Dispatches, Categories, Authors & Editions.
      </div>
      <div class="spec-item">
        <strong>React & Context API:</strong>
        High-Contrast Editorial Broadside client with AuthContext state distribution.
      </div>
      <div class="spec-item">
        <strong>Laravel Herd:</strong>
        Native parked site at <code>http://broadside.test</code> with smart proxy.
      </div>
    </div>
  </div>
</body>
</html>
