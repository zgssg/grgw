<?php
session_start();

// 防止XSS攻击和其他输入处理
function clean_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// 防止频繁请求
$ip_address = $_SERVER['REMOTE_ADDR'];
$time_limit = 10; // 限制时间（秒）
if (!isset($_SESSION['last_message_time'])) {
    $_SESSION['last_message_time'] = [];
}
if (isset($_SESSION['last_message_time'][$ip_address])) {
    $last_time = $_SESSION['last_message_time'][$ip_address];
    $current_time = time();
    if (($current_time - $last_time) < $time_limit) {
        die("发送消息太频繁，请稍后再试。");
    }
}

// CSRF令牌生成和验证
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die("无效的CSRF令牌");
    }

    // 验证和清理消息输入
    $message = clean_input($_POST['message']);
    if (empty($message)) {
        die("消息不能为空");
    }
    if (strlen($message) > 255) {
        die("消息太长，超过限制。");
    }

    // 记录消息到 chat.txt
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "$timestamp 匿名: $message\n";
    file_put_contents("chat.txt", $log_entry, FILE_APPEND);

    // 记录消息和IP地址到 ip_log.txt
    $ip_log_entry = "$timestamp 匿名 (IP: $ip_address): $message\n";
    file_put_contents("ip_log.txt", $ip_log_entry, FILE_APPEND);

    // 更新最后发送时间
    $_SESSION['last_message_time'][$ip_address] = time();

    // 清除CSRF令牌
    unset($_SESSION['csrf_token']);

    // 重定向回聊天页面
    header("Location: index.php");
    exit;
}

// 设置HTTP头信息，增加网页安全性
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';");
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: no-referrer-when-downgrade");
header("X-XSS-Protection: 1; mode=block");
?>
