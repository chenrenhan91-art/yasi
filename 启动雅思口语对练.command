#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
echo "======================================================"
echo "🎙️ 正在启动 IELTS Speaking AI Studio 雅思口语实时对练工具..."
echo "👉 访问地址: http://localhost:$PORT"
echo "💡 提示: 支持本地自然人声引擎与麦克风权限持久化"
echo "======================================================"
(sleep 1 && open "http://localhost:$PORT") &
/usr/bin/python3 server.py
