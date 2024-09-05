<?php
session_start();

// 确保用户已登录并是管理员
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: index.php");
    exit;
}

// 处理清空聊天记录的请求
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['clear_chat'])) {
    $chat_file = "chat.txt";
    $ip_chat_file = "ip_log.txt";

    // 清空聊天记录文件
    if (file_exists($chat_file)) {
        file_put_contents($chat_file, '');
    }

    // 清空包含IP地址的聊天记录文件
    if (file_exists($ip_chat_file)) {
        file_put_contents($ip_chat_file, '');
    }

    // 设置消息提示
    $message = "聊天记录已清空。";
}

// 读取包含 IP 地址的聊天记录
$ip_chat_file = "ip_log.txt";
$messages = file_exists($ip_chat_file) ? file($ip_chat_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];

// 设置HTTP头信息，增加网页安全性
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';");
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: no-referrer-when-downgrade");
header("X-XSS-Protection: 1; mode=block");
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理员后台</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>管理员后台</h1>

        <?php if (isset($message)): ?>
            <p class="message"><?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?></p>
        <?php endif; ?>

        <form method="POST" action="">
            <button type="submit" name="clear_chat" class="clear-chat-button">清空聊天记录</button>
        </form>

        <div class="chat-log">
            <?php foreach ($messages as $message): ?>
                <p><?php echo nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')); ?></p>
            <?php endforeach; ?>
        </div>

        <a href="index.php" class="admin-link">返回聊天页面</a>
    </div>
</body>
</html>
