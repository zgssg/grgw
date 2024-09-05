<?php
session_start();

// CSRF令牌生成
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 设置HTTP头信息，增加网页安全性
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';");
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: no-referrer-when-downgrade");
header("X-XSS-Protection: 1; mode=block");

// 读取聊天记录
$chat_file = "chat.txt";
$messages = file_exists($chat_file) ? file($chat_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>聊天页面</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>聊天室</h1>

        <?php if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true): ?>
            <a href="admin_dashboard.php" class="admin-link">进入后台</a>
        <?php endif; ?>

        <div class="chat-log">
            <?php foreach ($messages as $message): ?>
                <p><?php echo nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')); ?></p>
            <?php endforeach; ?>
        </div>

        <form method="POST" action="post.php">
            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8'); ?>">
            <textarea name="message" placeholder="输入消息..."></textarea>
            <button type="submit">发送</button>
        </form>
    </div>
</body>
</html>
