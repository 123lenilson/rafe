<?php
$posFile = __DIR__ . '/documentation/backend -/pos-module-doc.md';
$mainFile = __DIR__ . '/documentation/backend -/arquitectura-hexagonal-rafe.md';

$pos = file_get_contents($posFile);
$main = file_get_contents($mainFile);

// Try both line ending styles
$needle1 = "---\r\n\r\n## 9. Regras de Ouro";
$needle2 = "---\n\n## 9. Regras de Ouro";

if (strpos($main, $needle1) !== false) {
    $replacement = "---\r\n\r\n" . $pos . "\r\n\r\n---\r\n\r\n## 9. Regras de Ouro";
    $main = str_replace($needle1, $replacement, $main);
} elseif (strpos($main, $needle2) !== false) {
    $replacement = "---\n\n" . $pos . "\n\n---\n\n## 9. Regras de Ouro";
    $main = str_replace($needle2, $replacement, $main);
} else {
    // Append at end
    $main .= "\n\n---\n\n" . $pos;
}

file_put_contents($mainFile, $main);
echo "Done! File size: " . strlen($main) . " bytes\n";
